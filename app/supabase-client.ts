import { createClient } from "@supabase/supabase-js";

var dbLink = process.env.NEXT_PUBLIC_DB_LINK;
var apiKey = process.env.NEXT_PUBLIC_DB_API;

export const supabase = createClient(dbLink, apiKey);
