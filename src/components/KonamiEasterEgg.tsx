import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playFanfare } from "../utils/soundEffects";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function playChiptune() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  // 8-bit melody
  const melody = [
    { freq: 523, time: 0 },
    { freq: 659, time: 0.12 },
    { freq: 784, time: 0.24 },
    { freq: 1047, time: 0.36 },
    { freq: 784, time: 0.48 },
    { freq: 659, time: 0.6 },
    { freq: 523, time: 0.72 },
    { freq: 784, time: 0.84 },
    { freq: 1047, time: 0.96 },
    { freq: 1319, time: 1.08 },
  ];

  melody.forEach(({ freq, time }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, now + time);
    gain.gain.exponentialRampToValueAtTime(0.01, now + time + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + time);
    osc.stop(now + time + 0.1);
  });
}

interface Coin {
  id: number;
  x: number;
  delay: number;
}

export default function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [hintVisible, setHintVisible] = useState(false);
  const coinId = useRef(0);

  // Listen for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const next = [...prev, e.key].slice(-KONAMI_CODE.length);

        const isMatch = next.length === KONAMI_CODE.length &&
          next.every((k, i) => k === KONAMI_CODE[i]);

        if (isMatch) {
          setActive(true);
          playChiptune();
          playFanfare();
        }

        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Show hint after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(true), 60000);
    const hide = setTimeout(() => setHintVisible(false), 68000);
    return () => { clearTimeout(timer); clearTimeout(hide); };
  }, []);

  // Spawn coins when active
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      coinId.current++;
      setCoins((prev) => [
        ...prev.slice(-20),
        {
          id: coinId.current,
          x: Math.random() * window.innerWidth,
          delay: Math.random() * 0.5,
        },
      ]);
    }, 300);

    // Deactivate after 12 seconds
    const timer = setTimeout(() => {
      setActive(false);
      setCoins([]);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [active]);

  // Apply retro mode to body
  useEffect(() => {
    if (active) {
      document.body.classList.add("retro-mode");
    } else {
      document.body.classList.remove("retro-mode");
    }
    return () => document.body.classList.remove("retro-mode");
  }, [active]);

  return (
    <>
      {/* Konami hint */}
      <AnimatePresence>
        {hintVisible && !active && (
          <motion.div
            className="konami-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            🎮 Psst... try ↑↑↓↓←→←→BA
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="konami-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Title */}
            <motion.div
              className="konami-title"
              initial={{ y: -50, scale: 2, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h1>🕹️ RETRO MODE ACTIVATED 🕹️</h1>
              <p>+30 Lives • God Mode ON • Infinite Pranks</p>
            </motion.div>

            {/* Falling coins */}
            {coins.map((coin) => (
              <motion.div
                key={coin.id}
                className="konami-coin"
                initial={{ y: -50, x: coin.x, rotate: 0 }}
                animate={{ y: window.innerHeight + 50, rotate: 720 }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: coin.delay,
                  ease: "linear",
                }}
              >
                🪙
              </motion.div>
            ))}

            {/* Retro scanlines */}
            <div className="konami-scanlines" />

            {/* Pixel grid */}
            <div className="konami-pixel-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
