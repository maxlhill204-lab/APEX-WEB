import { AnimatedCounter } from "./AnimatedCounter";
import { Reveal } from "./Reveal";

type StatCardProps = {
  value: number | string;
  suffix: string;
  label: string;
  delay?: number;
};

export function StatCard({ value, suffix, label, delay = 0 }: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="luxury-border rounded-2xl p-8 text-center">
        <p className="text-5xl font-black md:text-6xl">
          {typeof value === "number" ? (
            <AnimatedCounter value={value} suffix={suffix} />
          ) : (
            <span className="gold-text">
              {value}
              {suffix}
            </span>
          )}
        </p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {label}
        </p>
      </div>
    </Reveal>
  );
}
