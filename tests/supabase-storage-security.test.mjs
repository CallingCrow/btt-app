import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_DB_LINK,
  process.env.NEXT_PUBLIC_DB_API
);

async function testStorageSecurity() {
  console.log("\nSupabase Storage Anonymous Write Security Test");
  console.log("==============================================");

  const buckets = [
    "hero-images",
    "info-section-images",
    "menu-images",
    "misc-images",
  ];

  let failed = false;

  for (const bucket of buckets) {
    const testPath = "security-test-do-not-keep.txt";

    console.log(`\nTesting bucket: ${bucket}`);

    // --------------------------------------------------
    // Anonymous upload
    // --------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(testPath, new Blob(["security test"]));

    if (uploadError) {
      console.log(`PASS: anonymous upload to ${bucket} was blocked`);
    } else {
      console.log(`FAIL: anonymous upload to ${bucket} was allowed`);
      failed = true;

      // Clean up if the upload somehow succeeded.
      await supabase.storage.from(bucket).remove([testPath]);
    }

    // --------------------------------------------------
    // Anonymous delete
    // --------------------------------------------------

    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([testPath]);

    if (deleteError) {
      console.log(`PASS: anonymous delete on ${bucket} was blocked`);
    } else {
      console.log(`PASS: anonymous delete on ${bucket} affected no object`);
    }
  }

  console.log(
    failed
      ? "\nStorage security test FAILED."
      : "\nStorage security test PASSED."
  );
}

await testStorageSecurity();
