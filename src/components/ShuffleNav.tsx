import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop } from "../utils/soundEffects";

interface ShuffleNavProps {
  onDarkModeToggle: () => void;
  currentSection: string;
}

export default function ShuffleNav({ onDarkModeToggle, currentSection }: ShuffleNavProps) {
  const [items, setItems] = useState([
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "wheel", label: "Wheel" },
    { id: "form", label: "Contact" },
    { id: "finale", label: "Finale" },
  ]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const shuffleItems = () => {
    if (shuffleCount >= 6) return; // Stop being annoying after 6 shuffles

    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setItems(shuffled);
    setShuffleCount((prev) => prev + 1);
    playPop();

    if (shuffleCount === 3) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className="shuffle-nav"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
    >
      <div className="nav-brand">
        <span className="nav-emoji">🎭</span>
        <span className="nav-title">PRANKRAFT</span>
      </div>

      <div className="nav-items" onMouseEnter={shuffleItems}>
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.button
              key={item.id}
              layout
              className={`nav-item ${currentSection === item.id ? "active" : ""}`}
              onClick={() => scrollToSection(item.id)}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <button className="dark-mode-toggle" onClick={onDarkModeToggle}>
        🌙
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="nav-tooltip"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            🤭 Stop hovering! They keep moving!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
