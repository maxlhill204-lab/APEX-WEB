import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SEO } from "@/components/SEO";
import { ServiceCard } from "@/components/ServiceCard";

const buildPackages = [
  {
    name: "Starter Site",
    eyebrow: "One-time build",
    price: "From $300",
    priceNote: "One-time cost to build the website.",
    description:
      "For new or small local businesses that need a clean, credible website customers can trust.",
    features: [
      "1-3 core pages",
      "Mobile responsive design",
      "Contact form or enquiry button",
      "Basic SEO page setup",
      "Launch-ready structure",
    ],
    cta: "Request Starter Quote",
  },
  {
    name: "Local Business Site",
    eyebrow: "One-time build",
    price: "From $550",
    priceNote: "One-time cost to build the website.",
    description:
      "For service businesses that need stronger pages, better presentation, and clearer enquiry pathways.",
    features: [
      "Up to 5 pages",
      "Custom design direction",
      "Service sections and trust content",
      "Enquiry form, call, email, and message links",
      "Review changes before launch",
    ],
    featured: true,
    cta: "Request Business Quote",
  },
  {
    name: "Growth Site",
    eyebrow: "One-time build",
    price: "From $850",
    priceNote: "One-time cost to build the website.",
    description:
      "For businesses that need more pages, sharper content, and extra features such as bookings or product sections.",
    features: [
      "Up to 8 pages",
      "More advanced layouts",
      "Booking, catalogue, or product sections",
      "Stronger SEO structure",
      "Launch support and handover",
    ],
    cta: "Request Growth Quote",
  },
];

const managementPlans = [
  {
    name: "Hosted",
    eyebrow: "Monthly management",
    price: "$39/mo",
    priceNote: "Optional monthly plan after the website is approved.",
    description:
      "For businesses that mainly want the website kept online and monitored without handling hosting setup themselves.",
    features: [
      "Website hosting",
      "Basic uptime checks",
      "Security and dependency checks",
      "Email support",
      "Best for simple websites",
    ],
    cta: "Ask About Hosting",
  },
  {
    name: "Managed",
    eyebrow: "Monthly management",
    price: "$79/mo",
    priceNote: "Optional monthly plan after the website is approved.",
    description:
      "For businesses that want hosting, maintenance, support, and occasional text or image changes handled for them.",
    features: [
      "Everything in Hosted",
      "Small text and image updates",
      "Maintenance and minor fixes",
      "Monthly support window",
      "Useful for active local businesses",
    ],
    featured: true,
    cta: "Ask About Managed",
  },
  {
    name: "Priority",
    eyebrow: "Monthly management",
    price: "$149/mo",
    priceNote: "Optional monthly plan after the website is approved.",
    description:
      "For businesses that expect regular changes, added pages, campaign updates, or faster support each month.",
    features: [
      "Everything in Managed",
      "Priority change requests",
      "Extra pages or feature improvements",
      "More active support",
      "Best for growing websites",
    ],
    cta: "Ask About Priority",
  },
];

const included = [
  "Responsive design for phones, tablets, and desktop",
  "Clear page structure built around your services and customers",
  "Contact, quote, booking, call, email, or message pathways",
  "Basic SEO foundations, readable content structure, and fast-loading setup",
  "Pre-launch review so you can request practical changes before approval",
];

const flow = [
  "Choose a one-time website build package.",
  "APEX WEB builds the website around your business.",
  "You review it and request changes before launch.",
  "Once approved, the build is complete.",
  "Choose optional monthly hosting and management if you want APEX WEB to look after it.",
  "Contact APEX WEB or request a quote to get started.",
];

