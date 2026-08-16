export type StoreHours = {
  day: string;
  start_time: string;
  end_time: string;
  isClosed: boolean;
};

export function getStoreDateParts(date: Date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "America/Vancouver",
  });

  const parts = formatter.formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  if (!weekday || hour === undefined || minute === undefined) {
    throw new Error("Unable to determine store local time");
  }

  return {
    day: weekday,
    currentMinutes: Number(hour) * 60 + Number(minute),
  };
}

export function parseTime(time: string) {
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

export function isWithinStoreHours(
  hours: StoreHours,
  currentMinutes: number,
): boolean {
  if (hours.isClosed) {
    return false;
  }

  const start = parseTime(hours.start_time);
  const end = parseTime(hours.end_time);

  if (!start || !end) {
    throw new Error("Invalid store hours configuration");
  }

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}
