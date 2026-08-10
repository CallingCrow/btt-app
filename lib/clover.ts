import type { CheckoutLineItem } from "@/types/cart";

const CLOVER_BASE =
  process.env.CLOVER_ENV === "production"
    ? "https://api.clover.com"
    : "https://sandbox.dev.clover.com";

interface CloverTaxRate {
  name: string;
  rate: number;
}

interface CloverLineItem {
  name: string;
  price: number;
  unitQty: number;
  taxRates?: CloverTaxRate[];
}

interface CloverCustomer {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface CloverCheckoutPayload {
  customer: CloverCustomer;
  shoppingCart: {
    lineItems: CloverLineItem[];
  };
  externalReferenceId: string;
}

interface CloverCheckoutResponse {
  href: string;
  checkoutSessionId: string;
  createdTime: string;
  expirationTime: string;
}

export async function createCloverCheckout(
  cartItems: CheckoutLineItem[],
  orderId: string,
  tax: number,
  cloverTaxRate: number,
) {
  const payload: CloverCheckoutPayload = {
    customer: { email: "guest@example.com" },
    shoppingCart: {
      lineItems: cartItems.map((item) => ({
        name: item.name,
        price: Math.round(item.price),
        unitQty: item.quantity,
        taxRates: [
          {
            name: "Sales Tax",
            rate: cloverTaxRate,
          },
        ],
      })),
    },
    //taxAmount: tax,
    externalReferenceId: orderId,
  };

  console.log("CLOVER PAYLOAD:", JSON.stringify(payload, null, 2));

  const res = await fetch(
    `${CLOVER_BASE}/invoicingcheckoutservice/v1/checkouts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOVER_API_KEY}`,
        "X-Clover-Merchant-ID": process.env.CLOVER_MERCHANT_ID!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const text = await res.text();

  console.log("Clover status:", res.status);
  console.log("Clover raw body:", text);

  if (!res.ok) {
    throw new Error(`Clover error: ${text}`);
  }

  const session: CloverCheckoutResponse = JSON.parse(text);
  console.log("CLOVER SESSION: ", session);
  return session;
}
