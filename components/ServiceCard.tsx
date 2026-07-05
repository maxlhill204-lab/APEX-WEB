import { Check } from "lucide-react";
import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";

type ServiceCardProps = {
  name: string;
  price: string;
  priceNote?: string;
  eyebrow?: string;
  description: string;
  features: string[];
  featured?: boolean;
  delay?: number;
  cta?: string;
};

export function ServiceCard({
  name,
  price,
  priceNote = "One-time website build price.",
  eyebrow,
  description,
  features,
  featured = false,
  delay = 0,
  cta = "Request Quote",
}: ServiceCardProps) {
  return (
    <Reveal delay={delay}>
      <div
        className={`luxury-border premium-card relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition duration-300 hover:-translate-y-1 ${
          featured ? "border-gold/45 shadow-glow" : ""
        }`}
      >
        {featured ? (
          <div className="absolute right-5 top-5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold">
            Popular
          </div>
        ) : null}
        {eyebrow ? <p className="eyebrow pr-24">{eyebrow}</p> : null}
        <h3 className={`${eyebrow ? "mt-3" : ""} text-2xl font-black text-white`}>{name}</h3>
        <p className="mt-3 leading-7 text-neutral-400">{description}</p>
        <p className="mt-7 text-4xl font-black text-white md:text-5xl">{price}</p>
        <p className="mt-2 text-sm text-neutral-500">
          {priceNote}
        </p>
        <div className="my-8 h-px bg-white/10" />
        <ul className="grid gap-4">
          {features.map((feature) => (
            <li key={feature} className="flex gap-3 text-neutral-300">
              <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-gold/15 text-gold">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <ButtonLink href="/contact" variant={featured ? "primary" : "secondary"} className="w-full">
            {cta}
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}
