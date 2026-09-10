import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      {router.pathname !== "/quote" && router.pathname !== "/contact" && (
        <Link
          className="cinema-cta"
          onClick={(event) => {
            if (router.pathname === "/") {
              event.preventDefault();
              document
                .getElementById("start")
                ?.scrollIntoView({ behavior: "instant", block: "start" });
            }
          }}
          href={router.pathname === "/" ? "#start" : "/quote"}
        >
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      )}
    </>
  );
}
