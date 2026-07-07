import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await adminService.getAllUsers(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result.users,
    meta: result.meta,
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

const getAllGears = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await adminService.getAllGears(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All gears retrieved successfully',
    data: result.gears,
    meta: result.meta,
  });
});

const getGearById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.getGearById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear retrieved successfully',
    data: result,
  });
});

const updateGearStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const result = await adminService.updateGearStatus(id as string, req.body.status);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear status updated successfully',
    data: result,
  });
});

const deleteGear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.deleteGear(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Gear deleted successfully',
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await adminService.getAllRentals(query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All rentals retrieved successfully',
    data: result.rentals,
    meta: result.meta,
  });
});

const getRentalById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.getRentalById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental retrieved successfully',
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const result = await adminService.updateRentalStatus(id as string, req.body.status);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental status updated successfully',
    data: result,
  });
});

const deleteRental = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  
  const { id } = req.params;
  const result = await adminService.deleteRental(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Rental deleted successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getReviewById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const deleteReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAnalytics();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Analytics retrieved successfully',
    data: result,
  });
});

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.createCategory(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.updateCategory(id as string, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await adminService.deleteCategory(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});

export const adminController = {
  // users
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  // gears
  getAllGears,
  getGearById,
  updateGearStatus,
  deleteGear,
  // Rentals
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental,
  // reviews
  getAllReviews,
  getReviewById,
  deleteReview,
  // category service
  createCategory,
  updateCategory,
  deleteCategory,
  // payments
  getAllPayments,
  getPaymentById,
  // analytics
  getAnalytics,
};
