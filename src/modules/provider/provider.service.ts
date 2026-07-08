import { GearItemStatus, RentalOrderStatus } from '../../../generated/prisma/enums';
import { GearItemWhereInput, RentalOrderWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { IGearQuery } from '../admin/admin.interface';
import { ICreateGearItem, IUpdateGearItem } from '../gear/gear.interface';
import { IRentalQuery } from '../rental/rental.interface';

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

const getMyGear = async (userId: string, query: IGearQuery) => {
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

    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.gearItem.count({
    where: {
      AND: andConditions,
      providerId: userId,
    },
  });
  return {
    gear,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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

const getAllRentals = async (providerId: string, query: IRentalQuery) => {
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
          rentalItems: {
            some: { gearItem: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
          },
        },
        {
          rentalItems: {
            some: { gearItem: { brand: { contains: query.searchTerm, mode: 'insensitive' } } },
          },
        },
      ],
    });
  }

  const rentals = await prisma.rentalOrder.findMany({
    where: {
      AND: andConditions,
      rentalItems: {
        some: {
          gearItem: {
            providerId: providerId,
          },
        },
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
              quantityAvailable: true,
            },
          },
        },
      },
      payments: true,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.rentalOrder.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    rentals,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRentalById = async (providerId: string, rentalId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      rentalItems: {
        some: {
          gearItem: {
            providerId: providerId,
          },
        },
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
              quantityAvailable: true,
            },
          },
        },
      },
      payments: true,
    },
  });

  if (!rental) {
    throw new Error('Rental not found or you do not have permission to view it');
  }

  return rental;
};

const updateRentalStatus = async (
  providerId: string,
  rentalId: string,
  status: RentalOrderStatus,
) => {
  const existingRental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      rentalItems: {
        some: {
          gearItem: {
            providerId: providerId,
          },
        },
      },
    },
  });

  if (!existingRental) {
    throw new Error('Rental not found or you do not have permission to update its status');
  }

  const rental = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status,
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
  return rental;
};
const getAnalytics = async (providerId: string) => {
  const providerTransactions = await prisma.$transaction(async (tx) => {
    const [
      totalGears,
      totalActiveGears,
      totalInactiveGears,
      totalRentals,
      totalPendingRentals,
      totalCompletedRentals,
      totalCancelledRentals,
      totalPayments,
      totalPendingPayments,
      totalCompletedPayments,
      totalFailedPayments,
      totalCancelledPayments,
      totalRevenue,
    ] = await Promise.all([
      await tx.gearItem.count({
        where: {
          providerId: providerId,
        },
      }),
      await tx.gearItem.count({
        where: {
          providerId: providerId,
          status: 'AVAILABLE',
        },
      }),
      await tx.gearItem.count({
        where: {
          providerId: providerId,
          status: 'UNAVAILABLE',
        },
      }),
      await tx.rentalOrder.count({
        where: {
          rentalItems: {
            some: {
              gearItem: {
                providerId: providerId,
              },
            },
          },
        },
      }),
      await tx.rentalOrder.count({
        where: {
          rentalItems: {
            some: {
              gearItem: {
                providerId: providerId,
              },
            },
          },
          status: 'PENDING',
        },
      }),
      await tx.rentalOrder.count({
        where: {
          rentalItems: {
            some: {
              gearItem: {
                providerId: providerId,
              },
            },
          },
          status: 'CONFIRMED',
        },
      }),
      await tx.rentalOrder.count({
        where: {
          rentalItems: {
            some: {
              gearItem: {
                providerId: providerId,
              },
            },
          },
          status: 'CANCELLED',
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
          status: 'PENDING',
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
          status: 'PAID',
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
          status: 'FAILED',
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
          status: 'CANCELLED',
        },
      }),
      await tx.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          rentalOrder: {
            rentalItems: {
              some: {
                gearItem: {
                  providerId: providerId,
                },
              },
            },
          },
          status: 'PAID',
        },
      }),
    ]);
    return {
      totalGears,
      totalActiveGears,
      totalInactiveGears,
      totalRentals,
      totalPendingRentals,
      totalCompletedRentals,
      totalCancelledRentals,
      totalPayments,
      totalPendingPayments,
      totalCompletedPayments,
      totalFailedPayments,
      totalCancelledPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  });
  return providerTransactions;
};

const confirmRentalStatus = async (providerId: string, rentalId: string) => {
  const existingRental = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      rentalItems: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
    include: {
      rentalItems: {
        include: {
          gearItem: true,
        },
      },
    },
  });

  if (!existingRental) {
    throw new Error('Rental not found or you do not have permission to confirm this rental');
  }

  if (existingRental.status !== 'PENDING') {
    throw new Error('Only pending rentals can be confirmed');
  }

  // Check all items belong to this provider
  const invalidItem = existingRental.rentalItems.find(
    (item) => item.gearItem.providerId !== providerId,
  );

  if (invalidItem) {
    throw new Error('You cannot confirm rental items from another provider');
  }

  // Check stock and availability
  for (const item of existingRental.rentalItems) {
    if (item.gearItem.status !== 'AVAILABLE') {
      throw new Error(`${item.gearItem.name} is not available`);
    }

    if (item.gearItem.quantityAvailable < item.quantity) {
      throw new Error(`${item.gearItem.name} does not have enough stock`);
    }
  }

  const updatedRental = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
    },
    data: {
      status: 'CONFIRMED',
    },
    include: {
      rentalItems: {
        include: {
          gearItem: true,
        },
      },
    },
  });

  return updatedRental;
};

export const providerService = {
  createGear,
  getMyGear,
  getMyGearById,
  updateGear,
  deleteGear,
  updateGearStock,
  updateGearStatus,
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  getAnalytics,
  confirmRentalStatus,
};
