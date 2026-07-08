import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { reviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const payload = req.body;

  const result = await reviewService.createReview(customerId as string, payload);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await reviewService.getAllReviews(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All reviews retrieved successfully',
    data: result.reviews,
    meta: result.meta,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await reviewService.getReviewById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const result = await reviewService.getMyReviews(customerId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My reviews retrieved successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const customer = req.user;

  const result = await reviewService.deleteReview(customer as JwtPayload, id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  getMyReviews,
  deleteReview,
};
