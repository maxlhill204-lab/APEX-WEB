import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { carePlans, site } from "@/site.config";
const RocketScene = dynamic(() => import("./RocketScene"), { ssr: false });
const clamp = (v: number) => Math.max(0, Math.min(1, v));
export function RocketExperience() {
  const root = useRef<HTMLElement>(null),
    progress = useRef(0);
  const [enabled, setEnabled] = useState(false),
    [yearly, setYearly] = useState(true),
    [nearby, setNearby] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNearby(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setEnabled(!media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!enabled) {
        document.documentElement.classList.toggle(
          "paper-scene",
          el.getBoundingClientRect().top < 0,
        );
        return;
      }
      const r = el.getBoundingClientRect(),
        p = clamp(-r.top / (r.height - innerHeight));
      progress.current = p;
      document.documentElement.classList.toggle(
        "paper-scene",
        p > 0.42 && r.top < 0 && r.bottom > 0,
      );
      el.dataset.progress = p.toFixed(3);
      el.style.setProperty("--paper", String(clamp((p - 0.28) / 0.24)));
      el.querySelectorAll<HTMLElement>("[data-phase]").forEach((node, i) => {
        const intervals = [
            [0.02, 0.3],
            [0.4, 0.68],
            [0.73, 1.2],
          ],
          [a, b] = intervals[i];
        const alpha =
          clamp((p - a) / 0.07) * (1 - clamp((p - b + 0.06) / 0.06));
        if (i === 0) {
          node.style.opacity = String(clamp((p - 0.02) / 0.07));
          node.style.visibility = p > 0.02 && p < 0.45 ? "visible" : "hidden";
          node.style.transform = `translateY(${Math.max(0, p - 0.1) * innerHeight * 4.7}px)`;
          return;
        }
        node.style.opacity = String(alpha);
        node.style.visibility = alpha > 0.01 ? "visible" : "hidden";
        node.style.transform = `translateY(${(1 - clamp((p - a) / 0.07)) * 30}px)`;
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      document.documentElement.classList.remove("paper-scene");
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [enabled]);
  return (
    <section
      className={`rocket-journey ${enabled ? "" : "rocket-static"}`}
      ref={root}
      aria-label="Launch specifications and ongoing care"
    >
      <div className="rocket-sticky">
        <div className="rocket-paper" />
        {enabled && nearby && <RocketScene progress={progress} />}
        <div className="rocket-flight" data-phase>
          <span className="eyebrow">BUILT FOR WHAT COMES NEXT</span>
          <h2>
            A launch.
            <br />
            Not a limit.
          </h2>
          <p>
            Your website can grow with your business.
            <br />
            Here’s what goes into the build.
          </p>
        </div>
        <div className="rocket-specifications" data-phase id="services">
          <div className="rocket-spec-heading">
            <span className="eyebrow">APEX / SYSTEM SPECIFICATION 01</span>
            <h2>
              Every part.
              <br />A purpose.
            </h2>
          </div>
          <div className="spec-left">
            <article>
              <span>01 / DESIGN</span>
              <h3>Made to fit.</h3>
              <p>
                Your colours, type and content. Responsive layouts for every
                screen.
              </p>
            </article>
            <article>
              <span>02 / INTERACTION</span>
              <h3>Choose the motion.</h3>
              <p>
                From simple pages to full 3D. The right level of animation for
                your package.
              </p>
            </article>
          </div>
          <div className="spec-right">
            <article>
              <span>03 / CONNECTIONS</span>
              <h3>Useful integrations.</h3>
              <p>
                Stripe on Business and Growth. Database, email and newsletters
                on Growth, scoped to your workflow.
              </p>
            </article>
            <article>
              <span>04 / OWNERSHIP</span>
              <h3>Your business. Your data.</h3>
              <p>
                Client-owned accounts, appropriate dashboard access and an
                agreed handover. No shared customer databases.
              </p>
            </article>
          </div>
          <span className="schematic-foot">
            DESIGN → BUILD → REVIEW → LAUNCH
          </span>
        </div>
        <div
          className="rocket-care"
          data-phase
          role="region"
          aria-label="Hosting plans and contact details"
          tabIndex={0}
        >
          <span className="eyebrow">KEEP YOUR WEBSITE IN GOOD HANDS</span>
          <h2>
            Built once.
            <br />
            Looked after.
          </h2>
          <p>
            Optional hosting and maintenance, matched to the features we manage.
          </p>
          <div
            className="billing-toggle"
            role="group"
            aria-label="Hosting billing period"
          >
            <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
              Monthly
            </button>
            <button aria-pressed={yearly} onClick={() => setYearly(true)}>
              Yearly <span>Save 25%</span>
            </button>
          </div>
          <div className="rocket-care-plans">
            {carePlans.map((c) => (
              <Link
                key={c.id}
                href={`/quote?care=${c.id}&billing=${yearly ? "yearly" : "monthly"}`}
              >
                <span>{c.name}</span>
                <strong>
                  ${yearly ? c.annual.toLocaleString("en-AU") : c.price}
                  <small>/{yearly ? "year" : "month"}</small>
                </strong>
                <span>
                  {yearly
                    ? `$${(c.annual / 12).toFixed(2)}/mo equivalent · paid annually`
                    : "Billed monthly"}
                </span>
                <p>{c.description}</p>
              </Link>
            ))}
          </div>
          <p className="care-scope">
            AUD. Annual billing is 25% less than twelve monthly payments.
            Domains, provider usage and transaction fees are separate. Update
            allowances and supported integrations are agreed in your quote.
          </p>
          <Link className="button" href="/quote">
            Let’s build your next chapter ↗
          </Link>
          <div className="mission-end">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>APEXWEB © {new Date().getFullYear()}</span>
            <Link href="/privacy">Privacy</Link>

            <Link href="/credits">Credits</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
