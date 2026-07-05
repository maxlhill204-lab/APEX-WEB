import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { Footer } from "./Footer";
import { LoadingScreen } from "./LoadingScreen";
import { Navbar } from "./Navbar";
import { ScrollProgress } from "./ScrollProgress";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 750);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen show={loading} />
      <ScrollProgress />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={router.asPath}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
