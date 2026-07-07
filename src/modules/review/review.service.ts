import { prisma } from '../../lib/prisma';
import { TReview } from './review.interface';

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


export const reviewService = {
  createReview,
};
