import { RentalOrderWhereInput } from '../../../generated/prisma/models';

export interface IRentalOrderItemPayload {
  gearItemId: string;
  quantity: number;
}

export interface ICreateRentalOrderPayload {
  startDate: string;
  endDate: string;
  notes?: string;
  rentalItems: IRentalOrderItemPayload[];
}

export interface IRentalQuery extends RentalOrderWhereInput {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
}
