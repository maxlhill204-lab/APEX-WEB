import { isAnalyticsExcluded } from "./analytics-preferences";

export function track(event: string, details: Record<string, string> = {}) {
  if (typeof window !== "undefined" && !isAnalyticsExcluded())
    window.dispatchEvent(
      new CustomEvent("apexweb:analytics", { detail: { event, ...details } }),
    );
}
