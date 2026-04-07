import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { playFahh, playHonk } from "../utils/soundEffects";

export default function FloatingHomeButton() {
  const [position, setPosition] = useState({ x: 40, y: window.innerHeight - 100 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [message, setMessage] = useState("");
  const [caught, setCaught] = useState(false);

  const escapeMessages = [
    "Nope! 😜",
    "Too slow!",
    "Can't touch this! 🎵",
    "Almost! 😂",
    "Try harder!",
    "I'm too fast! 🏃",
    "Haha, missed me!",
    "You'll never catch me!",
    "Over here! 👋",
    "Keep trying! 💪",
  ];

  const caughtMessages = [
    "You caught me! 😱",
    "Okay okay, you win!",
    "Fine... take me home 🏠",
  ];

  const getRandomPosition = useCallback(() => {
    const padding = 80;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    return {
      x: Math.max(padding, Math.random() * maxX),
      y: Math.max(padding, Math.random() * maxY),
    };
  }, []);

  const handleMouseEnter = () => {
    if (caught) return;

    if (escapeCount >= 5) {
      setCaught(true);
      setMessage(caughtMessages[Math.floor(Math.random() * caughtMessages.length)]);
      playHonk();
      return;
    }

    const newPos = getRandomPosition();
    setPosition(newPos);
    setEscapeCount((prev) => prev + 1);
    setMessage(escapeMessages[escapeCount % escapeMessages.length]);
    playFahh();

    setTimeout(() => setMessage(""), 1000);
  };

  const handleClick = () => {
    if (caught) {
      const hero = document.getElementById("hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => {
        setCaught(false);
        setEscapeCount(0);
        setMessage("");
        setPosition({ x: 40, y: window.innerHeight - 100 });
      }, 2000);
    }
  };

  // Subtle idle floating animation
  const [idleOffset, setIdleOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      if (!caught) {
        setIdleOffset({
          x: Math.sin(Date.now() / 1000) * 5,
          y: Math.cos(Date.now() / 1000) * 5,
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [caught]);

  // Use createPortal to render directly into document.body
  // This bypasses ALL parent transforms/overflow/stacking contexts
  const content = (
    <>
      <motion.button
        className={`floating-home-btn ${caught ? "caught" : ""}`}
        animate={{
          left: position.x + idleOffset.x,
          top: position.y + idleOffset.y,
          scale: caught ? [1, 1.2, 1] : 1,
          rotate: caught ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        whileTap={caught ? { scale: 0.9 } : {}}
        style={{
          position: "fixed",
          zIndex: 9998,
          // No top/left 0 — we animate left/top directly
        }}
      >
        <span className="home-icon">🏠</span>
        <span className="home-label">{caught ? "Go Home" : "Home"}</span>
      </motion.button>

      {/* Escape message popup */}
      {message && (
        <motion.div
          className="escape-message"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: position.y - 50,
            left: position.x,
            zIndex: 9999,
          }}
        >
          {message}
        </motion.div>
      )}

      {/* Escape counter */}
      {escapeCount > 0 && !caught && (
        <motion.div
          className="escape-counter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={escapeCount}
        >
          🏃 Escapes: {escapeCount}/5
        </motion.div>
      )}
    </>
  );

  return createPortal(content, document.body);
}
