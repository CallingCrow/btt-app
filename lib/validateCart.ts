import type { CheckoutItemRequest } from "@/types/cart";

const MAX_CUSTOMIZATION_GROUPS = 10;
const MAX_OPTIONS_PER_GROUP = 10;
const MAX_TOTAL_SELECTED_OPTIONS = 50;

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
    if (!isObject(item)) {
      throw new Error("Invalid cart item");
    }

    const cartItem = item;

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
    // selectedOptions
    if (
      cartItem.selectedOptions !== undefined &&
      !isObject(cartItem.selectedOptions)
    ) {
      throw new Error("Invalid selected options");
    }

    if (isObject(cartItem.selectedOptions)) {
      const groupIds = Object.keys(cartItem.selectedOptions);

      if (groupIds.length > MAX_CUSTOMIZATION_GROUPS) {
        throw new Error("Too many customization groups");
      }

      let totalSelectedOptions = 0;

      for (const groupId of groupIds) {
        const options = cartItem.selectedOptions[groupId];

        if (!Array.isArray(options)) {
          throw new Error("Invalid selected options");
        }

        if (options.length > MAX_OPTIONS_PER_GROUP) {
          throw new Error(
            "Too many options selected for a customization group",
          );
        }

        for (const option of options) {
          if (
            !isObject(option) ||
            typeof option.optionId !== "string" ||
            option.optionId.length === 0
          ) {
            throw new Error("Invalid selected option");
          }
        }

        totalSelectedOptions += options.length;

        if (totalSelectedOptions > MAX_TOTAL_SELECTED_OPTIONS) {
          throw new Error("Too many customization options selected");
        }
      }
    }
  }
}
