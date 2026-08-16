"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase-client";
import {
  getStoreDateParts,
  isWithinStoreHours,
  type StoreHours,
} from "@/lib/store-hours";

export default function StoreStatusBanner() {
  const [isClosed, setIsClosed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkHours() {
      try {
        const { day, currentMinutes } = getStoreDateParts();

        const { data, error } = await supabase
          .from("hours")
          .select("day, start_time, end_time, isClosed")
          .eq("day", day)
          .maybeSingle();

        if (error) {
          console.error("Failed to fetch store hours:", error);
          setIsClosed(true);
          return;
        }

        if (!data) {
          setIsClosed(true);
          return;
        }

        const open = isWithinStoreHours(data as StoreHours, currentMinutes);

        setIsClosed(!open);
      } catch (error) {
        console.error("Failed to determine store status:", error);
        setIsClosed(true);
      }
    }

    checkHours();
  }, []);

  if (isClosed === null) {
    return null;
  }

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
