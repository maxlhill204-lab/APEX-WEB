import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
const DeviceScene = dynamic(() => import("./DeviceScene"), { ssr: false });
const chapters = [
  {
    start: 2.1,
    end: 3.65,
    title: "Built here.\nConnected everywhere.",
    copy: "Based in Victoria. Make it easy for customers, wherever they are, to discover your business and get in touch.",
    name: "reach",
  },
  {
    start: 3.9,
    end: 5.05,
    title: "Your brand.\nYour design.",
    copy: "Choose the colours, typography, layouts and interactions. We design around your business, not a fixed template.",
    name: "mars",
  },
  {
    start: 5.15,
    end: 6.3,
    title: "Make every\nscroll count.",
    copy: "Interactive 3D, product reveals and cinematic transitions. A custom experience that shows what you do.",
    name: "jupiter",
  },
  {
    start: 6.4,
    end: 7.55,
    title: "Looks incredible.\nWorks for you.",
    copy: "Take Stripe payments. Connect your database. Collect enquiries and send newsletters. Choose the tools you actually need.",
    name: "neptune",
  },
  {
    start: 8.7,
    end: 10.25,
    title: "You approve it.\nWe launch it.",
    copy: "We handle the domain, hosting and launch checks. Review your private preview, approve the website, and we take it live.",
    name: "launch",
  },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function ImmersiveShowcase() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0),
    rotation = useRef(0);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [reduced, setReduced] = useState(true);
  const onReady = useCallback(() => setReady(true), []),
    onFailure = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    if (reduced || failed) {
      root
        .querySelectorAll<HTMLElement>(
          ".cinema-opening,.cinema-copy,.cinema-stage",
        )
        .forEach((el) => {
          el.style.opacity = "";
          el.style.transform = "";
          el.style.visibility = "";
          el.style.filter = "";
        });
      const handoff = document.getElementById("screen-handoff");
      if (handoff) {
        handoff.style.opacity = "";
        handoff.style.visibility = "";
        handoff.style.transform = "";
      }
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const p = clamp(-rect.top / (rect.height - innerHeight)) * 11;
      progress.current = p;
      root.dataset.progress = p.toFixed(2);
      const intro = root.querySelector<HTMLElement>(".cinema-opening");
      if (intro) {
        intro.style.opacity = String(1 - clamp((p - 0.35) / 0.75));
        intro.style.transform = `translateY(${-p * 10}vh)`;
        intro.style.visibility = p > 1.1 ? "hidden" : "visible";
      }
      root
        .querySelectorAll<HTMLElement>(".cinema-copy")
        .forEach((el, index) => {
          const c = chapters[index],
            enter = clamp((p - c.start) / 0.22),
            leave = clamp((p - c.end + 0.3) / 0.3);
          el.style.opacity = String(enter * (1 - leave));
          el.style.visibility = enter * (1 - leave) > 0 ? "visible" : "hidden";
          el.style.transform = `translate3d(${index === 4 ? -leave * 45 : 0}vw,${(1 - enter) * 50 - leave * 90}px,0)`;
        });
      const curtain = root.querySelector<HTMLElement>(".cinema-curtain");
      if (curtain)
        curtain.style.opacity = String(
          p < 8.3 ? clamp((p - 7.98) / 0.32) : 1 - clamp((p - 8.3) / 0.5),
        );
      const handoff = document.getElementById("screen-handoff");
      if (handoff) {
        const top = root.offsetTop + root.offsetHeight - innerHeight - scrollY;
        handoff.style.transform = `translateY(${-Math.max(0, top)}px)`;
        handoff.style.pointerEvents = p >= 10.99 ? "auto" : "none";
        handoff.style.visibility = p >= 8.3 ? "visible" : "hidden";
      }
      const stage = root.querySelector<HTMLElement>(".cinema-stage");
      if (stage)
        stage.style.filter = `blur(${p > 1.1 && p < 2 ? clamp((p - 1.1) / 0.9) * 9 : 0}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [reduced, failed]);
  const staticMode = reduced || failed;
  return (
    <section
      ref={section}
      className={`cinema ${staticMode ? "cinema-static" : ""} ${ready ? "cinema-ready" : ""}`}
      aria-label="A website with a world of possibilities"
    >
      <div className="cinema-sticky">
        <picture className="cinema-poster">
          <source
            media="(max-width:699px)"
            srcSet="/cinematic/opening-mobile-poster.webp"
          />
          <Image
            src="/cinematic/opening-poster.webp"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="cinema-stage">
          {!staticMode && (
            <DeviceScene
              progress={progress}
              rotation={rotation}
              onReady={onReady}
              onFailure={onFailure}
            />
          )}
        </div>
        <div className="cinema-curtain" aria-hidden="true" />
        <div className="cinema-opening">
          <h1>
            Open up
            <br />
            possibility.
          </h1>
          <h2>
            Custom websites.
            <br />
            Out of this world.
          </h2>
          <p>
            Custom websites.
            <br />
            Designed around your business.
          </p>
        </div>
        {chapters.map((c) => (
          <div
            className={`cinema-copy cinema-${c.name}`}
            style={
              staticMode
                ? {
                    backgroundImage: `linear-gradient(90deg,#02060e 0%,#02060e99 40%,transparent),url(/cinematic/${c.name}-poster.webp)`,
                  }
                : undefined
            }
            key={c.name}
          >
            <span className="chapter-index">
              {String(chapters.indexOf(c) + 1).padStart(2, "0")} /{" "}
              {c.name === "reach"
                ? "VICTORIA → THE WORLD"
                : c.name === "launch"
                  ? "FROM PREVIEW TO PRODUCTION"
                  : "A WORLD OF POSSIBILITIES"}
            </span>
            <h2>{c.title}</h2>
            <p>{c.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
