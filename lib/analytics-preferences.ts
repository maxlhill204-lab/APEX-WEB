import type { BeforeSendEvent } from "@vercel/analytics/next";

const STORAGE_KEY = "apexweb:exclude-analytics:v1";

export function excludeThisBrowser(): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function includeThisBrowser(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return window.localStorage.getItem(STORAGE_KEY) === null;
  } catch {
    return false;
  }
}

export function isAnalyticsExcluded(): boolean {
  if (typeof window === "undefined") return false;
  // The preference page must never count, including its first page view before
  // React's effects save the browser preference.
  if (window.location.pathname.replace(/\/$/, "") === "/analytics-preferences") {
    return true;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function filterAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  return isAnalyticsExcluded() ? null : event;
}
