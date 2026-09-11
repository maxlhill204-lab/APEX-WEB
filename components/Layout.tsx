import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [cinemaVisible, setCinemaVisible] = useState(true);
  useEffect(() => {
    const cinema = document.querySelector(".cinema, .cinema-static");
    if (!cinema) return;
    const observer = new IntersectionObserver(([entry]) => setCinemaVisible(entry.isIntersecting));
    observer.observe(cinema);
    return () => observer.disconnect();
  }, [router.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      {router.pathname !== "/" && <Footer />}
      {router.pathname !== "/quote" && router.pathname !== "/contact" && (
        <Link
          className="cinema-cta"
          style={router.pathname === "/" && !cinemaVisible ? { display: "none" } : undefined}
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
