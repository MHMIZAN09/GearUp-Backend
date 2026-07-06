import { Prisma } from '../../../generated/prisma/browser';
import { GearItemStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICreateRentalOrderPayload } from './rental.interface';

const createRentalOrderIntoDB = async (customerId: string, payload: ICreateRentalOrderPayload) => {
  if (!customerId) {
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

  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.user.findUnique({
      where: {
        id: customerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        role: true,
        status: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.role !== 'CUSTOMER') {
      throw new Error('Only customers can create rental orders');
    }

    if (customer.status !== 'ACTIVE') {
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

    for (const item of rentalOrderItemsData) {
      const updatedResult = await tx.gearItem.updateMany({
        where: {
          id: item.gearItemId,
          quantityAvailable: {
            gte: item.quantity,
          },
        },
        data: {
          quantityAvailable: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedResult.count === 0) {
        throw new Error('Gear item quantity is not available');
      }

      const updatedGearItem = await tx.gearItem.findUnique({
        where: {
          id: item.gearItemId,
        },
        select: {
          id: true,
          quantityAvailable: true,
        },
      });

      if (updatedGearItem && updatedGearItem.quantityAvailable <= 0) {
        await tx.gearItem.update({
          where: {
            id: updatedGearItem.id,
          },
          data: {
            status: GearItemStatus.UNAVAILABLE,
          },
        });
      }
    }

    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate: start,
        endDate: end,
        notes,
        totalAmount,

        rentalItems: {
          create: rentalOrderItemsData,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
          },
        },
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
      },
    });

    return rentalOrder;
  });

  return result;
};

const getMyRentalOrdersFromDB = async (customerId: string) => {
  if (!customerId) {
    throw new Error('Customer id is required');
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
    },
  });

  return rentalOrders;
};

export const rentalService = {
  createRentalOrderIntoDB,
  getMyRentalOrdersFromDB,
};
