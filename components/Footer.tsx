import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Navbar";
import { site } from "@/site.config";
import { track } from "@/lib/analytics";
export function Footer() {
  return (
    <footer className="footer container">
      <div className="footer-top">
        <Link href="/" title="APEXWEB home">
          <Brand />
        </Link>
        <p>Good business deserves a great website.</p>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("instagram_clicked")}
        >
          Instagram <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} APEXWEB</span>
        <div>
          <Link href="/#packages">Packages</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/credits">Visual credits</Link>
          <a href="#main">Back to top ↑</a>
        </div>
        <span>Designed with purpose.</span>
      </div>
    </footer>
  );
}
