import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { rentalService } from './rental.service';

const createRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const customer = req.user!;

  const result = await rentalService.createRentalOrderIntoDB(customer, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Rental order created successfully',
    data: result,
  });
});

const getMyRentalOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const query = req.query;
  const result = await rentalService.getMyRentalOrdersFromDB(customerId as string, query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental orders retrieved successfully',
    data: result,
  });
});

const getSingleRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const rentalOrderId = req.params.id;

  const result = await rentalService.getSingleRentalOrderFromDB(
    customerId as string,
    rentalOrderId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental order retrieved successfully',
    data: result,
  });
});

const cancelRentalOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const rentalOrderId = req.params.id;

  const result = await rentalService.cancelRentalOrderInDB(
    customerId as string,
    rentalOrderId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental order cancelled successfully',
    data: result,
  });
});

export const RentalController = {
  createRentalOrder,
  getMyRentalOrders,
  getSingleRentalOrder,
  cancelRentalOrder,
};
