import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { providerService } from './provider.service';

const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const payload = req.body;

  const gear = await providerService.createGear(providerId as string, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Gear created successfully',
    data: gear,
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const gear = await providerService.getMyGear(userId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Gear retrieved successfully',
    data: gear,
  });
});

const getMyGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const gearId = req.params.id;

  const gear = await providerService.getMyGearById(userId as string, gearId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Gear retrieved successfully',
    data: gear,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;
  const payload = req.body;
  const providerId = req.user?.id;

  const updatedGear = await providerService.updateGear(
    providerId as string,
    gearId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear updated successfully',
    data: updatedGear,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;
  const providerId = req.user?.id;
  await providerService.deleteGear(providerId as string, gearId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear deleted successfully',
  });
});

const updateGearStock = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;
  const payload = req.body;
  const providerId = req.user?.id;
  const updatedGear = await providerService.updateGearStock(
    providerId as string,
    gearId as string,
    payload.quantity,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear stock updated successfully',
    data: updatedGear,
  });
});

const updateGearStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;
  const payload = req.body;
  const providerId = req.user?.id;
  const updatedGear = await providerService.updateGearStatus(
    providerId as string,
    gearId as string,
    payload.status,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear status updated successfully',
    data: updatedGear,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const rentals = await providerService.getAllRentals(providerId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All rentals retrieved successfully',
    data: rentals,
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const rentalId = req.params.id;
  const rental = await providerService.getRentalById(providerId as string, rentalId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental retrieved successfully',
    data: rental,
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const rentalId = req.params.id;
  const { status } = req.body;
  const updatedRental = await providerService.updateRentalStatus(
    providerId as string,
    rentalId as string,
    status,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental status updated successfully',
    data: updatedRental,
  });
});

const getAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const analytics = await providerService.getAnalytics(providerId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Analytics retrieved successfully',
    data: analytics,
  });
});

export const providerController = {
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
};
