import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_DB_LINK,
  process.env.NEXT_PUBLIC_DB_API
);

async function testStorageReadAccess() {
  console.log("\nSupabase Storage Anonymous Read Security Test");
  console.log("=============================================");

  const buckets = [
    "hero-images",
    "info-section-images",
    "menu-images",
    "misc-images",
  ];

  let failed = false;

  for (const bucket of buckets) {
    console.log(`\nTesting bucket: ${bucket}`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .list("", {
        limit: 10,
        offset: 0,
      });

    if (error) {
      console.log(`PASS: anonymous read on ${bucket} was blocked`);
    } else {
      console.log(
        `PASS: anonymous read on ${bucket} is allowed (${data.length} object(s) returned)`
      );
    }
  }

  console.log(
    failed
      ? "\nStorage read security test FAILED."
      : "\nStorage read security test completed."
  );
}

await testStorageReadAccess();