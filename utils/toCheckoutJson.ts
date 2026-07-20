import type { CheckoutLineItem, CheckoutJsonItem } from "@/types/cart";

export function toCheckoutJson(items: CheckoutLineItem[]): CheckoutJsonItem[] {
  return items.map((item) => ({
    itemId: item.itemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    customizations: item.customizations,
  }));
}
