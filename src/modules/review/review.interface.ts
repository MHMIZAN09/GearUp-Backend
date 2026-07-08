import { ReviewWhereInput } from '../../../generated/prisma/models';

export type TReview = {
  gearItemId: string;
  rentalOrderId: string;
  rating: number;
  comment?: string;
};

export type TUpdateReview = {
  rating?: number;
  comment?: string;
};

export interface IReviewQuery extends ReviewWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}
