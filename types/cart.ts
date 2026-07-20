import type { SelectedOptions } from "@/types/ui";
import type { Order } from "./db";

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // cart item id
  itemId: string; // menu item id
  name: string;
  basePrice: number;
  finalPrice: number;
  quantity: number;
  selectedOptions: SelectedOptions;
  customizations: CartCustomization[];
}

export interface CheckoutItemRequest {
  itemId: string;
  quantity: number;
  selectedOptions: SelectedOptions;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
}

export type CheckoutLineItem = Omit<
  CartItem,
  "id" | "basePrice" | "finalPrice"
> & {
  price: number;
};

export interface CheckoutJsonItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions: {
    [groupId: string]: {
      optionId: string;
      isDefault: boolean;
    }[];
  };
  customizations: {
    id: string;
    name: string;
    price: number;
  }[];
}

export type OrderWithItems = Omit<Order, "order_items"> & {
  order_items: CheckoutLineItem[];
};
