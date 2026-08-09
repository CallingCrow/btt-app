import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAX_TIMESTAMP_AGE_SECONDS = 300; // 5 minutes

function extractCloverApprovedAmount(message: unknown): number | null {
  if (typeof message !== "string") {
    return null;
  }

  const match = message.match(/^Approved for (\d+)$/);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);

  return Number.isSafeInteger(amount) ? amount : null;
}

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

    console.log("CLOVER WEBHOOK:", JSON.stringify(body, null, 2));

    const eventId = body?.id;
    const eventType = body?.type;

    if (!eventId) {
      return new Response("Missing event ID", { status: 400 });
    }

    // 6. Store event immediately.
    // The database's unique constraint on id makes this race-safe.
    const { error: eventInsertError } = await supabaseAdmin
      .from("webhook_events")
      .insert({
        id: eventId,
        type: eventType,
        received_at: new Date().toISOString(),
        raw: body,
      });

    if (eventInsertError) {
      // PostgreSQL error 23505 = unique violation.
      // This means Clover sent us this event before.
      if (eventInsertError.code === "23505") {
        console.log("Duplicate Clover webhook event:", eventId);

        // Returning 200 tells Clover we received it successfully.
        return new Response("ok", { status: 200 });
      }

      console.error("Failed to store webhook event:", eventInsertError);

      return new Response("DB error", {
        status: 500,
      });
    }

    // 8. Handle relevant events
    if (eventType === "PAYMENT") {
      const paymentId = body?.id;
      const paymentStatus = body?.status;
      const checkoutSessionId = body?.checkoutSessionId;

      if (!checkoutSessionId) {
        console.error("Clover PAYMENT webhook missing checkoutSessionId");

        return new Response("Missing checkoutSessionId", { status: 400 });
      }

      const { data: order, error: orderLookupError } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("clover_checkout_session_id", checkoutSessionId)
        .maybeSingle();

      if (orderLookupError) {
        console.error("Order lookup failed:", orderLookupError);

        return new Response("DB error", {
          status: 500,
        });
      }

      if (!order) {
        console.error(
          "No order found for Clover checkout session:",
          checkoutSessionId,
        );

        return new Response("Order not found", {
          status: 404,
        });
      }

      if (paymentStatus === "APPROVED") {
        const approvedAmount = extractCloverApprovedAmount(body?.message);

        if (approvedAmount === null) {
          console.error(
            "Unable to determine Clover approved amount:",
            body?.message,
          );

          return new Response("Unable to verify payment amount", {
            status: 400,
          });
        }

        const expectedAmount = Number(order.total);

        if (!Number.isSafeInteger(expectedAmount)) {
          console.error("Invalid order total:", order.total);

          return new Response("Invalid order total", {
            status: 500,
          });
        }

        console.log("Clover approved amount:", approvedAmount);
        console.log("Expected order amount:", expectedAmount);

        if (approvedAmount !== expectedAmount) {
          console.error("PAYMENT AMOUNT MISMATCH", {
            orderId: order.id,
            checkoutSessionId,
            paymentId,
            approvedAmount,
            expectedAmount,
          });

          return new Response("Payment amount mismatch", {
            status: 400,
          });
        }

        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            clover_payment_id: paymentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id)
          .eq("status", "pending");

        if (updateError) {
          console.error("Order update failed:", updateError);

          return new Response("DB error", {
            status: 500,
          });
        }

        console.log("Order marked paid:", order.id);

        const { error: notificationError } = await supabaseAdmin
          .from("notification_jobs")
          .insert({
            order_id: order.id,
            type: "merchant_order",
          });

        if (notificationError) {
          console.error("Notification job creation failed:", notificationError);
        }

        return new Response("ok", {
          status: 200,
        });
      }

      if (paymentStatus === "DECLINED") {
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("Failed to mark order failed:", updateError);

          return new Response("DB error", {
            status: 500,
          });
        }

        console.log("Order marked failed:", order.id);

        return new Response("ok", {
          status: 200,
        });
      }

      console.log("Unhandled Clover payment status:", paymentStatus);

      return new Response("ok", {
        status: 200,
      });
    }

    console.log("Webhook event:", eventType);
    console.log("Webhook body:", body);

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("error", { status: 500 });
  }
}

function verifyCloverSignature(
  payload: string,
  header: string,
): {
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

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  if (expected.length !== received.length) {
    return {
      valid: false,
      timestamp: Number(timestamp),
    };
  }

  const isValid = crypto.timingSafeEqual(expected, received);

  return {
    valid: isValid,
    timestamp: Number(timestamp),
  };
}
