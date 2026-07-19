import type { CheckoutLineItem, CheckoutJson } from "@/types/cart";

export function toCheckoutJson(items: CheckoutLineItem[]): CheckoutJson[] {
  return items.map((item) => ({
    itemId: item.itemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    customizations: item.customizations,
  }));
}
