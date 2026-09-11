import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { packages } from "@/site.config";
import { PackageAtom } from "./PackageAtom";
export function PackageExperience({selected, onSelect}: {selected: number; onSelect: (index: number) => void}) {
  const plan = packages[selected];
  return (
    <section
      className={`mission-packages selected-level-${selected}`}
    >
      <div className="mission-aura" aria-hidden="true" />
      <div className="mission-heading">
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
        Scroll to explore · or select a package{" "}
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
              onSelect(i);
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
          <Link className="button" href="/quote">
            Build my {plan.name.toLowerCase()} <ArrowUpRight size={18} />
          </Link>
          <p className="mission-note">
            Final scope and price agreed before work begins. Hosting and
            third-party service fees are separate.
          </p>
        </div>
      </div>
      <div className="mission-foot">
        <span>One build. Yours to keep.</span>
        <span>Ongoing care? That’s your choice. ↓</span>
      </div>
    </section>
  );
}
