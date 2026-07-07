import { GearItemStatus, UserStatus } from '../../../generated/prisma/enums';
import { GearItemWhereInput, UserWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { IGearQuery, IUserQuery } from './admin.interface';

const getAllUsers = async (query: IUserQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: 'insensitive' } },
        { email: { contains: query.searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (query.status) {
    andConditions.push({ status: query.status });
  }

  if (query.role) {
    andConditions.push({ role: query.role });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      profilePhoto: true,
      contactNumber: true,
      address: true,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalUsers = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    users,
    meta: {
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
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

const getAllGears = async (query: IGearQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: GearItemWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: { contains: query.searchTerm, mode: 'insensitive' },
        },
        {
          description: { contains: query.searchTerm, mode: 'insensitive' },
        },
        {
          brand: { contains: query.searchTerm, mode: 'insensitive' },
        },
      ],
    });
  }

  if (query.status) {
    andConditions.push({ status: query.status });
  }
  if (query.providerId) {
    andConditions.push({ providerId: query.providerId });
  }
  if (query.categoryId) {
    andConditions.push({ categoryId: query.categoryId });
  }

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      pricePerDay: {
        gte: query.minPrice ? Number(query.minPrice) : undefined,
        lte: query.maxPrice ? Number(query.maxPrice) : undefined,
      },
    });
  }
  if (query.minAvailable || query.maxAvailable) {
    andConditions.push({
      quantityAvailable: {
        gte: query.minAvailable ? Number(query.minAvailable) : undefined,
        lte: query.maxAvailable ? Number(query.maxAvailable) : undefined,
      },
    });
  }

  const gears = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
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

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalGears = await prisma.gearItem.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    gears,
    meta: {
      page,
      limit,
      total: totalGears,
      totalPages: Math.ceil(totalGears / limit),
    },
  };
};
const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
    },
    include: {
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

const getAnalytics = async () => {
  const totalUsers = await prisma.user.count();
  const totalGears = await prisma.gearItem.count();

  return {
    totalUsers,
    totalGears,
  };
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
  getAnalytics,
};
