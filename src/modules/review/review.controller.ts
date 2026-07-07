import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
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

export const reviewController = {
  createReview,
};
