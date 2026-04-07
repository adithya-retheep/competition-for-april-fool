import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AntiGravityScroll() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const scrollCount = useRef(0);
  const isReversing = useRef(false);

  const messages = [
    "⚠️ Gravity Malfunction Detected",
    "🌌 Space-Time Anomaly Detected",
    "🔄 Scroll Inversion Engaged",
    "🎭 Reality Check Failed",
    "⬆️ Up is the new Down",
    "🌀 Dimension Shift Active",
  ];

  useEffect(() => {
    let reverseTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      scrollCount.current++;

      // Every 5th scroll event, reverse direction
      if (scrollCount.current % 5 === 0 && !isReversing.current) {
        isReversing.current = true;

        // Show toast
        const msg = messages[Math.floor(Math.random() * messages.length)];
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);

        // Reverse scroll
        e.preventDefault();
        const reverseAmount = -e.deltaY * 3;
        window.scrollBy({ top: reverseAmount, behavior: "smooth" });

        reverseTimeout = setTimeout(() => {
          isReversing.current = false;
        }, 1000);
      }

      // Subtle rotation — apply to #root, NOT body (body transforms break position:fixed)
      if (scrollCount.current % 15 === 0) {
        const root = document.getElementById("root");
        if (root) {
          root.style.transition = "transform 2s ease";
          root.style.transform = `rotate(${(Math.random() - 0.5) * 2}deg)`;
          setTimeout(() => {
            root.style.transform = "rotate(0deg)";
          }, 3000);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (reverseTimeout) clearTimeout(reverseTimeout);
      const root = document.getElementById("root");
      if (root) root.style.transform = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          className="antigravity-toast"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
