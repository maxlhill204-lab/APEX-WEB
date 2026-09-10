import Link from "next/link";
import { SEO } from "@/components/SEO";
export default function NotFound() {
  return (
    <>
      <SEO
        title="Page not found — APEXWEB"
        description="Find your way back to APEXWEB."
      />
      <section className="container prose-page">
        <p className="eyebrow">404 — A SMALL DETOUR</p>
        <h1>
          Let’s get you
          <br />
          back on track.
        </h1>
        <p>This page may have moved. Your next website starts here.</p>
        <Link href="/" className="button">
          Back to APEXWEB
        </Link>
      </section>
    </>
  );
}
