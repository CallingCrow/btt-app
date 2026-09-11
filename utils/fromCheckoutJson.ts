import type { Json } from "@/types/db";
import type { CheckoutLineItem } from "@/types/cart";
import { isCheckoutLineItemArray } from "./checkoutGuards";

export function fromCheckoutJson(json: Json | null): CheckoutLineItem[] {
  if (json === null) {
    return [];
  }

  if (!isCheckoutLineItemArray(json)) {
    throw new Error(
      "Invalid checkout JSON: expected an array of valid checkout line items",
    );
  }

  return json.map((item) => ({
    ...item,
    selectedOptions: Object.fromEntries(
      Object.entries(item.selectedOptions).map(([groupId, options]) => [
        groupId,
        options.map((option) => ({
          ...option,
          isDefault: option.isDefault ?? false,
        })),
      ]),
    ),
  }));
}
