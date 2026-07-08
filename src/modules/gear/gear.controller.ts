import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { gearService } from './gear.service';

const getAllGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const gear = await gearService.getAllGear();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear retrieved successfully',
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

export const gearController = {
  getAllGear,
  getGearById,
};
