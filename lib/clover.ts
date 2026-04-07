// lib/clover.ts
const CLOVER_BASE =
  process.env.CLOVER_ENV === "production"
    ? "https://api.clover.com"
    : "https://sandbox.dev.clover.com";

/**
 * Create a Clover Hosted Checkout session
 * @param cartItems Array of line items [{name, price, unitQty}]
 */
export async function createCloverCheckout(
  cartItems: any[],
  customer: { email: string; firstName: string; lastName: string; phone: string }
) {
  const res = await fetch(`${CLOVER_BASE}/invoicingcheckoutservice/v1/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CLOVER_API_KEY}`, // private token
      "X-Clover-Merchant-ID": process.env.CLOVER_MERCHANT_ID!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shoppingCart: {
        lineItems: cartItems.map((item) => ({
          name: item.name,
          price: Math.round(item.price), // in cents
          unitQty: item.unitQty || 1,
        })),
      },
      customer: {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phone,
      },
    }),
  });

  const text = await res.text();
  console.log("Clover status:", res.status);
  console.log("Clover raw body:", text);

  if (!res.ok) {
    throw new Error(`Clover error: ${text}`);
  }

  return JSON.parse(text); // returns { href: "https://checkout.clover.com/..." }
}