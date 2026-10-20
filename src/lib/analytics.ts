"use client";

/**
 * Minimal analytics layer. Events are only transmitted when an endpoint is
 * configured AND the visitor has granted consent. No cookies are set. With
 * NEXT_PUBLIC_ANALYTICS_DEBUG=1, events are also recorded on
 * window.__analyticsEvents for tests and local debugging.
 */
export type AnalyticsEvent =
  | "page_view"
  | "slot_view"
  | "search_use"
  | "filter_use"
  | "demo_click"
  | "affiliate_click";

type Props = Record<string, string | number | boolean | null | undefined>;

const ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "";
const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1";
export const CONSENT_KEY = "paytable.consent.analytics";

declare global {
  interface Window {
    __analyticsEvents?: { name: AnalyticsEvent; props: Props; at: number }[];
  }
}

export function analyticsConfigured(): boolean {
  return Boolean(ENDPOINT);
}

export function getConsent(): "granted" | "denied" | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable: treat as not granted */
  }
}

export function track(name: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  if (DEBUG) {
    window.__analyticsEvents ??= [];
    window.__analyticsEvents.push({ name, props, at: Date.now() });
  }
  if (!ENDPOINT || getConsent() !== "granted") return;
  const body = JSON.stringify({ name, props, path: window.location.pathname, ts: Date.now() });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, body);
    else void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
  } catch {
    /* analytics must never break the page */
  }
}
