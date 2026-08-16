import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  getStoreDateParts,
  isWithinStoreHours,
  type StoreHours,
} from "@/lib/store-hours";

export async function isStoreOpenServer(): Promise<boolean> {
  const { day, currentMinutes } = getStoreDateParts();

  const { data, error } = await supabaseAdmin
    .from("hours")
    .select("day, start_time, end_time, isClosed")
    .eq("day", day)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch store hours:", error);
    throw new Error("Unable to determine store hours");
  }

  if (!data) {
    return false;
  }

  try {
    return isWithinStoreHours(data as StoreHours, currentMinutes);
  } catch (error) {
    console.error("Invalid store hours:", error);
    throw new Error("Invalid store hours configuration");
  }
}
