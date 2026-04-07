import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FakeLoaderProps {
  onComplete: () => void;
}

export default function FakeLoader({ onComplete }: FakeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [overloaded, setOverloaded] = useState(false);
  const [statusText, setStatusText] = useState("Initializing prank protocols...");

  const statusMessages = [
    "Initializing prank protocols...",
    "Loading deceptive assets...",
    "Calibrating humor sensors...",
    "Downloading jokes from the cloud...",
    "Warming up the fun engine...",
    "Almost there... probably...",
    "Deploying whoopee cushions...",
    "Polishing rubber chickens...",
    "Syncing with the prank dimension...",
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let msgInterval: ReturnType<typeof setInterval>;

    // Progress bar animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99.7) {
          clearInterval(interval);
          setStuck(true);
          return 99.7;
        }
        // Speed up the loading process
        const increment = prev < 60 ? 5 : prev < 90 ? 2 : 0.5;
        return Math.min(prev + increment, 99.7);
      });
    }, 30);

    // Status message rotation
    msgInterval = setInterval(() => {
      setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(msgInterval);
    };
  }, []);

  // When stuck at 99.7%, wait briefly then jump to 420%
  useEffect(() => {
    if (stuck) {
      setStatusText("So close... almost there!");
      const timer = setTimeout(() => {
        setOverloaded(true);
        setStatusText("🎉 420% LOADED — LETS GO!!!");

        // Finish faster after showing the joke
        setTimeout(() => {
          onComplete();
        }, 800);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [stuck, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fake-loader"
        exit={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.6 }}
      >
        <div className="loader-content">
          <motion.div
            className="loader-logo"
            animate={{ rotateY: [0, 360] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            🎭
          </motion.div>

          <h1 className="loader-title">
            {overloaded ? "OVERLOADED!" : "PRANKRAFT"}
          </h1>

          <div className="progress-container">
            <motion.div
              className="progress-bar"
              style={{
                width: overloaded ? "420%" : `${progress}%`,
                background: overloaded
                  ? "linear-gradient(90deg, #ff00ff, #00ffff, #ff6b35, #ffd700, #ff00ff)"
                  : "linear-gradient(90deg, #00ffff, #ff00ff)",
              }}
              animate={overloaded ? { scaleY: [1, 1.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          </div>

          <motion.p
            className="loader-percent"
            animate={stuck && !overloaded ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            {overloaded ? "420%" : `${progress.toFixed(1)}%`}
          </motion.p>

          <p className="loader-status">{statusText}</p>

          {stuck && !overloaded && (
            <motion.p
              className="loader-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Hmm... this is taking longer than expected... 🤔
            </motion.p>
          )}
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`loader-particle-${i}`}
            className="loader-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
