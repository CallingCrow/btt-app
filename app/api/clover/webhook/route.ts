import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendMerchantNotification } from "@/lib/sendMerchantNotification";

const MAX_TIMESTAMP_AGE_SECONDS = 300; // 5 minutes

export async function POST(req: Request) {
  try {
    // 1. Get signature header
    const signatureHeader = req.headers.get("clover-signature");
    if (!signatureHeader) {
      return new Response("Missing signature", { status: 400 });
    }

    // 2. Read RAW body (DO NOT use req.json yet)
    const rawBody = await req.text();

    // 3. Verify signature
    const verification = verifyCloverSignature(rawBody, signatureHeader);

    if (!verification.valid) {
      console.error("Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    // 4. Prevent replay attacks
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - verification.timestamp) > MAX_TIMESTAMP_AGE_SECONDS) {
      console.error("Replay attack detected (timestamp too old)");
      return new Response("Stale request", { status: 400 });
    }

    // 5. Parse JSON AFTER verification
    const body = JSON.parse(rawBody);

    const eventId = body?.id;
    const eventType = body?.type;

    if (!eventId) {
      return new Response("Missing event ID", { status: 400 });
    }

    // 6. Idempotency check (prevent duplicate processing)
    const { data: existingEvent } = await supabaseAdmin
      .from("webhook_events")
      .select("id")
      .eq("id", eventId)
      .single();

    if (existingEvent) {
      // Already processed → return success so Clover stops retrying
      return new Response("ok", { status: 200 });
    }

    // 7. Store event immediately (idempotency lock)
    await supabaseAdmin.from("webhook_events").insert({
      id: eventId,
      type: eventType,
      raw: body,
    });

    // 8. Handle relevant events
    if (
      eventType === "ORDER_PAID"
    ) {
      const payment = body?.object;

      const customer = payment?.customer || {};
      const order = payment?.order || {};

      const externalId = payment?.externalReferenceId;

      const email = customer?.email || null;
      const firstName = customer?.firstName || "";
      const lastName = customer?.lastName || "";
      const phone = customer?.phoneNumber || null;

      const fullName = `${firstName} ${lastName}`.trim();

      if (!externalId) {
        console.error("Missing externalReferenceId");
        return new Response("Missing reference", { status: 400 });
      }

      // 9. Update your order in DB
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          customer_email: email,
          customer_name: fullName,
          customer_phone: phone,
          clover_payment_id: payment?.id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", externalId);

      if (updateError) {
        console.error("Order update failed:", updateError);
        return new Response("DB error", { status: 500 });
      }

      console.log("Order updated:", externalId);

      // Fetch full order, send to merchant
      const { data: fullOrder } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("id", externalId)
        .single();

      if (fullOrder) {
        await supabaseAdmin
          .from("notification_jobs")
          .insert({
            order_id: externalId,
            type: "merchant_order",
          });
      }
    }

    if (eventType === "PAYMENT_FAILED") {
        const payment = body?.object;
        const externalId = payment?.externalReferenceId;

        if (externalId) {
            await supabaseAdmin
            .from("orders")
            .update({
                status: "failed",
            })
            .eq("id", externalId);
        }
    }

    if (eventType === "PAYMENT_REFUNDED") {
        const payment = body?.object;
        const externalId = payment?.externalReferenceId;

        if (externalId) {
            await supabaseAdmin
            .from("orders")
            .update({
                status: "refunded",
            })
            .eq("id", externalId);
        }
    }

    console.log("Webhook event:", eventType);
    console.log("Webhook body:", body);

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("error", { status: 500 });
  }
}

function verifyCloverSignature(payload: string, header: string): {
  valid: boolean;
  timestamp: number;
} {
  const secret = process.env.CLOVER_WEBHOOK_SECRET!;
  if (!secret) throw new Error("Missing CLOVER_WEBHOOK_SECRET");

  const parts = header.split(",");

  let timestamp = "";
  let signature = "";

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signature = value;
  }

  if (!timestamp || !signature) {
    return { valid: false, timestamp: 0 };
  }

  const signedPayload = `${timestamp}.${payload}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );

  return {
    valid: isValid,
    timestamp: Number(timestamp),
  };
}