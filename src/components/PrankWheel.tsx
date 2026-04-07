import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playFahh, playBoing, playSadTrombone, playLaugh, playFanfare, playHonk } from "../utils/soundEffects";

interface WheelSlice {
  label: string;
  color: string;
  emoji: string;
  effect: () => void;
  resultText: string;
}

export default function PrankWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSlice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const slices: WheelSlice[] = [
    {
      label: "FREE iPhone",
      color: "#00ffff",
      emoji: "📱",
      resultText: "Congratulations! You won a FREE iPhone!*\n\n\n*iPhone not included.",
      effect: () => { playSadTrombone(); },
    },
    {
      label: "₹1 Crore",
      color: "#ff00ff",
      emoji: "💰",
      resultText: "You won ₹1,00,00,000!\n\nJust kidding. You won ₹0.00 🤡",
      effect: () => { playFahh(); },
    },
    {
      label: "Mystery Box",
      color: "#ffd700",
      emoji: "📦",
      resultText: "You opened the Mystery Box!\n\nIt's empty. Just like your hopes. 📦💨",
      effect: () => { playHonk(); },
    },
    {
      label: "Try Again",
      color: "#ff6b35",
      emoji: "🔄",
      resultText: "TRY AGAIN!\n\nSpoiler: You'll get the same result every time 😏",
      effect: () => { playBoing(); },
    },
    {
      label: "Free Pizza",
      color: "#7b68ee",
      emoji: "🍕",
      resultText: "🍕 Your free pizza is on its way!\n\nEstimated delivery: April 1st, 2099",
      effect: () => { playLaugh(); },
    },
    {
      label: "JACKPOT",
      color: "#ff1493",
      emoji: "🎰",
      resultText: "🎰 J-A-C-K-P-O-T!!!\n\nYou won the grand prize of...\n\n...absolutely nothing! 🎉",
      effect: () => { playFahh(); setTimeout(playLaugh, 800); },
    },
    {
      label: "Diploma",
      color: "#00ff88",
      emoji: "🎓",
      resultText: "🎓 Congratulations!\n\nYou earned a Diploma in Getting Pranked.\nPut it on your resume.",
      effect: () => { playFanfare(); },
    },
    {
      label: "A Hug",
      color: "#ff4444",
      emoji: "🤗",
      resultText: "🤗 You won a virtual hug!\n\n*Hug transmitted via screen radiation*\nDid you feel it? No? Too bad.",
      effect: () => { playBoing(); },
    },
  ];

  const numSlices = slices.length;
  const sliceAngle = 360 / numSlices;

  const spinWheel = useCallback(() => {
    if (spinning) return;

    setSpinning(true);
    setShowResult(false);
    setResult(null);

    // Random number of full rotations (5-10) + random landing position
    const fullRotations = (Math.floor(Math.random() * 5) + 5) * 360;
    const landingAngle = Math.random() * 360;
    const totalRotation = rotation + fullRotations + landingAngle;

    setRotation(totalRotation);
    playBoing();

    // Calculate which slice we land on after spin completes
    setTimeout(() => {
      // Normalize the angle to find which slice (top of wheel is 0 degrees)
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const sliceIndex = Math.floor(normalizedAngle / sliceAngle) % numSlices;
      const landed = slices[sliceIndex];

      setResult(landed);
      setShowResult(true);
      setSpinning(false);
      setSpinCount((prev) => prev + 1);

      // Play the slice's effect sound
      landed.effect();
    }, 4500);
  }, [spinning, rotation, slices, sliceAngle, numSlices]);

  return (
    <div className="prank-wheel-container">
      <div className="wheel-game-container">
        {/* Wheel */}
        <div className="wheel-wrapper">
          {/* Pointer / Arrow */}
          <div className="wheel-pointer">▼</div>

          <motion.div
            ref={wheelRef}
            className="wheel"
            animate={{ rotate: rotation }}
            transition={{
              duration: 4.5,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            {slices.map((slice, i) => {
              const startAngle = i * sliceAngle;
              const midAngle = startAngle + sliceAngle / 2;
              const textR = 95;

              return (
                <div key={`slice-${i}`}>
                  {/* Slice shape via conic gradient is handled by CSS */}
                  <div
                    className="wheel-label"
                    style={{
                      transform: `rotate(${midAngle}deg) translateY(-${textR}px)`,
                    }}
                  >
                    <span
                      className="wheel-label-text"
                      style={{ transform: `rotate(90deg)` }}
                    >
                      {slice.emoji} {slice.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Center button */}
          <motion.button
            className="wheel-spin-btn"
            onClick={spinWheel}
            disabled={spinning}
            whileHover={!spinning ? { scale: 1.1 } : {}}
            whileTap={!spinning ? { scale: 0.95 } : {}}
            animate={spinning ? { rotate: [0, 360] } : {}}
            transition={spinning ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          >
            {spinning ? "🌀" : "SPIN"}
          </motion.button>
        </div>

        {/* Result display */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              className="wheel-result"
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="result-emoji">{result.emoji}</div>
              <div className="result-text">
                {result.resultText.split("\n").map((line, idx) => (
                  <p key={`line-${idx}`}>{line}</p>
                ))}
              </div>
              <motion.button
                className="spin-again-btn"
                onClick={spinWheel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {spinCount >= 3
                  ? "Still trying? 🤡"
                  : spinCount >= 2
                  ? "You'll win this time! (no you won't)"
                  : "Spin Again! 🎡"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {spinCount >= 3 && (
        <motion.p
          className="wheel-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Psst... the wheel is rigged. Every prize is a prank. Happy April Fools! 🤭
        </motion.p>
      )}
    </div>
  );
}
