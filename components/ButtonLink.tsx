import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  target?: string;
  rel?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
}: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "border-gold/70 bg-gold text-black shadow-[0_14px_45px_rgba(212,175,55,0.22)] hover:bg-[#f0d56c]"
      : "border-white/15 bg-white/[0.04] text-white hover:border-gold/50 hover:bg-white/[0.08]";

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`premium-button-shine group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${styles} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
