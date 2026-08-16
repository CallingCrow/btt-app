import { supabase } from "@/app/supabase-client";

type StoreHours = {
  day: string;
  start_time: string;
  end_time: string;
  isClosed: boolean;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseTime(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toLowerCase();

  if (period === "pm" && hours !== 12) {
    hours += 12;
  }

  if (period === "am" && hours === 12) {
    hours = 0;
  }

  return {
    hours,
    minutes,
  };
}

export async function isStoreOpen(): Promise<boolean> {
  const now = new Date();
  const today = DAYS[now.getDay()];

  const { data, error } = await supabase
    .from("hours")
    .select("day, start_time, end_time, isClosed")
    .eq("day", today)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch store hours:", error);

    // Fail closed rather than accidentally allowing an order.
    return false;
  }

  if (!data || data.isClosed) {
    return false;
  }

  const start = parseTime(data.start_time);
  const end = parseTime(data.end_time);

  if (!start || !end) {
    console.error("Invalid store hours:", data);

    // Fail closed if the hours cannot be understood.
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}
