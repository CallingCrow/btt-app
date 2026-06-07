import { supabase } from "@/app/supabase-client";

import { sendMerchantNotification }
  from "@/lib/sendMerchantNotification";

export async function GET(req: Request) {

  try {

    // Protect route

    // const isVercelCron =
    //     req.headers.get("x-vercel-cron");

    // if (!isVercelCron) {
    //     return new Response(
    //         "Unauthorized",
    //         { status: 401 }
    //     );
    // }

    // Fetch pending jobs

    const { data: jobs, error: jobsError } =
      await supabase
        .from("notification_jobs")
        .select("*")
        .eq("status", "pending")
        .limit(10);

    if (jobsError) {
      throw jobsError;
    }

    if (!jobs?.length) {

      return Response.json({
        success: true,
        message: "No pending jobs",
      });
    }

    // Process each job

    for (const job of jobs) {

      try {

        // Mark as processing
        await supabase
          .from("notification_jobs")
          .update({
            status: "processing",
          })
          .eq("id", job.id);

        // Fetch order
        const { data: order, error: orderError } =
          await supabase
            .from("orders")
            .select("*")
            .eq("id", job.order_id)
            .single();

        if (orderError || !order) {
          throw new Error("Order not found");
        }

        // Send notification to merchant
        await sendMerchantNotification(order);

        // Mark completed
        await supabase
          .from("notification_jobs")
          .update({
            status: "completed",

            processed_at:
              new Date().toISOString(),
          })
          .eq("id", job.id);

      } catch (err: any) {

        console.error(
          "Job processing failed:",
          err
        );

        // Mark Failed
        await supabase
          .from("notification_jobs")
          .update({
            status: "failed",

            attempts:
              (job.attempts || 0) + 1,

            last_error:
              err.message || "Unknown error",
          })
          .eq("id", job.id);
      }
    }

    // Success
    return Response.json({
      success: true,
    });

  } catch (err: any) {

    console.error(
      "Worker route error:",
      err
    );

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}