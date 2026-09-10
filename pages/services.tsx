import { SEO } from "@/components/SEO";
import { Packages } from "@/components/Packages";
export default function Services() {
  return (
    <>
      <SEO
        title="Website packages & pricing — APEXWEB"
        description="Compare one-time website builds from $300 AUD and optional monthly care."
      />
      <Packages />
    </>
  );
}
