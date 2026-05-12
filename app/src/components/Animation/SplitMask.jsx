"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const SplitMask = ({ children, onArrive, staggerIndex = 0, staggerStep = 0.06, maxStagger = 0.6 }) => {
  const pathname = usePathname();
  const delay = Math.min(staggerIndex * staggerStep, maxStagger);

  const ease = [0.6, -0.05, 0.01, 0.99];

  const variants = {
    initial: { y: "120%", transition: { duration: 0.8, ease, delay } },
    animate: { y: 0, transition: { duration: 0.8, ease, delay } },
    exit: { y: "120%", transition: { duration: 0.8, ease } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} style={{ height: "fit-content", width: "100%", overflow: "hidden" }}>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          onAnimationComplete={(definition) => {
            if (definition === "animate") onArrive?.();
          }}
          style={{ position: "relative", height: "fit-content", width: "100%" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplitMask;
