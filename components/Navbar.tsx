import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    router.events.on("routeChangeStart", closeMenu);
    return () => router.events.off("routeChangeStart", closeMenu);
  }, [router.events]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
        scrolled
          ? "border-white/10 bg-ink/82 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="container flex min-h-20 items-center justify-between gap-5">
        <Link href="/" className="flex items-center" aria-label="APEX WEB home">
          <Logo
            variant="icon"
            className="h-16 w-16 rounded-full object-cover md:h-[72px] md:w-[72px]"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition hover:text-gold ${
                  active ? "text-gold" : "text-neutral-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <ButtonLink href="/contact">Get A Free Quote</ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-ink/96 px-5 py-5 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-md flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-base font-semibold text-neutral-200 transition hover:bg-white/[0.06] hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/contact" className="mt-3 w-full">
              Get A Free Quote
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
