export function track(event: string, details: Record<string, string> = {}) {
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("apexweb:analytics", { detail: { event, ...details } }),
    );
}
