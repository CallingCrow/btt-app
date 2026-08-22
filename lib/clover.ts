import type { CheckoutLineItem } from "@/types/cart";

const CLOVER_BASE =
  process.env.CLOVER_ENV === "production"
    ? "https://api.clover.com"
    : "https://sandbox.dev.clover.com";

export interface CloverTaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault?: boolean;
}

interface CloverLineItem {
  name: string;
  price: number;
  unitQty: number;
  taxRates?: {
    name: string;
    rate: number;
  }[];
}

interface CloverCustomer {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// customer information from website
export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
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
  cloverTaxRate: CloverTaxRate,
  customer: CheckoutCustomer,
) {
  // split first and last name
  const nameParts = customer.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const payload: CloverCheckoutPayload = {
    customer: {
      firstName,
      lastName,
      email: customer.email,
    },
    shoppingCart: {
      lineItems: cartItems.map((item) => ({
        name: item.name,
        price: Math.round(item.price),
        unitQty: item.quantity,
        taxRates: [
          {
            name: cloverTaxRate.name,
            rate: cloverTaxRate.rate,
          },
        ],
      })),
    },

    externalReferenceId: orderId,
  };

  console.log("CLOVER TAX RATE BEING SENT:", cloverTaxRate);
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
