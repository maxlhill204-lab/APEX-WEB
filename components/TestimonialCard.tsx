import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
  delay?: number;
};

export function TestimonialCard({
  quote,
  name,
  role,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <Reveal delay={delay}>
      <article className="luxury-border h-full rounded-2xl p-7">
        <div className="flex items-center justify-between gap-4">
          <Quote className="h-8 w-8 text-gold" />
          <div className="flex gap-1 text-gold" aria-label="5 star review">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        <p className="mt-7 leading-8 text-neutral-300">&quot;{quote}&quot;</p>
        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="font-bold text-white">{name}</p>
          <p className="mt-1 text-sm text-neutral-500">{role}</p>
        </div>
      </article>
    </Reveal>
  );
}
