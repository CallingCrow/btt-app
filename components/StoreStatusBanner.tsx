"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase-client";

type Hours = {
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

export default function StoreStatusBanner() {
  const [isClosed, setIsClosed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkHours() {
      const now = new Date();

      const today = DAYS[now.getDay()];

      const { data, error } = await supabase
        .from("hours")
        .select("day, start_time, end_time, isClosed")
        .eq("day", today)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch store hours:", error);
        return;
      }

      if (!data) {
        setIsClosed(true);
        return;
      }

      if (data.isClosed) {
        setIsClosed(true);
        return;
      }

      const start = parseTime(data.start_time);
      const end = parseTime(data.end_time);

      if (!start || !end) {
        console.error("Invalid store hours:", data);
        return;
      }

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const startMinutes = start.hours * 60 + start.minutes;
      const endMinutes = end.hours * 60 + end.minutes;

      setIsClosed(
        currentMinutes < startMinutes || currentMinutes >= endMinutes,
      );
    }

    checkHours();
  }, []);

  return (
    <div className="bg-secondary py-1">
      <div className="px-[1.25rem] md:px-[2.5rem] lg:px-[6rem]">
        {isClosed === true ? (
          <span className="">Bubble Tea Time is currently closed!</span>
        ) : isClosed === false ? (
          <>
            Order for Pickup. Order for delivery{" "}
            <a
              href="https://www.ubereats.com/ca/store/bubble-tea-time-w-10th-ave/IeY35VC-TOy8DG6Y0wTZQg?utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free&utm_source=google-pas&rwg_token=AE37R_jksu7s0PgIpZuxVQEsPgfa3xWj7XwJDmAjJHwgK2LPbGaPNvZVjtLmpS7KJ0pW_OIlO6ckMJWKiVI1KzhJpZlmVZWAgw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-foreground underline"
            >
              here
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
