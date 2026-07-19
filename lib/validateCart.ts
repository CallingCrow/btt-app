import type { CheckoutItemRequest } from "@/types/cart";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateCart(
  items: unknown,
): asserts items is CheckoutItemRequest[] {
  if (!Array.isArray(items)) {
    throw new Error("Invalid cart");
  }

  for (const item of items) {
    if (typeof item !== "object" || item === null) {
      throw new Error("Invalid cart item");
    }

    const cartItem = item as any;

    // itemId
    if (typeof cartItem.itemId !== "string" || cartItem.itemId.length > 100) {
      throw new Error("Invalid item ID");
    }

    // quantity
    if (
      typeof cartItem.quantity !== "number" ||
      !Number.isInteger(cartItem.quantity)
    ) {
      throw new Error("Invalid quantity");
    }

    // selectedOptions
    if (
      cartItem.selectedOptions &&
      typeof cartItem.selectedOptions !== "object"
    ) {
      throw new Error("Invalid selected options");
    }
  }
}
