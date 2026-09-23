import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CarePlans } from "./CarePlans";
import { PackageExperience } from "./PackageExperience";
import { carePlans, packages, site } from "@/site.config";
const RocketScene = dynamic(() => import("./RocketScene"), { ssr: false });
const clamp = (v: number) => Math.max(0, Math.min(1, v));
export function RocketExperience() {
  const root = useRef<HTMLElement>(null),
    progress = useRef(0);
  const [enabled, setEnabled] = useState(false),
    [nearby, setNearby] = useState(false),
    [selected, setSelected] = useState(0);
  const bucket = useRef(-1);
  const manuallySelected = useRef(false);
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
    const media = matchMedia("(prefers-reduced-motion: reduce), (max-width: 1023px), (max-height: 850px)");
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
        el.querySelectorAll<HTMLElement>("[data-phase],.launch-packages").forEach(node => { node.inert = false; });
        document.documentElement.classList.toggle(
          "paper-scene",
          el.getBoundingClientRect().top < 0,
        );
        return;
      }
      const r = el.getBoundingClientRect(),
        distance = Math.max(0, -r.top / innerHeight),
        travel = (r.height - innerHeight) / innerHeight,
        p = Math.max(-0.1, ((distance - 1.35) / (travel - 1.35)) * 0.8);
      progress.current = p;
      const nextBucket = Math.min(2, Math.floor(distance / 0.45));
      if (nextBucket !== bucket.current) {
        bucket.current = nextBucket;
        if (!manuallySelected.current) setSelected(nextBucket);
      }
      const launch = clamp((p - 0.045) / 0.115);
      el.style.setProperty("--launch", String(launch));
      const packages = el.querySelector<HTMLElement>(".launch-packages");
      if (packages) {
        packages.style.transform = `translateY(${launch * innerHeight * 1.2}px)`;
        packages.style.visibility = p < 0.18 ? "visible" : "hidden";
        packages.inert = p >= 0.02;
      }
      el.classList.toggle("launch-active", p >= 0);
      const renderer = el.querySelector<HTMLElement>(".rocket-renderer");
      if (renderer) renderer.style.opacity = String(1 - clamp((p - 0.68) / 0.12));
      document.documentElement.classList.toggle(
        "paper-scene",
        p > 0.42 && r.top < 0 && r.bottom > 0,
      );
      el.dataset.progress = p.toFixed(3);
      el.style.setProperty("--paper", String(clamp((p - 0.28) / 0.24)));
      el.querySelectorAll<HTMLElement>("[data-phase]").forEach((node, i) => {
        const intervals = [
            [0.11, 0.38],
            [0.4, 0.9],
          ],
          [a, b] = intervals[i];
        const alpha =
          clamp((p - a) / 0.07) * (1 - clamp((p - b + 0.06) / 0.06));
        if (i === 0) {
          node.style.opacity = String(clamp((p - 0.11) / 0.035));
          node.style.visibility = p > 0.11 && p < 0.43 ? "visible" : "hidden";
          const depart = clamp((p - 0.29) / 0.13);
          node.style.transform = `translateY(${depart * depart * innerHeight * 1.25}px)`;
          return;
        }
        node.style.opacity = String(alpha);
        node.style.visibility = alpha > 0.01 ? "visible" : "hidden";
        node.style.transform = `translateY(${(1 - clamp((p - a) / 0.07)) * 30}px)`;
        node.inert = alpha < 0.1;
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
    <>
    <section
      className={`rocket-journey ${enabled ? "" : "rocket-static"}`}
      ref={root}
      id="start"
      aria-label="Launch specifications and ongoing care"
    >
      <span id="packages" className="launch-anchor" aria-hidden="true" />
      <div className="rocket-sticky">
        <div className="rocket-paper" />
        <div className="launch-packages">
          <PackageExperience selected={selected} onSelect={(index) => { manuallySelected.current = true; setSelected(index); }} />
        </div>
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
                One booking or payment connection on Business. A scoped payment,
                database and email workflow on Growth.
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
      </div>
    </section>
    <CarePlans />
        <div className="rocket-finale finale-flow">
          <div className="finale-light" aria-hidden="true" />
          <div className="finale-invitation">
            <span className="eyebrow">A WEBSITE THAT’S YOURS</span>
            <h2><Link href="/quote">Let’s build<br />your next<br /><span>chapter. <i aria-hidden="true">↗</i></span></Link></h2>
            <p>A one-off build from ${packages[0].price} AUD.<br />Optional care from ${carePlans[0].price}/month or ${carePlans[0].annual}/year. Custom care quoted.</p>
            <Link className="finale-start" href="/quote">Start my project <span aria-hidden="true">↗</span></Link>
            <small>No payment today. A clear scope before we begin.</small>
          </div>
          <div className="mission-end">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>APEXWEB © {new Date().getFullYear()}</span>
            <Link href="/privacy">Privacy</Link>

            <Link href="/credits">Credits</Link>
          </div>
        </div>
    </>
  );
}
