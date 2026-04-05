import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop } from "../utils/soundEffects";

export default function ShrinkingPage() {
  const [scale, setScale] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (dismissed) return;
    const startDelay = setTimeout(() => {
      startTime.current = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime.current) / 1000;
        const newScale = Math.max(1 - elapsed * 0.0004, 0.85);
        setScale(newScale);
        if (newScale <= 0.9 && !showPopup) setShowPopup(true);
      }, 1000);
      return () => clearInterval(interval);
    }, 30000);
    return () => clearTimeout(startDelay);
  }, [dismissed, showPopup]);

  useEffect(() => {
    if (dismissed) return;
    const el = document.querySelector(".main-content") as HTMLElement;
    if (el && scale < 1) {
      el.style.transition = "transform 1s ease";
      el.style.transform = `scale(${scale})`;
      el.style.transformOrigin = "center top";
    }
    return () => { if (el) el.style.transform = "scale(1)"; };
  }, [scale, dismissed]);

  const handleDismiss = () => {
    playPop();
    setShowPopup(false);
    setDismissed(true);
    setScale(1);
    const el = document.querySelector(".main-content") as HTMLElement;
    if (el) {
      el.style.transition = "transform 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)";
      el.style.transform = "scale(1)";
    }
  };

  return (
    <AnimatePresence>
      {showPopup && !dismissed && (
        <motion.div className="shrink-popup" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
          <div className="shrink-popup-emoji">🔍</div>
          <p className="shrink-popup-title">Did this page get smaller?</p>
          <p className="shrink-popup-sub">Current scale: {(scale * 100).toFixed(1)}%</p>
          <div className="shrink-popup-buttons">
            <button onClick={handleDismiss}>Yes</button>
            <button onClick={handleDismiss}>Also Yes</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
