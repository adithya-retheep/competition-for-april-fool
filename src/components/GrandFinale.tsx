import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { playFanfare } from "../utils/soundEffects";

interface GrandFinaleProps {
  triggered: boolean;
}

export default function GrandFinale({ triggered }: GrandFinaleProps) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (triggered && !hasRun.current) {
      hasRun.current = true;

      // Fire confetti from multiple angles
      const duration = 5000;
      const end = Date.now() + duration;

      const colors = ["#00ffff", "#ff00ff", "#ffd700", "#ff6b35", "#7b68ee"];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      // Initial burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });

      playFanfare();
      frame();
    }
  }, [triggered]);

  if (!triggered) return null;

  return (
    <motion.div
      className="grand-finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="finale-content"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
      >
        <motion.div
          className="finale-emojis"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🎭 🎉 🤡 🎊 🃏
        </motion.div>

        <h1 className="finale-title">
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{
              background: "linear-gradient(90deg, #00ffff, #ff00ff, #ffd700, #ff6b35, #00ffff)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            YOU'VE BEEN PRANKED!
          </motion.span>
        </h1>

        <p className="finale-subtitle">Happy April Fools Day! 🎉</p>

        <div className="prank-recap">
          <h3>Your Prank Recap:</h3>
          <ul>
            <li>✅ Survived the infinite loader</li>
            <li>✅ Caught the runaway button</li>
            <li>✅ Witnessed the gravity flip</li>
            <li>✅ Fell for the dark mode trick</li>
            <li>✅ Got pranked by the form</li>
            <li>✅ Clicked the fake notification</li>
            <li>✅ Survived cursor chaos 🖱️</li>
            <li>✅ Failed the impossible CAPTCHA 🧩</li>
            <li>✅ Didn't panic at the fake crash 💀</li>
            <li>✅ Accepted the honest cookies 🍪</li>
            <li>✅ Scrolled against gravity 🌌</li>
            <li>✅ Got gaslighted by changing text 👀</li>
            <li>✅ Met the ghost typist 👻</li>
            <li>✅ Noticed the shrinking page 🔍</li>
            <li>✅ Survived Clippy's return 📎</li>
            <li>✅ Discovered the secret menu 🍝</li>
            <li>✅ Spun the Wheel of Misfortune 🎡</li>
            <li>✅ Made it to the grand finale!</li>
          </ul>
        </div>

        <motion.p
          className="finale-credit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Made with 🤡 for PRANKRAFT 2026
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
