import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { categoryService } from './category.service';

const createCategory = catchAsync(
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const category = await categoryService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: 'Category created successfully',
      data: category,
    });
  }),
);

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const categories = await categoryService.getAllCategories(query);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Categories retrieved successfully',
    data: categories,
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

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.id;
  const payload = req.body;
  const updatedCategory = await categoryService.updateCategory(categoryId as string, payload);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params.id;
  await categoryService.deleteCategory(categoryId as string);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Category deleted successfully',
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
