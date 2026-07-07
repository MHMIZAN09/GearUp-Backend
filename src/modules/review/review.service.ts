import { prisma } from '../../lib/prisma';
import { TReview } from './review.interface';

const createReview = async (customerId: string, payload: TReview) => {
  const { gearItemId, rentalOrderId, rating, comment } = payload;

  // Rating validation
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Comment validation
  if (!comment?.trim()) {
    throw new Error('Comment is required');
  }

  // Check rental order
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
    throw new Error('You can only review a gear after returning the rental order');
  }

  // Duplicate review check
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
    throw new Error('You have already reviewed this gear');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      gearItemId,
      customerId,
      rentalOrderId,
      rating,
      comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      gearItem: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });



  return review;
};

export const reviewService = {
  createReview,
};
