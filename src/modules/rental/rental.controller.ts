import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { rentalService } from './rental.service';

const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const customerId = req.user?.id;

  const result = await rentalService.createRentalOrderIntoDB(customerId as string, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Rental order created successfully',
    data: result,
  });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;

  const result = await rentalService.getMyRentalOrdersFromDB(customerId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental orders retrieved successfully',
    data: result,
  });
});

const getSingleRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const cancelRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const RentalController = {
  createRentalOrder,
  getMyRentalOrders,
  getSingleRentalOrder,
  cancelRentalOrder,
};
