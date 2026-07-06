import { GearItemStatus, UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
  return user;
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
  return updatedUser;
};

const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      contactNumber: true,
      profilePhoto: true,
      address: true,
    },
  });
};

const getAllGears = async () => {
  const gears = await prisma.gearItem.findMany({
    where: {},
    select: {
      id: true,
      name: true,
      description: true,
      brand: true,
      imageUrl: true,
      pricePerDay: true,
      quantityTotal: true,
      quantityAvailable: true,
      status: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return gears;
};

const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      brand: true,
      imageUrl: true,
      pricePerDay: true,
      quantityTotal: true,
      quantityAvailable: true,
      status: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
  return gear;
};

const updateGearStatus = async (gearId: string, status: GearItemStatus) => {
  const updatedGear = await prisma.gearItem.update({
    where: {
      id: gearId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      description: true,
      brand: true,
      imageUrl: true,
      pricePerDay: true,
      quantityTotal: true,
      quantityAvailable: true,
      status: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
  return updatedGear;
};

const deleteGear = async (gearId: string) => {
  await prisma.gearItem.delete({
    where: {
      id: gearId,
    },
  });
};

export const adminService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAllGears,
  getGearById,
  updateGearStatus,
  deleteGear,
};
