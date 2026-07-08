import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { categoryService } from './category.service';

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const categories = await categoryService.getAllCategories(query);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Categories retrieved successfully',
    data: categories.categories,
    meta: categories.meta,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.id;
  const category = await categoryService.getCategoryById(categoryId as string);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const categoryController = {
  getAllCategories,
  getCategoryById,
};
