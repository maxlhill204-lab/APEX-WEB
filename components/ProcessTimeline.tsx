import { Reveal } from "./Reveal";

const steps = [
  {
    step: "01",
    title: "Choose a build package",
    text: "Pick the website level that fits your business now. If you are unsure, send a quote request and APEX WEB will recommend the simplest sensible scope.",
  },
  {
    step: "02",
    title: "Your website gets built",
    text: "The site is designed and developed around your services, location, brand, photos, contact options, and the actions you want customers to take.",
  },
  {
    step: "03",
    title: "Review and request changes",
    text: "You check the website before launch and request practical edits to wording, layout, images, pages, or calls to action.",
  },
  {
    step: "04",
    title: "Approve the final build",
    text: "Once the website is approved, the one-time build is complete and ready to launch for your business.",
  },
  {
    step: "05",
    title: "Choose monthly management",
    text: "If you want APEX WEB to host, maintain, update, and support the website, choose an optional monthly plan after the build.",
  },
  {
    step: "06",
    title: "Go live and keep improving",
    text: "Your website goes online with a clear support level. Higher monthly plans include faster changes, more support, and room for added features.",
  },
];

export function ProcessTimeline() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-gold via-cyan/45 to-blue md:left-1/2 md:block" />
      <div className="grid gap-8">
        {steps.map((item, index) => {
          const even = index % 2 === 0;
          return (
            <Reveal key={item.title} delay={index * 0.08}>
              <div
                className={`relative grid items-center gap-6 md:grid-cols-2 ${
                  even ? "" : "md:[&>div:first-child]:col-start-2"
                }`}
              >
                <div className={even ? "md:pr-12" : "md:pl-12"}>
                  <div className="luxury-border premium-card rounded-2xl p-7">
                    <p className="eyebrow">{item.step}</p>
                    <h3 className="mt-3 text-2xl font-black text-white">
                      {item.title}
                    </h3>
                    <p className="mt-4 leading-7 text-neutral-400">{item.text}</p>
                  </div>
                </div>
                <div
                  className={`absolute left-6 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-ink bg-gold shadow-[0_0_30px_rgba(212,175,55,0.65)] md:left-1/2 md:block`}
                />
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
