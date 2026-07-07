import { CategoryWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { ICategoryQuery, ICreateCategory, IUpdateCategory } from './category.interface';


const getAllCategories = async (query: ICategoryQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const andConditions: CategoryWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: 'insensitive' } },
        { description: { contains: query.searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  const categories = await prisma.category.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalCategories = await prisma.category.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    categories,
    meta: {
      page,
      limit,
      total: totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
    },
  };
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



export const categoryService = {

  getAllCategories,
  getCategoryById,
};
