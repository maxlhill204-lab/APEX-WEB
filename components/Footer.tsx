import Link from "next/link";
import { Mail } from "lucide-react";
import { FacebookIcon } from "./FacebookIcon";
import { InstagramIcon } from "./InstagramIcon";
import { Logo } from "./Logo";

const footerLinks = [
  { href: "/services", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/70">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Link href="/" className="flex items-center" aria-label="APEX WEB home">
            <Logo className="h-auto w-[176px]" />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400">
            Custom websites for local businesses that need a professional
            online presence, clearer enquiries, and optional monthly care after launch.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Explore</p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-neutral-400 transition hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Contact</p>
          <div className="mt-4 flex gap-3">
            <Link
              href="mailto:apexweb.au@gmail.com"
              aria-label="Email APEX WEB"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition hover:border-gold/50 hover:text-gold"
            >
              <Mail className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.instagram.com/apexweb.au/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition hover:border-gold/50 hover:text-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61591306250659"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 transition hover:border-gold/50 hover:text-gold"
            >
              <FacebookIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container flex flex-col gap-3 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <span>Copyright 2026 APEX WEB. All rights reserved.</span>
          <span>One-time builds. Optional monthly management.</span>
        </div>
      </div>
    </footer>
  );
}
