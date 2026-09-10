import type { GetServerSideProps } from "next";
import { ArrowUpRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { QuoteWizard } from "@/components/QuoteWizard";
import { site, carePlans } from "@/site.config";
import { packageIds, type Lead } from "@/lib/lead";
type Props = {
  initialPackage: string;
  initialCare: string;
  attribution: Partial<Lead>;
};
export default function Quote(props: Props) {
  return (
    <>
      <SEO
        title="Request a website quote — APEXWEB"
        description="Tell APEXWEB about your business and get a tailored website quote. No commitment, no payment and a clear next step."
      />
      <section className="container quote-page">
        <div className="quote-layout">
          <aside className="quote-intro">
            <p className="eyebrow">LET’S MAKE SOMETHING THAT FITS</p>
            <h1>
              Your business.
              <br />
              <span>Your next step.</span>
            </h1>
            <p>
              A few details now. A clearer picture of your new website next.
              Choose a starting point and we’ll work out the rest together.
            </p>
            <div className="quote-aside">
              <strong>A conversation, not a checkout.</strong>
              <p>
                No payment details. No commitment.
                <br />
                Your scope and price are confirmed before work starts.
              </p>
              <a href={`mailto:${site.email}`}>
                {site.email}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </aside>
          <QuoteWizard {...props} />
        </div>
      </section>
    </>
  );
}
export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const get = (k: string) =>
    typeof query[k] === "string" ? (query[k] as string).slice(0, 250) : "";
  return {
    props: {
      initialPackage: packageIds.includes(get("package"))
        ? get("package")
        : "unsure",
      initialCare: carePlans.some((p) => p.id === get("care"))
        ? get("care")
        : "unsure",
      attribution: {
        source: get("source") || "website",
        utm_source: get("utm_source"),
        utm_medium: get("utm_medium"),
        utm_campaign: get("utm_campaign"),
      },
    },
  };
};
