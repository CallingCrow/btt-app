import type { Json } from "@/types/db";
import type { CheckoutLineItem } from "@/types/cart";

export function fromCheckoutJson(json: Json | null): CheckoutLineItem[] {
  return (json ?? []) as unknown as CheckoutLineItem[];
}
