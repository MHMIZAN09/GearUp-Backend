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

const getOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const providerController = {
  createGear,
  getMyGear,
  getMyGearById,
  updateGear,
  deleteGear,
  updateGearStock,
  updateGearStatus,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
