import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  ClipboardCheck,
  CreditCard,
  Headphones,
  LayoutTemplate,
  MonitorSmartphone,
  MousePointerClick,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { CTA } from "@/components/CTA";
import { FeatureCard } from "@/components/FeatureCard";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SEO } from "@/components/SEO";

const features = [
  {
    icon: LayoutTemplate,
    title: "Custom website builds",
    description:
      "One-time website builds for local businesses that need a sharper online presence, clearer pages, and a simple way for customers to enquire.",
  },
  {
    icon: MonitorSmartphone,
    title: "Made for every screen",
    description:
      "Your website is designed to feel polished on phones, tablets, and desktop, because most local customers check you from a mobile first.",
  },
  {
    icon: MousePointerClick,
    title: "Clear calls to action",
    description:
      "Every page guides people toward the next step, whether that is calling, requesting a quote, booking, messaging, or viewing your services.",
  },
];

const businessReasons = [
  {
    icon: BadgeCheck,
    title: "Simple build pricing",
    description:
      "Package prices are kept lean for local-business budgets and shown as the one-time cost to design and build the website. No confusing bundle where the setup fee and monthly fee are mixed together.",
  },
  {
    icon: CreditCard,
    title: "Optional monthly management",
    description:
      "After the website is approved, you can add monthly hosting, updates, small edits, support, and maintenance if you want APEX WEB to look after it.",
  },
  {
    icon: Search,
    title: "Trust and local visibility",
    description:
      "The site is structured so customers can understand what you do, where you work, why they should trust you, and how to contact you quickly.",
  },
  {
    icon: Headphones,
    title: "Support that matches the plan",
    description:
      "Higher monthly plans include more active support, faster changes, and extra room for pages, features, or improvements over time.",
  },
];

const pricingModel = [
  {
    icon: ClipboardCheck,
    title: "One-time website build",
    price: "From $300",
    description:
      "You pay once for the actual design and development of the website. Pricing is intentionally lighter than traditional agency builds, with the final quote based on pages, content, features, and complexity.",
  },
  {
    icon: Sparkles,
    title: "Monthly hosting and care",
    price: "From $39/mo",
    description:
      "After approval, choose an optional monthly plan if you want hosting, maintenance, updates, small changes, and support handled for you.",
  },
];

