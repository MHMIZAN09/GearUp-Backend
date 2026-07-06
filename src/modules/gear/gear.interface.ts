export interface ICreateGearItem {
  name: string;
  description: string;
  brand?: string;
  pricePerDay: number;
  quantityTotal: number;
  imageUrl?: string;
  categoryId: string;
}

export interface IUpdateGearItem {
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  quantityTotal?: number;
  imageUrl?: string;
}
