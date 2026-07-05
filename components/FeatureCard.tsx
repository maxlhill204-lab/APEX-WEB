import type { LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="luxury-border premium-card group h-full rounded-2xl p-7 transition duration-300 hover:-translate-y-2 hover:border-gold/35">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold transition duration-300 group-hover:bg-gold group-hover:text-black">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-7 text-2xl font-black text-white">{title}</h3>
        <p className="mt-4 leading-7 text-neutral-400">{description}</p>
      </div>
    </Reveal>
  );
}
