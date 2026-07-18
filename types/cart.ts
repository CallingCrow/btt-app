import type { SelectedOptions } from "@/types/ui";

export interface CartItem {
  id: string; // cart item id
  itemId: string; // menu item id
  name: string;
  basePrice: number;
  finalPrice: number; // UI only
  quantity: number;
  selectedOptions: SelectedOptions;
  customizations: { name: string; price: number }[]; // UI only
}
