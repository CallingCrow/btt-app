import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_DB_LINK,
  process.env.NEXT_PUBLIC_DB_API
);

const tests = [
  { table: "orders", expected: "blocked" },
  { table: "webhook_events", expected: "blocked" },
  { table: "notification_jobs", expected: "blocked" },
  { table: "menu", expected: "public" },
  { table: "menu_categories", expected: "public" },
  { table: "customization_groups", expected: "public" },
  { table: "customization_options", expected: "public" },
];

let failed = false;

console.log("\nSupabase Anonymous API Exposure Test");
console.log("====================================");

for (const test of tests) {
  const { data, error } = await supabase
    .from(test.table)
    .select("*")
    .limit(1);

  const accessible = !error && Array.isArray(data);

  if (test.expected === "blocked") {
    if (error || !data || data.length === 0) {
      console.log(`PASS: anonymous SELECT on ${test.table} was blocked`);
    } else {
      console.log(`FAIL: anonymous SELECT on ${test.table} returned data`);
      failed = true;
    }
  } else {
    if (accessible) {
      console.log(`PASS: anonymous SELECT on ${test.table} is accessible`);
    } else {
      console.log(`FAIL: anonymous SELECT on ${test.table} was unexpectedly blocked`);
      console.log(`     Error: ${error?.message ?? "unknown error"}`);
      failed = true;
    }
  }
}

console.log("");

if (failed) {
  console.log("Supabase anonymous API exposure test FAILED.");
  process.exit(1);
} else {
  console.log("Supabase anonymous API exposure test PASSED.");
}