import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";
export function BrowserPreview() {
  const frame = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  return (
    <div className="showcase">
      <div className="showcase-light" />
      <div className="showcase-top">
        <span>DESIGNED TO MAKE AN IMPRESSION</span>
        <span>01 / 02</span>
      </div>
      <div
        className={`browser-tilt ${mobile ? "is-mobile" : ""}`}
        ref={frame}
        onPointerMove={(e) => {
          if (
            e.pointerType !== "mouse" ||
            matchMedia("(prefers-reduced-motion: reduce)").matches ||
            !frame.current
          )
            return;
          const r = e.currentTarget.getBoundingClientRect();
          frame.current.style.setProperty(
            "--rx",
            `${(-(e.clientY - r.top - r.height / 2) / r.height) * 3}deg`,
          );
          frame.current.style.setProperty(
            "--ry",
            `${((e.clientX - r.left - r.width / 2) / r.width) * 3}deg`,
          );
        }}
        onPointerLeave={() => {
          frame.current?.style.setProperty("--rx", "0deg");
          frame.current?.style.setProperty("--ry", "0deg");
        }}
      >
        <div className="browser-bar">
          <div className="browser-dots">
            <i />
            <i />
            <i />
          </div>
          <span>carbonmonarch · concept website</span>
          <ArrowUpRight size={12} />
        </div>
        {mobile ? (
          <div className="mobile-concept">
            <span>CARBONMONARCH</span>
            <h3>
              Engineered
              <br />
              in Carbon.
            </h3>
            <p>A sharper way to carry the everyday.</p>
            <Image
              src="/portfolio/carbon-monarch-thumbnail.png"
              alt="Carbon Monarch product website concept"
              width={1864}
              height={1049}
              sizes="260px"
            />
            <Link href="/concepts/carbon-monarch">
              Explore the concept <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : (
          <Image
            className="hero-preview"
            src="/portfolio/carbon-monarch-thumbnail.png"
            alt="Carbon Monarch concept: a dark product website with clear product photography and navigation"
            width={1864}
            height={1049}
            sizes="(max-width: 800px) 90vw, 55vw"
            priority
          />
        )}
      </div>
      <div className="showcase-bottom">
        <span>
          <span className="status-dot" /> A concept. A glimpse of what’s
          possible.
        </span>
        <div className="device-switch" aria-label="Preview size">
          <button
            aria-label="Desktop preview"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            <Monitor size={17} />
          </button>
          <button
            aria-label="Mobile concept preview"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            <Smartphone size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
