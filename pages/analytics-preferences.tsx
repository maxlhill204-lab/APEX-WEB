import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { excludeThisBrowser, includeThisBrowser } from "@/lib/analytics-preferences";

export default function AnalyticsPreferences() {
  const [status, setStatus] = useState("Saving your browser preference…");

  useEffect(() => {
    // Save browser-only storage after hydration, then report the actual result.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(excludeThisBrowser()
      ? "Your visits are now excluded from APEXWEB analytics in this browser."
      : "Your browser blocked the preference. Allow site storage, then try again.");
  }, []);

  return (
    <>
      <Head>
        <title>Analytics preferences — APEXWEB</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="container prose-page">
        <p className="eyebrow">BROWSER PREFERENCE</p>
        <h1>Exclude your own visits.</h1>
        <p role="status">{status}</p>
        <p>
          Opening this page excludes future visits from this browser. You can
          browse APEXWEB normally after this. Open this page once in each browser
          or device you use, and again if you clear site data or use a new private
          browsing session. Existing analytics totals stay as they are.
        </p>
        <p><Link href="/">Back to APEXWEB</Link></p>
        <p>
          <button type="button" className="button button-outline" onClick={() => {
            setStatus(excludeThisBrowser()
              ? "Your visits are now excluded from APEXWEB analytics in this browser."
              : "Your browser blocked the preference. Allow site storage, then try again.");
          }}>Exclude this browser</button>
        </p>
        <p>
          <button type="button" className="button button-outline" onClick={() => {
            setStatus(includeThisBrowser()
              ? "Your visits will be counted again when you leave this page."
              : "Your browser blocked the change. Allow site storage, then try again.");
          }}>Count this browser again</button>
        </p>
      </section>
    </>
  );
}