export default function Home() {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const markInteracted = () => setHasInteracted(true);
    const events = ["pointerdown", "keydown", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, markInteracted, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, markInteracted);
      });
    };
  }, []);

  return (
    <>
      <SEO
        title="APEX WEB | Custom Websites For Local Businesses"
        description="Custom website builds for local businesses with simple one-time build pricing and optional monthly hosting, maintenance, and support."
      />
      <section className="relative overflow-hidden pb-16 pt-28 md:pt-32">
        <div className="absolute inset-0 -z-20 mesh-bg opacity-90" />
        <div className="absolute inset-0 -z-10 hero-grid opacity-70" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(7,8,13,0.12),#07080d_90%)]" />
        <div className="container grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr]">
          <Reveal>
            <div>
              <p className="eyebrow">Custom websites for local businesses</p>
              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.98] text-white md:text-6xl lg:text-6xl 2xl:text-7xl">
                A modern website built for your business,{" "}
                <span className="gold-text">without the technical stress.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300 md:text-xl">
                APEX WEB designs and builds professional websites for barbers,
                tradies, cleaners, mechanics, cafes, and service businesses that
                need to look trusted online and make enquiries easier.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-neutral-200">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  One-time builds from $300
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  Leaner than traditional agency pricing
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  Optional hosting from $39/mo
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                  Review changes before launch
                </span>
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <ButtonLink href="/contact" className="cta-glow-quote">
                  Get A Free Quote
                </ButtonLink>
                <ButtonLink href="/services" variant="secondary" className="cta-glow-demo">
                  View Packages
                </ButtonLink>
                <ButtonLink
                  href="/portfolio"
                  variant="secondary"
                  className={hasInteracted ? "" : "cta-contact-nudge"}
                >
                  View Demo Sites
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <motion.div
              className="relative mx-auto w-full max-w-xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="luxury-border premium-card overflow-hidden rounded-[28px] p-3 shadow-glow">
                <div className="rounded-[20px] border border-white/10 bg-ink/90">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-400" />
                      <span className="h-3 w-3 rounded-full bg-yellow-300" />
                      <span className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan">
                      Build preview
                    </span>
                  </div>
                  <div className="space-y-5 p-6">
                    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(79,140,255,0.16),rgba(214,181,90,0.09)),url('/portfolio/carbon-monarch-thumbnail.png')] bg-cover bg-center p-5">
                      <div className="max-w-xs rounded-2xl border border-white/10 bg-ink/75 p-5 backdrop-blur">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                          Local service website
                        </p>
                        <p className="mt-3 text-2xl font-black text-white">
                          Clear offer. Clean pages. Easy enquiries.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Build", "Review", "Manage"].map((item, index) => (
                        <div
                          key={item}
                          className="rounded-xl border border-white/10 bg-white/[0.045] p-4"
                        >
                          <span className="text-xs font-bold text-cyan">0{index + 1}</span>
                          <p className="mt-2 font-black text-white">{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-3 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-neutral-200">
                      <p className="font-bold text-white">Pricing stays separate</p>
                      <p>Website build is paid once. Hosting and management is monthly only if you choose it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
        <a
          href="#what-apex-web-does"
          aria-label="Scroll down to see more"
          className="side-scroll-cue absolute bottom-5 right-4 z-10 grid h-14 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-cyan shadow-[0_16px_42px_rgba(0,0,0,0.34)] backdrop-blur transition hover:border-cyan/45 hover:bg-cyan/10 sm:bottom-8 sm:right-8"
        >
          <ChevronDown className="h-5 w-5" />
        </a>
      </section>

      <section id="what-apex-web-does" className="section scroll-mt-24">
        <div className="container">
          <SectionHeader
            eyebrow="What APEX WEB does"
            title="Professional websites that make your business easier to trust."
            description="The goal is simple: help customers understand your business quickly, feel confident contacting you, and avoid the hassle of setting up a website yourself."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface/40">
        <div className="container">
          <SectionHeader
            eyebrow="Simple pricing model"
            title="Pay once to build. Pay monthly only if you want it managed."
            description="Build packages cover the website creation and are priced for small local businesses, not big-company agency budgets. Monthly plans are separate and optional, covering hosting, maintenance, small updates, and support after launch."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {pricingModel.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="luxury-border premium-card h-full rounded-2xl p-7">
                    <div className="grid h-12 w-12 place-items-center rounded-full border border-cyan/30 bg-cyan/10 text-cyan">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-2xl font-black text-white">{item.title}</h3>
                    <p className="mt-4 text-4xl font-black text-white">{item.price}</p>
                    <p className="mt-4 leading-7 text-neutral-400">{item.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/services" variant="secondary">
              Compare Packages
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="How it works"
            title="A clear path from package to launch."
            description="You choose the build level first. After the website is approved, you can decide whether you want APEX WEB to host and manage it each month."
          />
          <ProcessTimeline />
          <div className="mt-12 text-center">
            <ButtonLink href="/contact">Start Your Website</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section bg-surface/40">
        <div className="container">
          <SectionHeader
            eyebrow="Why it matters"
            title="Built for real local businesses, not vague agency theatre."
            description="Your website should explain what you do, make your business feel credible, and give customers a direct way to take action."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {businessReasons.map((reason, index) => (
              <FeatureCard key={reason.title} {...reason} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to get a website your customers can trust?"
        description="Send a few details about your business and APEX WEB will recommend a practical build package, explain the monthly options, and give you a clear next step."
      />
    </>
  );
}
