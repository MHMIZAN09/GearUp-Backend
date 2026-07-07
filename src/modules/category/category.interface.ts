import { CategoryWhereInput } from '../../../generated/prisma/models';

export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  description?: string;
}

export interface ICategoryQuery extends CategoryWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}
