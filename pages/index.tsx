import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  LayoutTemplate,
  Smartphone,
  MousePointer2,
  Plus,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { ImmersiveShowcase } from "@/components/ImmersiveShowcase";
import { Packages } from "@/components/Packages";
import { faqs, site } from "@/site.config";
import { track } from "@/lib/analytics";
export default function Home() {
  return (
    <>
      <SEO
        title="APEXWEB — Custom websites for better business"
        description="Custom websites that make your business look professional and make contacting you easy. Explore one-time builds from $300 AUD and request a no-obligation quote."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            url: site.url,
            email: site.email,
            sameAs: [site.instagram, site.facebook],
            description: "Custom website design for businesses.",
          }),
        }}
      />
      <ImmersiveShowcase />
      <div className="benefit-strip container">
        <span>
          Built to look right.
          <br />
          <strong>And work harder.</strong>
        </span>
        {[
          "Custom to your business",
          "Made for every screen",
          "A clear path to enquiry",
          "Support beyond launch",
        ].map((t) => (
          <p key={t}>
            <Check size={16} />
            {t}
          </p>
        ))}
      </div>
      <section className="section container" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — A LOOK AT WHAT’S POSSIBLE</p>
            <h2>
              Small details.
              <br />
              <span>Lasting impressions.</span>
            </h2>
          </div>
          <p>
            A website should feel like your business.
            <br />
            Explore these demo builds to see how design, content and a clear
            next step come together.
          </p>
        </div>
        <div className="work-grid">
          {[
            {
              slug: "carbon-monarch",
              title: "Carbon Monarch",
              type: "PRODUCT & LIFESTYLE",
              image: "carbon-monarch-thumbnail.png",
              description:
                "A bold product showcase with a considered path from discovery to enquiry.",
            },
            {
              slug: "vertexlab",
              title: "VertexLab",
              type: "ECOMMERCE & TECHNOLOGY",
              image: "vertexlab-thumbnail.png",
              description:
                "Clear categories, confident typography, and space for the products to speak.",
            },
          ].map((p, i) => (
            <Link
              href={`/concepts/${p.slug}`}
              className="work-card"
              key={p.slug}
            >
              <div className="work-image">
                <div className="work-badges">
                  <span>DEMO BUILD</span>
                  <span>
                    0{i + 1} <ArrowUpRight size={16} />
                  </span>
                </div>
                <Image
                  src={`/portfolio/${p.image}`}
                  alt={`${p.title} demo website preview`}
                  width={1864}
                  height={1049}
                  sizes="(max-width: 700px) 90vw, 45vw"
                />
              </div>
              <div className="work-caption">
                <div>
                  <span className="eyebrow">{p.type}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
                <ArrowUpRight size={24} />
              </div>
            </Link>
          ))}
        </div>
        <p className="fine-print">
          Demo builds shown to explore the possibilities. These are concepts,
          not client case studies.
        </p>
      </section>
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 — MORE THAN A GOOD-LOOKING WEBSITE</p>
              <h2>
                Make a strong impression.
                <br />
                <span>Make the next step easy.</span>
              </h2>
            </div>
            <Link className="text-link" href="/quote">
              Tell us what you need <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="services-grid">
            {[
              {
                Icon: LayoutTemplate,
                title: "Looks like your business.",
                text: "A custom design that presents your services clearly and gives people a reason to trust you.",
                detail: "Custom design · Clear content",
              },
              {
                Icon: Smartphone,
                title: "Works wherever they are.",
                text: "Easy-to-read pages and effortless navigation on phones, tablets and computers.",
                detail: "Every screen · Fast-loading pages",
              },
              {
                Icon: MousePointer2,
                title: "Turns interest into action.",
                text: "Contact forms, service pages and useful integrations that help customers take the next step.",
                detail: "Enquiries · Bookings · Social links",
              },
            ].map(({ Icon, title, text, detail }, i) => (
              <article key={title} className="service">
                <div className="service-icon">
                  <Icon size={27} strokeWidth={1.4} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Packages />
      <section className="process-section" id="process">
        <div className="container process-layout">
          <div>
            <p className="eyebrow">04 — NO GUESSWORK</p>
            <h2>
              From first hello
              <br />
              <span>to live website.</span>
            </h2>
            <p>
              You know what happens next.
              <br />
              We keep the process clear from the start.
            </p>
            <Link className="button button-outline" href="/quote">
              Take the first step <ArrowUpRight size={18} />
            </Link>
          </div>
          <ol className="process-list">
            {[
              [
                "Tell us about your business",
                "Choose a package or ask for guidance. Share what you do, what you need, and what you have in mind.",
              ],
              [
                "A clear plan. A clear quote.",
                "We agree on the pages, features, design direction, timing and final price before work starts.",
              ],
              [
                "We build. You review.",
                "Your website takes shape. You review it and share feedback before giving the go-ahead.",
              ],
              [
                "Go live with confidence.",
                "We launch the agreed website and help you understand your next steps. Optional ongoing care is your choice.",
              ],
            ].map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section container faq-layout" id="faq">
        <div>
          <p className="eyebrow">05 — GOOD QUESTIONS</p>
          <h2>
            A little clarity
            <br />
            <span>goes a long way.</span>
          </h2>
          <p>Still have something on your mind?</p>
          <a
            className="text-link"
            href={`mailto:${site.email}`}
            onClick={() => track("email_clicked")}
          >
            Ask us directly <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="contact-section container" id="contact">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <div className="contact-heading">
          <h2>
            Good business.
            <br />
            <span>Great website.</span>
          </h2>
          <Link
            className="round-cta"
            href="/quote"
            aria-label="Start your quote"
          >
            <ArrowUpRight size={56} strokeWidth={1} />
          </Link>
        </div>
        <div className="contact-bottom">
          <div>
            <Link className="button" href="/quote">
              Start your quote <ArrowUpRight size={18} />
            </Link>
            <p>No commitment. Just a conversation about what’s possible.</p>
          </div>
          <div className="contact-links">
            <a
              href={`mailto:${site.email}`}
              onClick={() => track("email_clicked")}
            >
              {site.email}
              <ArrowUpRight size={16} />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("instagram_clicked")}
            >
              @apexweb.au on Instagram
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