const faqs = [
  {
    question: "Why is APEX WEB more affordable than many agencies?",
    answer:
      "The service is built around focused local-business websites instead of large agency overheads, long retainers, and oversized scopes. You get a practical custom build first, then only add monthly management if you want ongoing help.",
  },
  {
    question: "Are the build packages paid monthly?",
    answer:
      "No. The website build package is a one-time cost for designing and building the website. Monthly hosting and management is separate and optional after the site is approved.",
  },
  {
    question: "Why do prices say from?",
    answer:
      "The starting price covers a typical version of that package. The final quote depends on pages, content, features, integrations, and how much custom work is needed.",
  },
  {
    question: "Do I need a monthly plan?",
    answer:
      "Only if you want APEX WEB to host, maintain, update, and support the website for you. If you prefer to manage hosting yourself, the build can still be quoted separately.",
  },
  {
    question: "Can I start small and upgrade later?",
    answer:
      "Yes. Many local businesses should start with a simple website, then add extra pages, bookings, products, payments, or stronger SEO once the basics are working.",
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Packages & Pricing | APEX WEB"
        description="Affordable one-time website build packages and optional monthly hosting and management plans for local businesses that want agency-level polish without agency-level complexity."
      />
      <section className="section relative pt-36">
        <div className="container">
          <SectionHeader
            eyebrow="Packages and pricing"
            title="Simple website pricing for local businesses."
            description="Choose a one-time build package first. Prices are kept lean compared with traditional agency builds, then optional monthly hosting and management can be added after the website is approved."
          />
          <div className="mx-auto mb-10 grid max-w-4xl gap-4 md:grid-cols-2">
            <Reveal>
              <div className="luxury-border premium-card rounded-2xl p-6">
                <p className="eyebrow">A. One-time cost</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                  Build price
                </h2>
                <p className="mt-3 text-xl font-black text-gold">Paid once</p>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  This is the cost for APEX WEB to design and build the actual website, with practical pricing for small local-business budgets.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="luxury-border premium-card rounded-2xl p-6">
                <p className="eyebrow">B. Ongoing care</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-4xl">
                  Monthly plan
                </h2>
                <p className="mt-3 text-xl font-black text-gold">Optional after approval</p>
                <p className="mt-3 text-sm leading-6 text-neutral-400">
                  This covers hosting, maintenance, support, updates, and management after launch.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="text-center">
            <ButtonLink href="/contact">Get A Free Quote</ButtonLink>
          </div>
        </div>
        <a
          href="#build-packages"
          aria-label="Scroll down to compare packages"
          className="side-scroll-cue absolute bottom-5 right-4 z-10 grid h-14 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-cyan shadow-[0_16px_42px_rgba(0,0,0,0.34)] backdrop-blur transition hover:border-cyan/45 hover:bg-cyan/10 sm:bottom-8 sm:right-8"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </section>

      <section id="build-packages" className="section scroll-mt-24 bg-surface/40">
        <div className="container">
          <SectionHeader
            eyebrow="A. One-time website build packages"
            title="Pay once for the website build."
            description="These packages cover the design and development work needed to create the site. They are intentionally simpler and more accessible than many traditional agency quotes, and do not include optional monthly hosting or management."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {buildPackages.map((service, index) => (
              <ServiceCard key={service.name} {...service} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="B. Monthly hosting and management"
            title="Choose support only after the website is approved."
            description="Monthly plans keep the site online, maintained, updated, and supported. Pick the level that matches how actively you want APEX WEB to manage the website."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {managementPlans.map((plan, index) => (
              <ServiceCard key={plan.name} {...plan} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface/40">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">What every build includes</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white">
              A complete online foundation, not just a nicer-looking page.
            </h2>
            <p className="mt-5 leading-8 text-neutral-400">
              Each build is scoped to suit the business, but the essentials are planned from the start so visitors understand what you offer and how to contact you.
            </p>
            <div className="mt-7">
              <ButtonLink href="/contact" variant="secondary">
                Request A Website
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            {included.map((item) => (
              <div
                key={item}
                className="luxury-border premium-card flex gap-3 rounded-xl px-5 py-4 text-neutral-300"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-gold" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="How the pricing flow works"
            title="The build comes first. Management is a separate choice."
          />
          <div className="mx-auto grid max-w-4xl gap-3">
            {flow.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <div className="luxury-border premium-card flex items-center gap-4 rounded-2xl p-5">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-cyan/30 bg-cyan/10 text-sm font-black text-cyan">
                    {index + 1}
                  </span>
                  <p className="text-neutral-200">{item}</p>
                  {index < flow.length - 1 ? (
                    <ArrowRight className="ml-auto hidden h-5 w-5 flex-none text-neutral-600 sm:block" />
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface/40">
        <div className="container">
          <SectionHeader eyebrow="FAQ" title="Common pricing questions" />
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="luxury-border premium-card rounded-2xl p-6">
                <h3 className="text-xl font-black text-white">{faq.question}</h3>
                <p className="mt-3 leading-7 text-neutral-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA
        title="Want the right package for your business?"
        description="Send a short message with what you do, where you work, and what your website needs. APEX WEB will recommend a realistic build package and explain the optional monthly plans."
      />
    </>
  );
}
