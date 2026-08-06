import type { CheckoutLineItem } from "@/types/cart";
import type { Json } from "@/types/db";

export function toCheckoutJson(items: CheckoutLineItem[]): Json {
  return items.map((item) => ({
    itemId: item.itemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    customizations: item.customizations,
  })) as unknown as Json;
}
