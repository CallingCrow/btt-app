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

interface CloverPayment {
  id: string;
  order?: {
    id: string;
  };
  amount: number;
  taxAmount?: number;
  result?: string;
}

interface CloverOrder {
  id: string;
  customers?: {
    elements?: {
      id: string;
    }[];
  };
}

interface CloverCustomerResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: {
    elements?: {
      emailAddress: string;
      primaryEmail?: boolean;
    }[];
  };
  phoneNumbers?: {
    elements?: {
      phoneNumber: string;
    }[];
  };
}

export async function createCloverCheckout(
  cartItems: CheckoutLineItem[],
  orderId: string,
  tax: number,
  cloverTaxRate: CloverTaxRate,
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

export async function getCloverCustomerFromPayment(
  paymentId: string,
): Promise<CloverCustomerResponse | null> {
  const apiKey = process.env.CLOVER_API_KEY;
  const merchantId = process.env.CLOVER_MERCHANT_ID;

  if (!apiKey) {
    throw new Error("Missing CLOVER_API_KEY");
  }

  if (!merchantId) {
    throw new Error("Missing CLOVER_MERCHANT_ID");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "X-Clover-Merchant-ID": merchantId,
    "Content-Type": "application/json",
  };

  // 1. Get the Clover payment
  const paymentResponse = await fetch(
    `${CLOVER_BASE}/v3/merchants/${merchantId}/payments/${paymentId}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!paymentResponse.ok) {
    const text = await paymentResponse.text();

    throw new Error(
      `Clover payment lookup failed (${paymentResponse.status}): ${text}`,
    );
  }

  const payment = (await paymentResponse.json()) as CloverPayment;

  const orderId = payment.order?.id;

  if (!orderId) {
    throw new Error(`Clover payment ${paymentId} does not contain an order ID`);
  }

  // 2. Get the Clover order and its customer
  const orderResponse = await fetch(
    `${CLOVER_BASE}/v3/merchants/${merchantId}/orders/${orderId}?expand=customers`,
    {
      method: "GET",
      headers,
    },
  );

  if (!orderResponse.ok) {
    const text = await orderResponse.text();

    throw new Error(
      `Clover order lookup failed (${orderResponse.status}): ${text}`,
    );
  }

  const order = (await orderResponse.json()) as CloverOrder;

  const customerId = order.customers?.elements?.[0]?.id;

  if (!customerId) {
    console.log("Clover order has no customer:", orderId);
    return null;
  }

  // 3. Get the full Clover customer
  const customerResponse = await fetch(
    `${CLOVER_BASE}/v3/merchants/${merchantId}/customers/${customerId}?expand=emailAddresses,phoneNumbers,addresses`,
    {
      method: "GET",
      headers,
    },
  );

  if (!customerResponse.ok) {
    const text = await customerResponse.text();

    throw new Error(
      `Clover customer lookup failed (${customerResponse.status}): ${text}`,
    );
  }

  const customer = (await customerResponse.json()) as CloverCustomerResponse;

  return customer;
}
