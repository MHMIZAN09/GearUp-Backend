import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllUsers();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.getUserById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const result = await adminService.updateUserStatus(id as string, req.body.status);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.deleteUser(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
