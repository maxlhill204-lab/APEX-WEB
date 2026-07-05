import { Award, BadgeCheck, MonitorSmartphone, ShieldCheck, Zap } from "lucide-react";
import { CTA } from "@/components/CTA";
import { FeatureCard } from "@/components/FeatureCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SEO } from "@/components/SEO";

const values = [
  {
    icon: Award,
    title: "Clear work",
    description:
      "Every page has a job: explain the business, build trust, and guide customers toward a real enquiry.",
  },
  {
    icon: BadgeCheck,
    title: "Straight pricing",
    description:
      "Build costs and monthly management costs stay separate, so you know what you are paying for.",
  },
  {
    icon: ShieldCheck,
    title: "Practical support",
    description:
      "After launch, optional monthly plans keep the website hosted, updated, maintained, and easier to improve.",
  },
];

export default function About() {
  return (
    <>
      <SEO
        title="About | APEX WEB"
        description="APEX WEB builds modern websites for local businesses with simple one-time pricing and optional monthly hosting and management."
      />
      <section className="section pt-36">
        <div className="container">
          <SectionHeader
            eyebrow="About"
            title="Modern websites for small businesses that want to look trusted online."
            description="APEX WEB builds custom websites for local businesses that need a better first impression, clearer service pages, and an easier way for customers to contact them without dealing with technical setup."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal>
              <div className="luxury-border premium-card h-full rounded-2xl p-7">
                <MonitorSmartphone className="h-9 w-9 text-gold" />
                <h2 className="mt-6 text-2xl font-black text-white">Professional Design</h2>
                <p className="mt-4 leading-7 text-neutral-400">
                  Clean layouts, strong typography, and polished presentation
                  designed to make your business feel credible from the first visit.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="luxury-border premium-card h-full rounded-2xl p-7">
                <Zap className="h-9 w-9 text-gold" />
                <h2 className="mt-6 text-2xl font-black text-white">Simple Setup</h2>
                <p className="mt-4 leading-7 text-neutral-400">
                  The build is handled for you, then monthly hosting and
                  management can be added only if you want ongoing help.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="luxury-border premium-card h-full rounded-2xl p-7">
                <ShieldCheck className="h-9 w-9 text-gold" />
                <h2 className="mt-6 text-2xl font-black text-white">Trust Focused</h2>
                <p className="mt-4 leading-7 text-neutral-400">
                  Every section is structured to help visitors understand your
                  offer, trust your business, and know what to do next.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Values"
            title="The standards behind every build."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value, index) => (
              <FeatureCard key={value.title} {...value} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>
      <CTA
        title="Want a website that is clear, modern, and easy to manage?"
        description="Send the basics about your business and APEX WEB will recommend a practical build package with optional monthly support explained separately."
      />
    </>
  );
}
