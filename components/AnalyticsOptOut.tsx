"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect } from "react";

// Vercel Web Analytics, but with a per-browser opt-out so Valeria's own visits
// don't inflate the numbers. Visit any page with ?va-optout once on a device to
// silence analytics there; ?va-optin re-enables it. The flag lives in
// localStorage, so it's per-browser and survives reloads.
export default function AnalyticsOptOut() {
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.has("va-optout")) localStorage.setItem("va-opt-out", "1");
      if (p.has("va-optin")) localStorage.removeItem("va-opt-out");
    } catch {
      // ignore (private mode / blocked storage)
    }
  }, []);

  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (localStorage.getItem("va-opt-out") === "1") return null;
        } catch {
          // if storage is unavailable, just track normally
        }
        return event;
      }}
    />
  );
}
