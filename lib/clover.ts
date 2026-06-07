const CLOVER_BASE =
  process.env.CLOVER_ENV === "production"
    ? "https://api.clover.com"
    : "https://sandbox.dev.clover.com";


// FOR DEBUG
export async function createCloverCheckout(
  cartItems: any[],
  orderId: string,
  tax: number
) {
  const payload = {
    //TEST
    customer: {},
    shoppingCart: {
      lineItems: cartItems.map((item) => ({
        name: item.name,
        price: Math.round(item.price),
        unitQty: item.quantity,
      })),
    },
    //taxAmount: tax,
    externalReferenceId: orderId,
  };

  console.log(
    "CLOVER PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );

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
    }
  );

  const text = await res.text();

  console.log("Clover status:", res.status);
  console.log("Clover raw body:", text);

  if (!res.ok) {
    throw new Error(`Clover error: ${text}`);
  }

  return JSON.parse(text);
}

// END FOR DEBUG




// /**
//  * Create a Clover Hosted Checkout session
//  * @param cartItems Array of line items [{name, price, unitQty}]
//  */
// export async function createCloverCheckout(
//   cartItems: any[],
//   orderId: string,
//   tax: number
// ) {
//   const res = await fetch(`${CLOVER_BASE}/invoicingcheckoutservice/v1/checkouts`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.CLOVER_API_KEY}`, // private token
//       "X-Clover-Merchant-ID": process.env.CLOVER_MERCHANT_ID!,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       shoppingCart: {
//         lineItems: cartItems.map((item) => ({
//           name: item.name,

//           price: Math.round(item.price),

//           unitQty: item.quantity,
//         })),
//       },
//       taxAmount: tax,
//       externalReferenceId: orderId,
//     }),
//   });

//   const text = await res.text();
//   console.log("Clover status:", res.status);
//   console.log("Clover raw body:", text);

//   if (!res.ok) {
//     throw new Error(`Clover error: ${text}`);
//   }

//   return JSON.parse(text); // returns { href: "https://checkout.clover.com/..." }
// }