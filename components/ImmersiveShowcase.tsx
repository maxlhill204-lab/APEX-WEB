import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  RotateCcw,
  RotateCw,
  Pause,
  Play,
  MoveUpRight,
  MousePointer2,
  Smartphone,
  MessageSquare,
} from "lucide-react";
const DeviceScene = dynamic(() => import("./DeviceScene"), { ssr: false });
const labels = [
  "Make an impression",
  "Make it interactive",
  "Make it effortless",
  "Make it count",
];
export function ImmersiveShowcase() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const rotation = useRef(0);
  const playing = useRef(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(m.matches);
    change();
    m.addEventListener("change", change);
    return () => m.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!section.current) return;
      const box = section.current.getBoundingClientRect();
      const distance = (box.height - innerHeight) / 3;
      const p = Math.max(0, Math.min(3, (-box.top + 88) / distance));
      progress.current = p;
      section.current.style.setProperty("--journey-progress", String(p / 3));
      const index = Math.min(3, Math.round(p));
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
      }
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const pause = () => {
    playing.current = !playing.current;
    setPaused(!playing.current);
  };
  return (
    <section
      ref={section}
      className={`immersive ${reduced ? "reduced-experience" : ""} ${paused ? "experience-paused" : ""}`}
      aria-label="Explore what your website could do"
    >
      <div className="experience-sticky">
        <div className="lightway lightway-one" />
        <div className="lightway lightway-two" />
        <div className="experience-grid" />
        <div className="scene-halo" />
        <div className="scene-overline">
          <span>APEXWEB / POSSIBILITIES IN MOTION</span>
          <span>DESIGNED TO BE EXPERIENCED</span>
        </div>
        <div
          className="device-stage"
          onPointerMove={(e) => {
            if (e.pointerType === "mouse" && e.buttons === 1)
              rotation.current += e.movementX * 0.006;
          }}
        >
          {!reduced && !failed && (
            <DeviceScene
              progress={progress}
              rotation={rotation}
              playing={playing}
              onReady={onReady}
              onFailure={onFailure}
            />
          )}
          <div
            className={`scene-fallback ${ready && !failed && !reduced ? "scene-fallback-hidden" : ""}`}
          >
            <Image
              src="/portfolio/carbon-screen.webp"
              width={1400}
              height={788}
              sizes="(max-width:800px) 90vw, 65vw"
              priority
              alt="Custom business website concept displayed inside the interactive product showcase"
            />
          </div>
          <div className="device-caption">
            <span className="tiny-cross">+</span>
            <span>
              CRAFTED FOR YOUR BUSINESS
              <br />
              <strong>Not another ordinary website.</strong>
            </span>
            <span className="tiny-cross">+</span>
          </div>
        </div>
        <div className="experience-bottom">
          <a href="#possibility-interactive" className="scroll-cue">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </a>
          <div className="scene-controls" aria-label="3D model controls">
            {!reduced && !failed && (
              <>
                <button
                  aria-label="Rotate model left"
                  onClick={() => {
                    rotation.current -= 0.4;
                  }}
                >
                  <RotateCcw size={16} />
                </button>
                <span>INTERACT WITH THE MODEL</span>
                <button
                  aria-label="Rotate model right"
                  onClick={() => {
                    rotation.current += 0.4;
                  }}
                >
                  <RotateCw size={16} />
                </button>
                <button
                  aria-label={
                    paused
                      ? "Play ambient animation"
                      : "Pause ambient animation"
                  }
                  onClick={pause}
                >
                  {paused ? <Play size={15} /> : <Pause size={15} />}
                </button>
              </>
            )}
          </div>
          <span className="chapter-counter">
            0{active + 1}
            <span> / 04</span>
          </span>
        </div>
        <div className="scene-progress">
          <i />
        </div>
      </div>
      <div className="experience-chapters container">
        <article
          className="experience-chapter opening-chapter"
          id="possibility-design"
        >
          <div>
            <p className="eyebrow">
              <span className="status-dot" /> CUSTOM WEBSITES. EXTRAORDINARY
              POSSIBILITIES.
            </p>
            <h1>
              Your business.
              <br />
              Beyond
              <br />
              <em>ordinary.</em>
            </h1>
            <p className="chapter-description">
              We build custom websites that make people stop, explore, and
              choose your business.
            </p>
            <div className="chapter-actions">
              <Link href="/quote" className="button">
                Build something exceptional <ArrowUpRight size={18} />
              </Link>
              <Link href="#packages" className="text-link">
                Explore packages <ArrowDown size={15} />
              </Link>
            </div>
            <p className="chapter-reassurance">
              From $300 AUD. No commitment. Built around you.
            </p>
          </div>
        </article>
        <article className="experience-chapter" id="possibility-interactive">
          <div>
            <p className="eyebrow">01 / AN EXPERIENCE, NOT JUST A PAGE</p>
            <div className="chapter-icon">
              <MousePointer2 size={23} />
            </div>
            <h2>
              Don’t just
              <br />
              look.
              <br />
              <em>Interact.</em>
            </h2>
            <p className="chapter-description">
              Products you can rotate. Details that respond. Thoughtful
              interactions that turn a quick glance into a closer look.
            </p>
            <div className="feature-pills">
              <span>3D product views</span>
              <span>Interactive galleries</span>
              <span>Subtle motion</span>
            </div>
            <p className="interaction-hint">
              Try it: drag the model, or use the rotation buttons.
            </p>
          </div>
        </article>
        <article className="experience-chapter" id="possibility-responsive">
          <div>
            <p className="eyebrow">02 / EVERY SCREEN. EVERY DETAIL.</p>
            <div className="chapter-icon">
              <Smartphone size={23} />
            </div>
            <h2>
              A big
              <br />
              impression.
              <br />
              <em>Any screen.</em>
            </h2>
            <p className="chapter-description">
              From the first tap on a phone to a closer look on a laptop. Your
              website should feel considered, wherever your customers find it.
            </p>
            <div className="feature-pills">
              <span>Phone</span>
              <span>Tablet</span>
              <span>Desktop</span>
            </div>
            <div className="chapter-proof">
              <span>ONE BUSINESS.</span>
              <strong>Every possibility.</strong>
              <MoveUpRight size={25} />
            </div>
          </div>
        </article>
        <article className="experience-chapter" id="possibility-conversion">
          <div>
            <p className="eyebrow">03 / DESIGN WITH A PURPOSE</p>
            <div className="chapter-icon">
              <MessageSquare size={23} />
            </div>
            <h2>
              From
              <br />
              “looks good”
              <br />
              <em>to “let’s talk”.</em>
            </h2>
            <p className="chapter-description">
              Make it easy to ask a question, book a service, or start a
              project. Every detail leads somewhere useful.
            </p>
            <div className="feature-pills">
              <span>Guided enquiries</span>
              <span>Booking integrations</span>
              <span>Clear next steps</span>
            </div>
            <Link href="/quote" className="text-link">
              Try our guided quote <ArrowUpRight size={18} />
            </Link>
            <p className="chapter-reassurance">
              Advanced features are scoped individually in your quote.
            </p>
          </div>
        </article>
      </div>
      <nav className="chapter-navigation" aria-label="Showcase chapters">
        {labels.map((l, i) => (
          <a
            key={l}
            href={`#${["possibility-design", "possibility-interactive", "possibility-responsive", "possibility-conversion"][i]}`}
            aria-label={`0${i + 1} ${l}`}
            aria-current={active === i ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            <i />
          </a>
        ))}
      </nav>
    </section>
  );
}
