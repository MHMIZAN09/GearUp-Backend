import { UserWhereInput } from '../../../generated/prisma/models';

export interface IUserQuery extends UserWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}
