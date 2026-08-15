import crypto from "crypto";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendMerchantNotification } from "@/lib/sendMerchantNotification";

import type { OrderWithItems } from "@/types/cart";
import { fromCheckoutJson } from "@/utils/fromCheckoutJson";

export async function GET(req: Request) {
  console.log("CRON_SECRET loaded:", Boolean(process.env.CRON_SECRET));
  const authorization = req.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const workerId = `merchant-notification-worker-${crypto.randomUUID()}`;

  /*
   * ------------------------------------------------------------
   * 1. Protect the worker endpoint
   * ------------------------------------------------------------
   */

  /*
   * ------------------------------------------------------------
   * 2. Claim one job atomically
   * ------------------------------------------------------------
   */

  const { data: job, error: claimError } = await supabaseAdmin.rpc(
    "claim_notification_job",
    {
      worker_id: workerId,
    },
  );

  if (claimError) {
    console.error("Failed to claim notification job:", claimError);

    return Response.json(
      {
        success: false,
        error: "Failed to claim notification job",
      },
      { status: 500 },
    );
  }

  /*
   * No job available.
   */

  if (!job || job.id == null) {
    return Response.json({
      success: true,
      message: "No notification jobs available",
    });
  }

  console.log("Claimed notification job:", {
    jobId: job.id,
    orderId: job.order_id,
    type: job.type,
    attempts: job.attempts,
    workerId,
  });

  /*
   * ------------------------------------------------------------
   * 3. Process the claimed job
   * ------------------------------------------------------------
   */

  try {
    /*
     * ----------------------------------------------------------
     * 3a. Validate notification type
     * ----------------------------------------------------------
     */

    if (job.type !== "merchant_order") {
      throw new Error(`Unsupported notification type: ${job.type}`);
    }

    /*
     * ----------------------------------------------------------
     * 3b. Fetch order
     * ----------------------------------------------------------
     */

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", job.order_id)
      .single();

    if (orderError) {
      throw new Error(
        `Failed to fetch order ${job.order_id}: ${orderError.message}`,
      );
    }

    if (!order) {
      throw new Error(`Order ${job.order_id} was not found`);
    }

    /*
     * ----------------------------------------------------------
     * 3c. Convert order JSON into your application type
     * ----------------------------------------------------------
     */

    const typedOrder: OrderWithItems = {
      ...order,
      order_items: fromCheckoutJson(order.order_items),
    };

    /*
     * ----------------------------------------------------------
     * 3d. Send merchant notification
     * ----------------------------------------------------------
     */

    console.log("Sending merchant notification:", {
      jobId: job.id,
      orderId: order.id,
    });

    await sendMerchantNotification(typedOrder);

    /*
     * ----------------------------------------------------------
     * 3e. Mark job completed
     * ----------------------------------------------------------
     */

    const { data: completed, error: completeError } = await supabaseAdmin.rpc(
      "complete_notification_job",
      {
        job_id: job.id,
        worker_id: workerId,
      },
    );

    if (completeError) {
      throw new Error(
        `Notification was sent, but completion failed: ${completeError.message}`,
      );
    }

    if (!completed) {
      throw new Error(
        "Notification was sent, but this worker no longer owns the job",
      );
    }

    /*
     * ----------------------------------------------------------
     * 3f. Done
     * ----------------------------------------------------------
     */

    console.log("Notification job completed:", {
      jobId: job.id,
      orderId: order.id,
    });

    return Response.json({
      success: true,
      jobId: job.id,
      orderId: order.id,
    });
  } catch (err: unknown) {
    /*
     * ----------------------------------------------------------
     * 4. Something went wrong while processing the job
     * ----------------------------------------------------------
     */

    const errorMessage =
      err instanceof Error ? err.message : "Unknown notification error";

    console.error("Notification job failed:", {
      jobId: job.id,
      orderId: job.order_id,
      error: errorMessage,
    });

    /*
     * ----------------------------------------------------------
     * 5. Tell Postgres to retry or permanently fail the job
     * ----------------------------------------------------------
     */

    const { data: failed, error: failError } = await supabaseAdmin.rpc(
      "fail_notification_job",
      {
        job_id: job.id,
        worker_id: workerId,
        error_message: errorMessage,
      },
    );

    if (failError) {
      console.error("Failed to update failed notification job:", failError);

      return Response.json(
        {
          success: false,
          error: "Notification failed and job status could not be updated",
        },
        { status: 500 },
      );
    }

    if (!failed) {
      console.error("Notification job could not be marked failed/retry:", {
        jobId: job.id,
        workerId,
      });

      return Response.json(
        {
          success: false,
          error: "Notification failed and job ownership was lost",
        },
        { status: 500 },
      );
    }

    console.log("Notification job failure recorded:", {
      jobId: job.id,
      retryScheduled: failed,
    });

    return Response.json(
      {
        success: false,
        jobId: job.id,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
