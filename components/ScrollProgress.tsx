import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-gold"
      style={{ scaleX }}
    />
  );
}
