import { JwtPayload } from 'jsonwebtoken';
import { ReviewWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { IReviewQuery, TReview } from './review.interface';

const createReview = async (
  customerId: string,
  payload: TReview,
) => {
  const { gearItemId, rentalOrderId, rating, comment } = payload;

  const gearItem = await prisma.gearItem.findUnique({
    where: { id: gearItemId },
    select: { id: true },
  });

  if (!gearItem) {
    throw new Error('Gear item not found');
  }

  const rentalOrder = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalOrderId,
      customerId,
      status: 'RETURNED',
      rentalItems: {
        some: { gearItemId },
      },
    },
    select: { id: true },
  });

  if (!rentalOrder) {
    throw new Error(
      'You can only review gear after returning the rental order',
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      gearItemId_customerId_rentalOrderId: {
        gearItemId,
        customerId,
        rentalOrderId,
      },
    },
  });

  if (existingReview) {
    throw new Error(
      'You have already reviewed this gear for this rental order',
    );
  }

  return prisma.review.create({
    data: {
      gearItemId,
      customerId,
      rentalOrderId,
      rating,
      comment,
      status: 'VISIBLE',
    },
    include: {
      gearItem: true,
      rentalOrder: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const getAllReviews = async (query: IReviewQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';

  const allowedSortFields = [
    'createdAt',
    'updatedAt',
    'rating',
  ];

  if (!allowedSortFields.includes(sortBy)) {
    throw new Error('Invalid sort field');
  }

  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new Error('Invalid sort order');
  }

  const andConditions: ReviewWhereInput[] = [];

  if (query.searchTerm?.trim()) {
    const searchTerm = query.searchTerm.trim();

    andConditions.push({
      OR: [
        {
          comment: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          gearItem: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }

  const where: ReviewWhereInput = {
    AND: andConditions,
    status: 'VISIBLE',
  };

  const [reviews, totalReviews] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        gearItem: true,
        rentalOrder: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),

    prisma.review.count({ where }),
  ]);

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total: totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
    },
  };
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      gearItem: true,
      rentalOrder: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};

const getMyReviews = async (customerId: string) => {
  return prisma.review.findMany({
    where: { customerId },
    include: {
      gearItem: true,
      rentalOrder: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const deleteReview = async (customer: JwtPayload, id: string) => {
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new Error('Review not found');
  }

  if (
    existingReview.customerId !== customer.id &&
    customer.role !== 'ADMIN'
  ) {
    throw new Error('You are not authorized to delete this review');
  }

  return prisma.review.delete({
    where: { id },
  });
};





export const reviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  getMyReviews,
  deleteReview,
};