export function sanitiseAnalyticsUrl(value: string): string {
  try { const url = new URL(value); url.search = ''; url.hash = ''; return url.toString(); }
  catch { return value.split(/[?#]/)[0]; }
}
