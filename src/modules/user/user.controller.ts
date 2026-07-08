import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { userService } from './user.service';

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  console.log(userId);
  const payload = req.body;

  const result = await userService.updateMyProfile(userId as string, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const result = await userService.getMyProfile(userId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Profile fetched successfully',
    data: result,
  });
});

const getMyAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const result = await userService.getMyAnalytics(userId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Analytics fetched successfully',
    data: result,
  });
});

export const userController = {
  updateMyProfile,
  getMyProfile,
  getMyAnalytics,
};
