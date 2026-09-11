import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { track } from "@/lib/analytics";
const links = [
  ["Services", "/services"],
  ["Packages", "/#packages"],
  ["Contact", "/contact"],
];
export function Brand() {
  return (
    <span className="brand">
      APEX<span className="brand-light">WEB</span>
    </span>
  );
}
export function Navbar() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" title="APEXWEB home" className="nav-brand">
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className="button nav-quote"
          href="/quote"
          onClick={() => track("quote_clicked", { placement: "navigation" })}
        >
          Get a quote <ArrowUpRight size={17} />
        </Link>
        <button
          ref={trigger}
          className="icon-button mobile-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </div>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        onCancel={close}
        onClose={() => setOpen(false)}
        aria-label="Navigation"
      >
        <div className="mobile-top">
          <Brand />
          <button
            className="icon-button"
            aria-label="Close menu"
            onClick={close}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href], i) => (
            <Link key={label} href={href} onClick={close}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight />
            </Link>
          ))}
          <Link href="/quote" onClick={close}>
            Start your quote <ArrowUpRight />
          </Link>
          <Link href="/#contact" onClick={close}>
            Contact
          </Link>
        </nav>
      </dialog>
    </header>
  );
}
