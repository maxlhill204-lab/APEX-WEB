import { useState } from "react";
import type { GetServerSideProps } from "next";
import { Check, ArrowUpRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { QuoteWizard } from "@/components/QuoteWizard";
import { PackageAtom } from "@/components/PackageAtom";
import { site, carePlans, packages } from "@/site.config";
import { packageIds, type Lead } from "@/lib/lead";
type Props = {
  initialPackage: string;
  initialCare: string;
  attribution: Partial<Lead>;
};
const guidance = [
  [
    "The right starting point.",
    "Choose the level of design and interaction your business needs. You can change your mind as we plan it together.",
  ],
  [
    "Built around your business.",
    "Your services, your audience, your goals. These details help us shape a website that feels like you.",
  ],
  [
    "Choose what it can do.",
    "Connect the tools you need. We’ll confirm the scope, maintenance and provider costs before you commit.",
  ],
  [
    "A real conversation next.",
    "We’ll use these details to discuss your project. No mailing-list signup and no payment today.",
  ],
  [
    "Your project, taking shape.",
    "Review your choices. We’ll come back with a clear scope, final price and proposed next steps.",
  ],
];
export default function Quote(props: Props) {
  const [selection, setSelection] = useState(props.initialPackage),
    [step, setStep] = useState(0);
  const index = packages.findIndex((p) => p.id === selection),
    plan = packages[index],
    visual = selection === "custom" ? 3 : selection === "unsure" ? 4 : Math.max(index, 0);
  return (
    <>
      <SEO
        title="Your next chapter — Request a quote | APEXWEB"
        description="Shape your custom website with APEXWEB. Explore the right package, choose your features and request a clear, no-obligation quote."
      />
      <section
        className={`quote-page quote-cinematic quote-level-${Math.max(index, 0)}`}
      >
        <div className="quote-ambient" aria-hidden="true" />
        <div className="container quote-layout">
          <aside className="quote-intro">
            <span className="eyebrow">LET’S MAKE SOMETHING THAT’S YOURS</span>
            <h1>
              Your next
              <br />
              <span>chapter.</span>
            </h1>
            <div className="quote-orbit">
              <PackageAtom level={visual} compact />
            </div>
            <div className="quote-guidance" key={step}>
              <span className="quote-stage-number">0{step + 1} / 05</span>
              <h2>{guidance[step][0]}</h2>
              <p>{guidance[step][1]}</p>
            </div>
            <div className="quote-selection-summary" aria-live="polite">
              <span className="eyebrow">YOUR STARTING POINT</span>
              <div>
                <strong>{plan?.name || (selection === "custom" ? "Custom project" : "Help me decide")}</strong>
                <span>
                  {plan ? `From $${plan.price} AUD` : "Tailored to you"}
                </span>
              </div>
              <p>
                {plan
                  ? "One-off build · hosting optional"
                  : "Choose a plan or ask us to guide you."}
              </p>
            </div>
            <div className="quote-promises">
              <span>
                <Check size={13} /> Custom design
              </span>
              <span>
                <Check size={13} /> Clear scope first
              </span>
              <span>
                <Check size={13} /> Review before launch
              </span>
            </div>
            <a className="quote-email" href={`mailto:${site.email}`}>
              Talk it through by email <ArrowUpRight size={14} />
            </a>
          </aside>
          <div className="quote-form-stage">
            <div className="quote-form-label">
              <span>YOUR PROJECT BRIEF</span>
              <span>NO PAYMENT TODAY</span>
            </div>
            <QuoteWizard
              {...props}
              onPackageChange={setSelection}
              onStepChange={setStep}
            />
            <p className="quote-confidence">
              Your choices start the conversation. We agree the scope and final
              price together before any work begins.
            </p>
          </div>
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
        : "business",
      initialCare: carePlans.some((p) => p.id === get("care"))
        ? get("care")
        : "unsure",
      attribution: {
        billing: ["monthly", "yearly"].includes(get("billing"))
          ? get("billing")
          : "unsure",
        source: get("source") || "website",
        utm_source: get("utm_source"),
        utm_medium: get("utm_medium"),
        utm_campaign: get("utm_campaign"),
      },
    },
  };
};
