import { GearItemStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICreateGearItem, IUpdateGearItem } from '../gear/gear.interface';

const createGear = async (providerId: string, payload: ICreateGearItem) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }
  const gear = await prisma.gearItem.create({
    data: {
      providerId: providerId,
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      quantityTotal: payload.quantityTotal,
      quantityAvailable: payload.quantityTotal,
      imageUrl: payload.imageUrl,
      categoryId: payload.categoryId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
  });
  return gear;
};

const getMyGear = async (userId: string) => {
  const gear = await prisma.gearItem.findMany({
    where: {
      providerId: userId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return gear;
};

const getMyGearById = async (userId: string, gearId: string) => {
  const gear = await prisma.gearItem.findFirst({
    where: {
      id: gearId,
      providerId: userId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
  });
  return gear;
};

const updateGear = async (providerId: string, gearId: string, payload: IUpdateGearItem) => {
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      id: gearId,
      providerId: providerId,
    },
  });

  if (!existingGear) {
    throw new Error('Gear not found or you do not have permission to update it');
  }

  const gear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      quantityTotal: payload.quantityTotal,
      quantityAvailable: payload.quantityTotal,
      imageUrl: payload.imageUrl,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
  });
  return gear;
};

const deleteGear = async (providerId: string, gearId: string) => {
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      id: gearId,
      providerId: providerId,
    },
  });

  if (!existingGear) {
    throw new Error('Gear not found or you do not have permission to delete it');
  }

  await prisma.gearItem.delete({
    where: {
      id: gearId,
    },
  });

  return null;
};

const updateGearStock = async (providerId: string, gearId: string, quantity: number) => {
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      id: gearId,
      providerId: providerId,
    },
  });

  if (!existingGear) {
    throw new Error('Gear not found or you do not have permission to update its stock');
  }

  const gear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: {
      quantityTotal: quantity,
      quantityAvailable: quantity,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
  });
  return gear;
};

const updateGearStatus = async (providerId: string, gearId: string, status: GearItemStatus) => {
  const existingGear = await prisma.gearItem.findFirst({
    where: {
      id: gearId,
      providerId: providerId,
    },
  });

  if (!existingGear) {
    throw new Error('Gear not found or you do not have permission to update its status');
  }

  const gear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: {
      status,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          address: true,
        },
      },
    },
  });
  return gear;
};

const getOrders = async () => {
  const orders = await prisma.rentalOrder.findMany({});
};

const getOrderById = async () => {};

const updateOrderStatus = async () => {};

export const providerService = {
  createGear,
  getMyGear,
  getMyGearById,
  updateGear,
  deleteGear,
  updateGearStock,
  updateGearStatus,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
