import { supabaseAdmin } from "@/lib/supabase-admin";

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

export async function isStoreOpenServer(): Promise<boolean> {
  const now = new Date();

  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "America/Vancouver",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "America/Vancouver",
  });

  const today = dayFormatter.format(now);
  const currentTime = timeFormatter.format(now);

  const [currentHour, currentMinute] = currentTime.split(":").map(Number);

  const currentMinutes = currentHour * 60 + currentMinute;

  const { data, error } = await supabaseAdmin
    .from("hours")
    .select("day, start_time, end_time, isClosed")
    .eq("day", today)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch store hours:", error);
    throw new Error("Unable to determine store hours");
  }

  if (!data) {
    return false;
  }

  if (data.isClosed) {
    return false;
  }

  const start = parseTime(data.start_time);
  const end = parseTime(data.end_time);

  if (!start || !end) {
    console.error("Invalid store hours:", data);
    throw new Error("Invalid store hours configuration");
  }

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}
