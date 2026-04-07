// app/api/create-checkout/route.ts
import { createCloverCheckout } from "@/lib/clover";

export async function POST(req: Request) {
  try {
    const { lineItems, customer } = await req.json();

    if (!customer?.email || !customer?.firstName || !customer?.lastName || !customer?.phone) {
      throw new Error("Customer email, name, and phone are required.");
    }

    const session = await createCloverCheckout(lineItems, customer);

    return new Response(JSON.stringify(session), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("FULL ERROR:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}