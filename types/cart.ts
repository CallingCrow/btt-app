export interface CartItem {
  id: string; // cart item id
  itemId: string; // menu item id
  name: string;
  basePrice: number;
  finalPrice: number; // UI only
  quantity: number;
  selectedOptions: Record<string, { optionId: number; isDefault?: boolean }[]>;
  customizations: { name: string; price: number }[]; // UI only
}