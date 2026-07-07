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
