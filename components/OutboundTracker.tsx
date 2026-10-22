"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, rememberLanding, lastDiagnosis } from "@/lib/track";

const UTM = { utm_source: "burnedinbox", utm_medium: "referral" };

export default function OutboundTracker() {
  const pathname = usePathname();

  useEffect(() => { rememberLanding(); }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try { url = new URL(a.href); } catch { return; }
      if (!/(^|\.)warminboxes\.com$/.test(url.hostname)) return;

      const location = a.dataset.cta
        ?? (a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest("nav") ? "nav" : "body");
      if (!url.searchParams.has("utm_source")) {
        for (const [k, v] of Object.entries(UTM)) url.searchParams.set(k, v);
        url.searchParams.set("utm_campaign", location);
        a.href = url.toString();
      }
      track("bi_outbound_warminboxes", {
        page_path: pathname,
        link_location: location,
        diagnosis_class: lastDiagnosis(),
        destination_path: url.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
