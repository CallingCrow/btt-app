import type { CartCustomization, CheckoutLineItem } from "@/types/cart";
import type { SelectedOptions } from "@/types/ui";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCartCustomization(
  value: unknown,
): value is CartCustomization {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price)
  );
}

export function isSelectedOptions(value: unknown): value is SelectedOptions {
  if (!isObject(value)) {
    return false;
  }

  for (const options of Object.values(value)) {
    if (!Array.isArray(options)) {
      return false;
    }

    for (const option of options) {
      if (!isObject(option)) {
        return false;
      }

      if (typeof option.optionId !== "string") {
        return false;
      }

      if ("isDefault" in option && typeof option.isDefault !== "boolean") {
        return false;
      }
    }
  }

  return true;
}

export function isCheckoutLineItem(value: unknown): value is CheckoutLineItem {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.itemId === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    isSelectedOptions(value.selectedOptions) &&
    Array.isArray(value.customizations) &&
    value.customizations.every(isCartCustomization) &&
    typeof value.customerRequest === "string"
  );
}

export function isCheckoutLineItemArray(
  value: unknown,
): value is CheckoutLineItem[] {
  return Array.isArray(value) && value.every(isCheckoutLineItem);
}
