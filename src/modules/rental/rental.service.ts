import { Prisma } from '../../../generated/prisma/client';
import { GearItemStatus } from '../../../generated/prisma/enums';
import { RentalOrderWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { paymentService } from '../payment/payment.service';
import { ICreateRentalOrderPayload, IRentalQuery } from './rental.interface';

const createRentalOrderIntoDB = async (authCustomer: any, payload: ICreateRentalOrderPayload) => {
  if (!authCustomer?.id) {
    throw new Error('Customer id is required');
  }

  const { startDate, endDate, notes, rentalItems } = payload;

  if (!rentalItems || rentalItems.length === 0) {
    throw new Error('At least one rental item is required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid start date or end date');
  }

  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  const rentalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  rentalItems.forEach((item) => {
    if (!item.gearItemId) {
      throw new Error('Gear item id is required');
    }

    if (!item.quantity || Number(item.quantity) <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (!Number.isInteger(Number(item.quantity))) {
      throw new Error('Quantity must be an integer number');
    }
  });

  const gearItemIds = rentalItems.map((item) => item.gearItemId);
  const uniqueGearItemIds = new Set(gearItemIds);

  if (uniqueGearItemIds.size !== gearItemIds.length) {
    throw new Error('Duplicate gear item is not allowed in the same rental order');
  }

  // Check if customer already has a pending rental order
  // const existingOrder = await prisma.rentalOrder.findFirst({
  //   where: {
  //     customerId: authCustomer.id,
  //     status: 'PENDING',
  //   },
  //   include: {
  //     customer: {
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         contactNumber: true,
  //         address: true,
  //       },
  //     },
  //   },
  // });

  // if (existingOrder) {
  //   const paymentData = await paymentService.initiatePayment(
  //     existingOrder.customer,
  //     existingOrder as any,
  //   );

  //   return {
  //     order: existingOrder,
  //     paymentURL: paymentData.GetWayURL,
  //   };
  // }

  const createdData = await prisma.$transaction(async (tx) => {
    const dbCustomer = await tx.user.findUnique({
      where: {
        id: authCustomer.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        address: true,
        role: true,
        status: true,
      },
    });

    if (!dbCustomer) {
      throw new Error('Customer not found');
    }

    if (dbCustomer.role !== 'CUSTOMER') {
      throw new Error('Only customers can create rental orders');
    }

    if (dbCustomer.status !== 'ACTIVE') {
      throw new Error('Your account is not active. You cannot create rental order');
    }

    const gearItems = await tx.gearItem.findMany({
      where: {
        id: {
          in: gearItemIds,
        },
      },
      select: {
        id: true,
        name: true,
        pricePerDay: true,
        quantityAvailable: true,
        status: true,
        providerId: true,
      },
    });

    if (gearItems.length !== gearItemIds.length) {
      throw new Error('One or more gear items not found');
    }

    const rentalOrderItemsData = rentalItems.map((item) => {
      const gearItem = gearItems.find((gear) => gear.id === item.gearItemId);

      if (!gearItem) {
        throw new Error('Gear item not found');
      }

      if (gearItem.status !== GearItemStatus.AVAILABLE) {
        throw new Error(`${gearItem.name} is not available for rent`);
      }

      const quantity = Number(item.quantity);

      if (gearItem.quantityAvailable < quantity) {
        throw new Error(
          `Insufficient quantity for gear item: ${gearItem.name}. Available quantity: ${gearItem.quantityAvailable}`,
        );
      }

      const perDayPrice = new Prisma.Decimal(gearItem.pricePerDay);
      const subTotal = perDayPrice.mul(quantity).mul(rentalDays);

      return {
        gearItemId: gearItem.id,
        quantity,
        perDayPrice,
        subTotal,
      };
    });

    const totalAmount = rentalOrderItemsData.reduce((sum, item) => {
      return sum.plus(item.subTotal);
    }, new Prisma.Decimal(0));

    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId: dbCustomer.id,
        startDate: start,
        endDate: end,
        notes,
        totalAmount,
        rentalItems: {
          create: rentalOrderItemsData,
        },
      },
      include: {
        rentalItems: {
          include: {
            gearItem: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
                pricePerDay: true,
              },
            },
          },
        },
      },
    });

    return {
      customer: dbCustomer,
      rentalOrder,
    };
  });

  const paymentData = await paymentService.initiatePayment(
    createdData.customer,
    createdData.rentalOrder,
  );

  return {
    order: createdData.rentalOrder,
    paymentURL: paymentData.GetWayURL,
  };
};

const getMyRentalOrdersFromDB = async (customerId: string, query: IRentalQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: RentalOrderWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          notes: { contains: query.searchTerm, mode: 'insensitive' },
        },
      ],
    });
  }

  const rentalOrders = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      rentalItems: {
        include: {
          gearItem: {
            select: {
              id: true,
              name: true,
              brand: true,
              imageUrl: true,
              pricePerDay: true,
              quantityAvailable: true,
            },
          },
        },
      },
      payments: true,
    },
  });

  return rentalOrders;
};

const getSingleRentalOrderFromDB = async (customerId: string, rentalOrderId: string) => {
  const rentalOrder = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      customerId,
    },
    include: {
      rentalItems: {
        include: {
          gearItem: {
            select: {
              id: true,
              name: true,
              brand: true,
              imageUrl: true,
              pricePerDay: true,
              quantityAvailable: true,
              provider: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  contactNumber: true,
                },
              },
            },
          },
        },
      },
      payments: true,
    },
  });

  if (!rentalOrder) {
    throw new Error('Rental order not found');
  }

  return rentalOrder;
};

export const rentalService = {
  createRentalOrderIntoDB,
  getMyRentalOrdersFromDB,
  getSingleRentalOrderFromDB,
};
