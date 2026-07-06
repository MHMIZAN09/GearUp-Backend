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
