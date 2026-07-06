import { prisma } from '../../lib/prisma';
import { ICreateCategory, IUpdateCategory } from './category.interface';

const createCategory = async (payload: ICreateCategory) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });
  if (existingCategory) {
    throw new Error('Category already exists');
  }
  const category = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategory = async (categoryId: string, payload: IUpdateCategory) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new Error('Category not found');
  }
  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...payload,
    },
  });
  return updatedCategory;
};

const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new Error('Category not found');
  }
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
