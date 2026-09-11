import { useRef, useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { packages } from "@/site.config";
import { PackageAtom } from "./PackageAtom";
import { QuoteWizard } from "./QuoteWizard";
export function PackageExperience() {
  const [selected, setSelected] = useState(1),
    [enquiry, setEnquiry] = useState(false);
  const form = useRef<HTMLDivElement>(null);
  const plan = packages[selected];
  return (
    <section
      className={`mission-packages selected-level-${selected}`}
      id="start"
    >
      <div className="mission-aura" aria-hidden="true" />
      <div className="mission-heading" id="packages">
        <span className="eyebrow">
          YOUR WEBSITE. YOUR LEVEL OF POSSIBILITY.
        </span>
        <h2>Let’s make it yours.</h2>
        <p>
          Start simple. Add interaction. Or build an entire experience.
          <br />
          Choose by complexity, with a one-off build price.
        </p>
      </div>
      <p className="package-instruction">
        Choose a package to explore what’s included{" "}
        <span aria-hidden="true">↓</span>
      </p>
      <div
        className="mission-selector"
        role="group"
        aria-label="Choose a website package"
      >
        {packages.map((p, i) => (
          <button
            key={p.id}
            className={i === selected ? "active" : ""}
            aria-pressed={i === selected}
            onClick={() => {
              setSelected(i);
              setEnquiry(false);
            }}
          >
            <span className="mission-number">
              0{i + 1} / {["ESSENTIAL", "INTERACTIVE", "CINEMATIC"][i]}
            </span>
            <strong>{p.name}</strong>
            <span className="mission-price">
              <small>from</small> ${p.price}
              <small>AUD · one-off</small>
            </span>
            <span className="selection-state">
              {i === selected ? "✓ Selected" : "Select package ↗"}
            </span>
            <span className="mission-meter">
              {Array.from({ length: 9 }, (_, j) => (
                <i key={j} className={j < (i + 1) * 3 ? "lit" : ""} />
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className={`mission-detail complexity-${selected}`}>
        <PackageAtom level={selected} />
        <div className="mission-spec" aria-live="polite">
          <span className="eyebrow">
            {
              [
                "THE ESSENTIALS, DONE WELL",
                "A LITTLE MORE INTERACTION",
                "THE FULL CINEMATIC EXPERIENCE",
              ][selected]
            }
          </span>
          <h3>{plan.description}</h3>
          <ul>
            {plan.features.map((f) => (
              <li key={f}>
                <Check size={15} />
                {f}
              </li>
            ))}
          </ul>
          <button
            className="button"
            onClick={() => {
              setEnquiry(true);
              setTimeout(
                () =>
                  form.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  }),
                50,
              );
            }}
          >
            Build my {plan.name.toLowerCase()} <ArrowUpRight size={18} />
          </button>
          <p className="mission-note">
            Final scope and price agreed before work begins. Hosting and
            third-party service fees are separate.
          </p>
        </div>
      </div>
      {enquiry && (
        <div className="mission-enquiry" ref={form}>
          <button className="text-link" onClick={() => setEnquiry(false)}>
            <X size={16} /> Close enquiry
          </button>
          <QuoteWizard
            key={plan.id}
            initialPackage={plan.id}
            attribution={{ source: "cinematic-package" }}
          />
        </div>
      )}
      <div className="mission-foot">
        <span>One build. Yours to keep.</span>
        <span>Ongoing care? That’s your choice. ↓</span>
      </div>
    </section>
  );
}
