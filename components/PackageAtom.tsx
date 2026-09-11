import type { CSSProperties } from "react";
export function PackageAtom({
  level,
  compact = false,
}: {
  level: number;
  compact?: boolean;
}) {
  if (level >= 3) return (
    <div className={`mission-art decision-art ${compact ? "atom-compact" : ""}`} aria-hidden="true">
      <div className="atom-halo" />
      {level === 3 ? <div className="custom-constellation">
        <span className="custom-core">✦</span>
        {Array.from({length: 6}, (_, i) => <i key={i} style={{"--tile": i} as CSSProperties} />)}
        <span className="decision-caption">BUILT BEYOND THE TEMPLATE</span>
      </div> : <div className="choice-compass">
        <div className="compass-sweep" />
        <span className="compass-core">✧</span>
        <i className="compass-choice choice-a">01</i>
        <i className="compass-choice choice-b">02</i>
        <i className="compass-choice choice-c">03</i>
        <span className="decision-caption">LET’S FIND YOUR DIRECTION</span>
      </div>}
      <div className="atom-reflection" />
    </div>
  );
  return (
    <div
      className={`mission-art atom-level-${level} ${compact ? "atom-compact" : ""}`}
      aria-hidden="true"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--atom-x",
          `${((e.clientX - r.left) / r.width - 0.5) * 20}deg`,
        );
        e.currentTarget.style.setProperty(
          "--atom-y",
          `${((e.clientY - r.top) / r.height - 0.5) * -20}deg`,
        );
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--atom-x", "0deg");
        e.currentTarget.style.setProperty("--atom-y", "0deg");
      }}
    >
      <div className="atom-halo" />
      <div className="atom-field">
        <div className="mission-orbit orbit-one">
          <i />
        </div>
        <div className="mission-orbit orbit-two">
          <i />
        </div>
        <div className="mission-orbit orbit-three">
          <i />
        </div>
        <div className="mission-core">
          A<span>0{level + 1}</span>
        </div>
        <div className="atom-particles">
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  "--angle": `${i * 137.5}deg`,
                  "--radius": `${95 + (i % 5) * 24}px`,
                  "--delay": `${-i * 0.4}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="atom-reflection" />
      <span className="mission-coordinate">
        {
          [
            "A SIMPLE START",
            "MORE WAYS TO CONNECT",
            "A WORLD OF POSSIBILITIES",
          ][level]
        }
      </span>
    </div>
  );
}
