import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { gearService } from './gear.service';

const createGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const providerId = req.user?.id;
  const payload = req.body;

  const gear = await gearService.createGear(providerId as string, payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Gear created successfully',
    data: gear,
  });
});

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gear = await gearService.getAllGear();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear retrieved successfully',
    data: gear,
  });
});

const getMyGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const gear = await gearService.getMyGear(userId as string);

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

  const gear = await gearService.getMyGearById(userId as string, gearId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Gear retrieved successfully',
    data: gear,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;

  const gear = await gearService.getGearById(gearId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear retrieved successfully',
    data: gear,
  });
});

const updateGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gearId = req.params.id;
  const payload = req.body;
  const providerId = req.user?.id;

  const updatedGear = await gearService.updateGear(providerId as string, gearId as string, payload);

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
  await gearService.deleteGear(providerId as string, gearId as string);

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
  const updatedGear = await gearService.updateGearStock(
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
  const updatedGear = await gearService.updateGearStatus(
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

export const gearController = {
  createGear,
  getAllGear,
  getMyGear,
  getMyGearById,
  getGearById,
  updateGear,
  deleteGear,
  updateGearStock,
  updateGearStatus,
};
