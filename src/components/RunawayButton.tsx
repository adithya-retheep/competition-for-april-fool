import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { playBoing, playFanfare } from "../utils/soundEffects";

interface RunawayButtonProps {
  onCatch: () => void;
}

export default function RunawayButton({ onCatch }: RunawayButtonProps) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [caught, setCaught] = useState(false);
  const [buttonText, setButtonText] = useState("Enter Experience ✨");
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const maxDodges = 4;

  const dodgeMessages = [
    "Too slow! 😜",
    "Almost got me!",
    "Nope! Try again 🏃",
    "One more try... 😏",
  ];

  const handleMouseEnter = () => {
    if (caught) return;

    if (dodgeCount >= maxDodges) {
      // Give up and let them click
      setCaught(true);
      setButtonText("Okay, you win! Click me 🎉");
      setPosition({ x: 0, y: 0 });
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const maxX = bounds.width / 2 - 100;
    const maxY = bounds.height / 2 - 30;

    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;

    setPosition({ x: newX, y: newY });
    setDodgeCount((prev) => prev + 1);
    setButtonText(dodgeMessages[dodgeCount] || "Getting tired... 😅");
    playBoing();
  };

  const handleClick = () => {
    if (caught || dodgeCount >= maxDodges) {
      setCaught(true);
      playFanfare();
      onCatch();
    }
  };

  return (
    <div ref={containerRef} className="runaway-container">
      <motion.button
        className="runaway-btn"
        animate={{
          x: position.x,
          y: position.y,
          scale: caught ? [1, 1.2, 1] : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>

      {dodgeCount > 0 && !caught && (
        <motion.p
          className="dodge-counter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={dodgeCount}
        >
          Attempts: {dodgeCount}/{maxDodges + 1}
        </motion.p>
      )}
    </div>
  );
}
