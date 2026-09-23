import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { packages, faqs } from "@/site.config";
import { CarePlans } from "./CarePlans";
import { track } from "@/lib/analytics";
export function Packages() {
  return (
    <>
    <section className="section container pricing-page" id="packages">
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 — THE RIGHT FIT</p>
          <h1>
            Big on quality.
            <br />
            <span>Clear on price.</span>
          </h1>
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
                  Best value for connected sites
                </span>
              )}
            </div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="price">
              <span>From</span> ${p.price}
              <span>AUD / one-time</span>
            </div>
            <p className="package-value">{p.id === "growth" ? `Only $${packages[2].price - packages[1].price} above Business for 4 more pages, 3D and connected tools.` : p.id === "business" ? "For service businesses ready for more pages, interaction and one useful connection." : "A focused, affordable starting point for customers to find and contact you."}</p>
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
      <div className="included-every-build">
        <h3>Every build starts with the essentials.</h3>
        <p>Custom design using your brand and supplied content, mobile and desktop layouts, a working enquiry form, page titles and descriptions, social and map links, HTTPS and domain connection, pre-launch testing, a review before publishing, and handover of your website and accounts.</p>
        <p>Your written quote confirms the page list, design, integrations, review rounds and launch date. Domains, hosting, paid services and transaction fees are separate. Full online stores, custom applications and ongoing content creation are quoted separately.</p>
      </div>
      <details className="comparison" open>
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
                ["Starting build price (AUD)", ...packages.map((p) => `$${p.price} once`)],
                ["Best for", "Getting found and receiving enquiries", "A larger service site with one connection", "A distinctive site with connected business tools"],
                ["Phone, tablet & desktop", "Included", "Included", "Included"],
                ["Custom design, enquiry form & basic SEO", "Included", "Included", "Included"],
                [
                  "Motion",
                  "Static — no animation",
                  "Moderate interactive scrolling",
                  "Cinematic 3D sequences",
                ],
                [
                  "Integrations",
                  "Contact enquiries",
                  "One agreed booking link, Stripe payment flow or enquiry workflow",
                  "An agreed Stripe + database workflow and email/newsletter connection",
                ],
                ["Database", "Not included", "Quoted separately", "One scoped Firebase/database integration"],
                ["3D experience", "Not included", "Quoted separately", "One agreed cinematic 3D/scroll experience"],
                ["Review, launch checks & handover", "Included", "Included", "Included, plus connected-tool handover"],
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
    </section>
    <CarePlans />
    <section className="section container pricing-faq" aria-labelledby="pricing-questions">
      <h2 id="pricing-questions">Before we build.</h2>
      {faqs.map(([question, answer]) => <details className="comparison" key={question}><summary>{question}<Plus size={19}/></summary><p>{answer}</p></details>)}
      <Link className="button" href="/quote?package=unsure">Help me choose <ArrowUpRight size={18}/></Link>
    </section>
    </>
  );
}
