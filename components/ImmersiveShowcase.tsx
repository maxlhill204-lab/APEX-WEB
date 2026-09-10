import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
const DeviceScene = dynamic(() => import("./DeviceScene"), { ssr: false });
const chapters = [
  {
    start: 2.1,
    end: 3.65,
    title: "Closer to a\nworld of people.",
    copy: "Turn a local business into an online destination.",
    name: "reach",
  },
  {
    start: 3.9,
    end: 5.05,
    title: "Unmistakably\nbold.",
    copy: "For businesses that were never meant to blend in.",
    name: "mars",
  },
  {
    start: 5.15,
    end: 6.3,
    title: "Quietly\nextraordinary.",
    copy: "Considered design. A presence that speaks for itself.",
    name: "jupiter",
  },
  {
    start: 6.4,
    end: 7.55,
    title: "Entirely\nyour own.",
    copy: "Your personality, in every colour and every detail.",
    name: "neptune",
  },
  {
    start: 8.7,
    end: 10.25,
    title: "Your idea.\nOut in the world.",
    copy: "From the first conversation to the moment you go live.",
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
        intro.style.transform = `translateY(${-p * 38}vh)`;
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
      if (curtain) curtain.style.opacity = String(clamp((p - 10.4) / 0.45));
      const stage = root.querySelector<HTMLElement>(".cinema-stage");
      if (stage)
        stage.style.filter = `blur(${p > 1.6 && p < 2 ? Math.sin(((p - 1.6) / 0.4) * Math.PI) * 2 : 0}px)`;
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
            A small beginning.
            <br />
            An extraordinary future.
          </h2>
          <p>
            Custom websites.
            <br />
            Made for your next chapter.
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
            <h2>{c.title}</h2>
            <p>{c.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
