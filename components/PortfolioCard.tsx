import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Reveal } from "./Reveal";

type PortfolioCardProps = {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  url: string;
  delay?: number;
  category: string;
};

export function PortfolioCard({
  title,
  description,
  image,
  technologies,
  url,
  delay = 0,
  category,
}: PortfolioCardProps) {
  return (
    <Reveal delay={delay}>
      <article className="luxury-border premium-card group h-full overflow-hidden rounded-[20px] transition duration-300 hover:-translate-y-1 hover:border-gold/45">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open the ${title} demo website`}
          className="relative block aspect-[16/9] overflow-hidden bg-surface2"
        >
          <Image
            src={image}
            alt={`${title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/68 via-transparent to-transparent" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
            Open demo <ExternalLink className="h-4 w-4" />
          </span>
        </a>
        <div className="p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="eyebrow">{category}</p>
              <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
                {title}
              </h3>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open the ${title} demo website`}
              className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/55 bg-gold text-black shadow-[0_12px_34px_rgba(212,175,55,0.2)] transition duration-300 hover:bg-[#f0d56c]"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-base leading-7 text-neutral-300">{description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
