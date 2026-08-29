import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_DB_LINK,
  process.env.NEXT_PUBLIC_DB_API,
);

async function testAnonymousWriteAccess() {
  console.log("\nAnonymous Write Security Test");
  console.log("=============================");

  // --------------------------------------------------
  // orders INSERT
  // --------------------------------------------------

  const { error: ordersInsertError } = await supabase
    .from("orders")
    .insert({
      status: "security_test",
      subtotal: 0,
      tax: 0,
      total: 0,
      order_items: [],
    });

  if (ordersInsertError) {
    console.log("PASS: anonymous INSERT on orders was blocked");
  } else {
    console.log("FAIL: anonymous INSERT on orders was allowed");
  }

  // --------------------------------------------------
  // notification_jobs INSERT
  // --------------------------------------------------

  const { error: jobsInsertError } = await supabase
    .from("notification_jobs")
    .insert({
      order_id: "00000000-0000-0000-0000-000000000000",
      type: "security_test",
      status: "pending",
    });

  if (jobsInsertError) {
    console.log(
      "PASS: anonymous INSERT on notification_jobs was blocked",
    );
  } else {
    console.log(
      "FAIL: anonymous INSERT on notification_jobs was allowed",
    );
  }

  // --------------------------------------------------
  // webhook_events INSERT
  // --------------------------------------------------

  const { error: webhookInsertError } = await supabase
    .from("webhook_events")
    .insert({
      id: "security-test",
      type: "security_test",
      raw: {},
    });

  if (webhookInsertError) {
    console.log(
      "PASS: anonymous INSERT on webhook_events was blocked",
    );
  } else {
    console.log(
      "FAIL: anonymous INSERT on webhook_events was allowed",
    );
  }

  // --------------------------------------------------
  // menu INSERT
  // --------------------------------------------------

  const { error: menuInsertError } = await supabase
    .from("menu")
    .insert({
      name: "SECURITY TEST - DO NOT KEEP",
      price: 1,
    });

  if (menuInsertError) {
    console.log("PASS: anonymous INSERT on menu was blocked");
  } else {
    console.log("FAIL: anonymous INSERT on menu was allowed");
  }

  console.log("\nAnonymous UPDATE/DELETE Security Test");
  console.log("====================================");

  // This UUID should never correspond to a real row.
  const testOrderId = "00000000-0000-0000-0000-000000000000";
  const testMenuId = "00000000-0000-0000-0000-000000000000";

  // --------------------------------------------------
  // orders UPDATE
  // --------------------------------------------------

  const { data: ordersUpdateData, error: ordersUpdateError } =
    await supabase
      .from("orders")
      .update({
        status: "security_test",
      })
      .eq("id", testOrderId)
      .select("id");

  if (ordersUpdateError) {
    console.log("PASS: anonymous UPDATE on orders was blocked");
  } else if (!ordersUpdateData || ordersUpdateData.length === 0) {
    console.log(
      "PASS: anonymous UPDATE on orders affected no rows",
    );
  } else {
    console.log("FAIL: anonymous UPDATE on orders modified a row");
  }

  // --------------------------------------------------
  // orders DELETE
  // --------------------------------------------------

  const { data: ordersDeleteData, error: ordersDeleteError } =
    await supabase
      .from("orders")
      .delete()
      .eq("id", testOrderId)
      .select("id");

  if (ordersDeleteError) {
    console.log("PASS: anonymous DELETE on orders was blocked");
  } else if (!ordersDeleteData || ordersDeleteData.length === 0) {
    console.log(
      "PASS: anonymous DELETE on orders affected no rows",
    );
  } else {
    console.log("FAIL: anonymous DELETE on orders deleted a row");
  }

  // --------------------------------------------------
  // menu UPDATE
  // --------------------------------------------------

  const { data: menuUpdateData, error: menuUpdateError } =
    await supabase
      .from("menu")
      .update({
        name: "SECURITY TEST - DO NOT KEEP",
      })
      .eq("id", testMenuId)
      .select("id");

  if (menuUpdateError) {
    console.log("PASS: anonymous UPDATE on menu was blocked");
  } else if (!menuUpdateData || menuUpdateData.length === 0) {
    console.log(
      "PASS: anonymous UPDATE on menu affected no rows",
    );
  } else {
    console.log("FAIL: anonymous UPDATE on menu modified a row");
  }

  // --------------------------------------------------
  // menu DELETE
  // --------------------------------------------------

  const { data: menuDeleteData, error: menuDeleteError } =
    await supabase
      .from("menu")
      .delete()
      .eq("id", testMenuId)
      .select("id");

  if (menuDeleteError) {
    console.log("PASS: anonymous DELETE on menu was blocked");
  } else if (!menuDeleteData || menuDeleteData.length === 0) {
    console.log(
      "PASS: anonymous DELETE on menu affected no rows",
    );
  } else {
    console.log("FAIL: anonymous DELETE on menu deleted a row");
  }
}

async function testAnonymousPublicReads() {
  console.log("\nAnonymous Public Read Security Test");
  console.log("==================================");

  const publicTables = [
    "category_customization_groups",
    "contact_info",
    "customization_defaults",
    "customization_groups",
    "customization_options",
    "hero_images",
    "hours",
    "info",
    "menu",
    "menu_categories",
  ];

  let failed = false;

  for (const table of publicTables) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .limit(1);

    if (error) {
      console.log(`FAIL: anonymous SELECT on ${table} was blocked`);
      console.log(`     ${error.message}`);
      failed = true;
    } else if (!data || data.length === 0) {
      console.log(`WARN: anonymous SELECT on ${table} succeeded but returned no rows`);
    } else {
      console.log(`PASS: anonymous SELECT on ${table} is accessible`);
    }
  }

  if (failed) {
    throw new Error("Anonymous public-read RLS test FAILED.");
  }

  console.log("\nAnonymous public-read RLS test PASSED.");
}


await testAnonymousWriteAccess();
await testAnonymousPublicReads();
