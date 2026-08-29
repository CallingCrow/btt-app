import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_DB_LINK;
const anonKey = process.env.NEXT_PUBLIC_DB_API;

if (!supabaseUrl || !anonKey) {
  throw new Error("Missing Supabase public environment variables");
}

const supabase = createClient(supabaseUrl, anonKey);

const functions = [
  {
    name: "claim_notification_job",
    args: {
      worker_id: "security-audit-test",
    },
  },
  {
    name: "complete_notification_job",
    args: {
      job_id: 0,
      worker_id: "security-audit-test",
    },
  },
  {
    name: "fail_notification_job",
    args: {
      job_id: 0,
      worker_id: "security-audit-test",
      error_message: "security audit test",
    },
  },
];

async function testRpcSecurity() {
  console.log("\nSupabase RPC Security Test");
  console.log("==========================");

  let failed = false;

  for (const fn of functions) {
    console.log(`\nTesting RPC: ${fn.name}`);

    const { data, error } = await supabase.rpc(fn.name, fn.args);

    if (error) {
      console.log(
        `PASS: anonymous execution of ${fn.name} was blocked`
      );
    } else {
      console.log(
        `FAIL: anonymous execution of ${fn.name} was allowed`
      );
      console.log("Unexpected response:", data);
      failed = true;
    }
  }

  console.log(
    failed
      ? "\nRPC security test FAILED."
      : "\nRPC security test PASSED."
  );
}

await testRpcSecurity();