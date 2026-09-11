import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { packages, carePlans } from "@/site.config";
import { track } from "@/lib/analytics";
export function Packages() {
  return (
    <section className="section container" id="packages">
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 — THE RIGHT FIT</p>
          <h2>
            Big on quality.
            <br />
            <span>Clear on price.</span>
          </h2>
        </div>
        <p>
          Start with the website your business needs.
          <br />
          Every package is a one-time build, with a final quote agreed before we
          begin.
        </p>
      </div>
      <div className="package-grid">
        {packages.map((p, i) => (
          <article
            className={`package ${p.recommended ? "recommended" : ""}`}
            key={p.id}
          >
            <div className="package-top">
              <span className="mono">0{i + 1}</span>
              {p.recommended && (
                <span className="recommend-badge">
                  Recommended for service businesses
                </span>
              )}
            </div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="price">
              <span>From</span> ${p.price}
              <span>AUD / one-time</span>
            </div>
            <Link
              className={`button ${p.recommended ? "" : "button-outline"}`}
              href={`/quote?package=${p.id}`}
              onClick={() => track("package_selected", { package: p.id })}
            >
              {p.cta}
              <ArrowUpRight size={18} />
            </Link>
            <div className="package-includes">
              {p.features.map((f) => (
                <div key={f}>
                  <Check size={16} />
                  {f}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="custom-package">
        <p>
          <strong>Something different in mind?</strong> Ecommerce, a larger
          project, or not sure where to start?
        </p>
        <Link href="/quote?package=custom">
          Let’s find your fit <ArrowUpRight size={18} />
        </Link>
      </div>
      <details className="comparison">
        <summary>
          Compare the details <Plus size={19} />
        </summary>
        <div className="table-scroll">
          <table>
            <caption>Website build comparison</caption>
            <thead>
              <tr>
                <th scope="col">What you need</th>
                {packages.map((p) => (
                  <th scope="col" key={p.id}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Pages", ...packages.map((p) => p.pages)],
                ["Phone, tablet & desktop", "Included", "Included", "Included"],
                [
                  "Motion",
                  "Static — no animation",
                  "Moderate interactive scrolling",
                  "Cinematic 3D sequences",
                ],
                [
                  "Integrations",
                  "Contact enquiries",
                  "Stripe available",
                  "Stripe, database, email / newsletters",
                ],
                ["Hosting & domain", "Separate", "Separate", "Separate"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) =>
                    i === 0 ? (
                      <th scope="row" key={i}>
                        {c}
                      </th>
                    ) : (
                      <td key={i}>{c}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <details className="comparison">
        <summary>
          Optional care after launch — from $39/month <Plus size={19} />
        </summary>
        <div className="care-grid">
          {carePlans.map((p) => (
            <div key={p.id}>
              <h3>
                {p.name} <span>${p.price}/mo</span>
              </h3>
              <p>{p.description}</p>
              <p><strong>${p.annual}/year — save 25%</strong></p>
              <Link href={`/quote?care=${p.id}`}>
                Ask about {p.name} <ArrowUpRight size={16} />
              </Link>
            </div>
          ))}
        </div>
        <p className="fine-print">
          Care is optional and agreed separately after approval. Update
          allowances, domains, third-party fees and any applicable tax are
          confirmed in your written quote.
        </p>
      </details>
    </section>
  );
}
