import { GearItemWhereInput, UserWhereInput } from '../../../generated/prisma/models';

export interface IUserQuery extends UserWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}

export interface IGearQuery extends GearItemWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;

  minAvailable?: string;
  maxAvailable?: string;
}
