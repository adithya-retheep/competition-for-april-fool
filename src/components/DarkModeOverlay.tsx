import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playRecordScratch, playLaugh } from "../utils/soundEffects";

interface DarkModeOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export default function DarkModeOverlay({ active, onComplete }: DarkModeOverlayProps) {
  const [phase, setPhase] = useState<"dark" | "flip" | "done">("dark");

  useEffect(() => {
    if (active) {
      setPhase("dark");
      playRecordScratch();
      // Phase 1: Pitch black for 1.5s
      const t1 = setTimeout(() => { setPhase("flip"); playLaugh(); }, 1500);
      // Phase 2: Flip everything for 1.5s
      const t2 = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 3500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="dark-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {phase === "dark" && (
          <motion.div
            className="dark-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.5] }}
            transition={{ duration: 1.5 }}
          >
            <div className="dark-bulb">💡</div>
            <p>Finding the light switch...</p>
            <motion.div
              className="dark-dots"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              . . .
            </motion.div>
          </motion.div>
        )}

        {phase === "flip" && (
          <motion.div
            className="flip-message"
            initial={{ opacity: 0, rotateX: 180 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="flip-text">🙃 That's not how dark mode works!</p>
            <p className="flip-sub">...or is it?</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
