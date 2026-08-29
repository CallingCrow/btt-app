import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_DB_LINK,
  process.env.NEXT_PUBLIC_DB_API
);

async function testAnonymousDownloads() {
  console.log("\nSupabase Storage Anonymous Download Security Test");
  console.log("=================================================");

  const files = [
    ["hero-images", "home.jpg"],
    ["info-section-images", "info1.jpg"],
    ["menu-images", "boba.png"],
    ["misc-images", "logo.png"],
  ];

  let failed = false;

  for (const [bucket, path] of files) {
    console.log(`\nTesting: ${bucket}/${path}`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error || !data) {
      console.log(`FAIL: anonymous download of ${bucket}/${path} was blocked`);
      if (error) {
        console.log(`      ${error.message}`);
      }
      failed = true;
    } else {
      console.log(
        `PASS: anonymous download of ${bucket}/${path} was allowed`
      );
      console.log(`      File size: ${data.size} bytes`);
      console.log(`      File type: ${data.type || "unknown"}`);
    }
  }

  console.log(
    failed
      ? "\nStorage download security test FAILED."
      : "\nStorage download security test PASSED."
  );

  if (failed) {
    process.exitCode = 1;
  }
}

await testAnonymousDownloads();