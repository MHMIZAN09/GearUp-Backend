import { JwtPayload } from 'jsonwebtoken';
import { ReviewWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { IReviewQuery, TReview } from './review.interface';

const createReview = async (customerId: string, payload: TReview) => {
  const { gearItemId, rentalOrderId, rating, comment } = payload;

  const gearItem = await prisma.gearItem.findUnique({
    where: {
      id: gearItemId,
    },
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
        some: {
          gearItemId,
        },
      },
    },
  });

  if (!rentalOrder) {
    throw new Error('You can only review gear after returning the rental order');
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
    throw new Error('You have already reviewed this gear for this rental order');
  }

  const result = await prisma.review.create({
    data: {
      gearItemId,
      customerId,
      rentalOrderId,
      rating,
      comment,
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

  return result;
};

const getAllReviews = async (query: IReviewQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: ReviewWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { comment: { contains: query.searchTerm, mode: 'insensitive' } },
        { gearItem: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
        { customer: { name: { contains: query.searchTerm, mode: 'insensitive' } } },
      ],
    });
  }

  const result = await prisma.review.findMany({
    where: {
      AND: andConditions,
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
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalReviews = await prisma.review.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    reviews: result,
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
    where: {
      id,
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

  if (!review) {
    throw new Error('Review not found');
  }

  return review;
};

const getMyReviews = async (customerId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      customerId,
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

  return reviews;
};

const deleteReview = async (customer: JwtPayload, id: string) => {
  const existingReview = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!existingReview) {
    throw new Error('Review not found');
  }
  // customer own review and admin can delete review

  if (existingReview.customerId !== customer.id && customer.role !== 'ADMIN') {
    throw new Error('You are not authorized to delete this review');
  }

  const deletedReview = await prisma.review.delete({
    where: {
      id,
    },
  });

  return deletedReview;
};

export const reviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  getMyReviews,
  deleteReview,
};
