import Link from "next/link";
import { useState } from "react";
import { carePlans, packages } from "@/site.config";
export function CarePlans() {
  const [yearly, setYearly] = useState(true);
  return (<div
          className="rocket-care care-section"
          id="care"
          role="region"
          aria-label="Website purchase and ongoing care pricing"
        >
          <span className="eyebrow">KEEP YOUR WEBSITE IN GOOD HANDS</span>
          <h2>
            Built once.
            <br />
            Looked after.
          </h2>
          <div className="care-purchase">
            <span className="care-step">01 / BUY YOUR WEBSITE · ONE-OFF</span>
            <p>A one-off build fee. Your website, designed and built for you.</p>
            <div className="care-build-prices">
              {packages.map((p) => (
                <span key={p.id}>{p.name}<strong>From ${p.price.toLocaleString("en-AU")}</strong></span>
              ))}
            </div>
          </div>
          <span className="care-step">02 / CHOOSE ONGOING CARE</span>
          <p>
            After your build, add optional hosting and maintenance. Every plan
            below is shown as a monthly cost so the value is easy to compare.
          </p>
          <div
            className="billing-toggle"
            role="group"
            aria-label="Hosting billing period"
          >
            <button aria-pressed={yearly} onClick={() => setYearly(true)}>
              Pay annually <span>Save 25%</span>
            </button>
            <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
              Pay monthly
            </button>
          </div>
          <div className="rocket-care-plans">
            {carePlans.map((c) => (
              <Link
                key={c.id}
                href={`/quote?care=${c.id}&billing=${yearly ? "yearly" : "monthly"}`}
              >
                <span>{c.name}</span>
                <strong>
                  ${yearly ? (c.annual / 12).toFixed(2) : c.price.toLocaleString("en-AU")}
                  <small>/month</small>
                </strong>
                <span>
                  {yearly
                    ? `Paid annually: $${c.annual.toLocaleString("en-AU")}/year · save $${(c.price * 12 - c.annual).toLocaleString("en-AU")}`
                    : `$${(c.price * 12).toLocaleString("en-AU")}/year if kept for 12 months`}
                </span>
                <p>{c.description}</p>
                <span className="care-action">Choose this care plan ↗</span>
              </Link>
            ))}
          </div>
          <p className="care-custom">
            Need a different level of support? <Link href="/quote?source=custom-maintenance">Custom care, priced to your needs ↗</Link>
          </p>
          <p className="care-scope">
            All prices are AUD. Build prices are starting prices and we confirm
            the final scope before work begins. “Small update” means a text,
            image or link change—not a new page, design or feature. Domains,
            provider usage, transaction fees and work outside the listed care
            allowance are separate and quoted before we proceed.
          </p>

        </div>);
}
