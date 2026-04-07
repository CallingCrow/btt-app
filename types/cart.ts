export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  customizations: {
    name: string;
    price: number;
  }[];
}