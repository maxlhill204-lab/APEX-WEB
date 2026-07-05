import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";

type CTAProps = {
  title?: string;
  description?: string;
};

export function CTA({
  title = "Ready to start your website?",
  description = "Tell APEX WEB what your business does, what pages you need, and how customers should contact you. You will get a clear recommendation before anything is built.",
}: CTAProps) {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="mesh-bg premium-card overflow-hidden rounded-[28px] border border-white/10 px-6 py-16 text-center shadow-glow md:px-12 md:py-20">
            <p className="eyebrow">Free quote</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-200">
              {description}
            </p>
            <div className="mt-8">
              <ButtonLink href="/contact">Get A Free Quote</ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
