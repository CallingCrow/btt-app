import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

var dbLink = process.env.NEXT_PUBLIC_DB_LINK;
var apiKey = process.env.NEXT_PUBLIC_DB_API;

if (!dbLink) {
  throw new Error("Missing NEXT_PUBLIC_DB_LINK");
}

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_DB_API");
}

export const supabase = createClient<Database>(dbLink, apiKey);
