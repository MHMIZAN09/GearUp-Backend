import { GearItemWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { IGearQuery } from '../admin/admin.interface';

const getAllGear = async (query: IGearQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: GearItemWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: 'insensitive' } },
        { description: { contains: query.searchTerm, mode: 'insensitive' } },
        { brand: { contains: query.searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (query.minPrice) {
    andConditions.push({
      pricePerDay: { gte: Number(query.minPrice) },
    });
  }

  if (query.maxPrice) {
    andConditions.push({
      pricePerDay: { lte: Number(query.maxPrice) },
    });
  }

  if (query.minAvailable) {
    andConditions.push({
      quantityTotal: { gte: Number(query.minAvailable) },
    });
  }

  if (query.maxAvailable) {
    andConditions.push({
      quantityTotal: { lte: Number(query.maxAvailable) },
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }
  const gear = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
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
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });
  const totalCount = await prisma.gearItem.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    gear,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
  };
};

const getGearById = async (gearId: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: gearId,
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

export const gearService = {
  getAllGear,
  getGearById,
};
