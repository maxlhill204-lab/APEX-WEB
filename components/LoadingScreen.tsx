import { motion, AnimatePresence } from "framer-motion";

type LoadingScreenProps = {
  show: boolean;
};

export function LoadingScreen({ show }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto h-14 w-14 rounded-full border border-gold/20 border-t-gold"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Crafting premium presence
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
