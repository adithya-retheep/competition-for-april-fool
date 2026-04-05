import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FakeBSOD() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"crash" | "scanning" | "reveal">("crash");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const clickCountRef = useRef(0);
  const triggerThreshold = useRef(8 + Math.floor(Math.random() * 10)); // Random trigger between 8-18 clicks

  // Count clicks globally to trigger BSOD
  useEffect(() => {
    if (dismissed) return;

    const handleClick = () => {
      clickCountRef.current++;
      if (clickCountRef.current >= triggerThreshold.current && !visible && !dismissed) {
        setVisible(true);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [visible, dismissed]);

  // Progress bar animation
  useEffect(() => {
    if (!visible || phase !== "scanning") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Get stuck at 95%, then restart, then complete
        if (prev >= 95 && prev < 100) {
          // Flicker around 95
          return 93 + Math.random() * 4;
        }
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 150);

    // After 5 seconds, force complete
    const forceComplete = setTimeout(() => {
      setProgress(100);
      setPhase("reveal");
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(forceComplete);
    };
  }, [visible, phase]);

  // Phase transitions
  useEffect(() => {
    if (!visible) return;

    // Initial crash → scanning
    const t1 = setTimeout(() => setPhase("scanning"), 2500);

    // Glitch effect
    const glitchTimer = setInterval(() => {
      setGlitchIntensity(Math.random());
      setTimeout(() => setGlitchIntensity(0), 100);
    }, 800);

    return () => {
      clearTimeout(t1);
      clearInterval(glitchTimer);
    };
  }, [visible]);

  // Auto-dismiss after reveal
  useEffect(() => {
    if (phase === "reveal") {
      const timer = setTimeout(() => {
        setVisible(false);
        setDismissed(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (!visible || dismissed) return null;

  const isMac = navigator.platform.toUpperCase().includes("MAC");

  return (
    <AnimatePresence>
      <motion.div
        className="bsod-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          transform: glitchIntensity > 0.7
            ? `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 5}px)`
            : "none",
        }}
      >
        {/* Scanlines */}
        <div className="bsod-scanlines" />

        {phase === "crash" && (
          <motion.div
            className={`bsod-content ${isMac ? "bsod-mac" : "bsod-win"}`}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
          >
            {isMac ? (
              // macOS Kernel Panic style
              <>
                <div className="bsod-mac-overlay">
                  <div className="bsod-mac-icon">⚠️</div>
                  <h2 className="bsod-mac-title">
                    You need to restart your computer.
                  </h2>
                  <p className="bsod-mac-text">
                    Hold down the Power button for several seconds or press the
                    Restart button.
                  </p>
                  <div className="bsod-mac-details">
                    <code>
                      Panic(cpu 0 caller 0xffffff8000): "ERR_TOO_MUCH_FUN"
                      <br />
                      Process: PrankEngine [420]
                      <br />
                      Module: com.prankraft.chaos (69.0.0)
                      <br />
                      <br />
                      Kernel Version: Darwin Kernel Version 24.2.0: PRANKED
                    </code>
                  </div>
                </div>
              </>
            ) : (
              // Windows BSOD style
              <>
                <div className="bsod-sad">:(</div>
                <h2 className="bsod-title">
                  Your PC ran into a problem and needs to restart.
                </h2>
                <p className="bsod-text">
                  We're just collecting some error info, and then we'll restart
                  for you.
                </p>
                <div className="bsod-error-code">
                  <p>Stop code: ERR_TOO_MUCH_FUN</p>
                  <p>What failed: PrankEngine.sys</p>
                </div>
                <div className="bsod-qr">
                  <div className="bsod-qr-fake">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="qr-pixel"
                        style={{
                          background: Math.random() > 0.4 ? "white" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div
            className="bsod-scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bsod-scan-icon">🔍</div>
            <h3>Scanning for problems...</h3>
            <div className="bsod-progress-container">
              <motion.div
                className="bsod-progress-bar"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="bsod-scan-percent">{Math.min(Math.floor(progress), 99)}%</p>
            <p className="bsod-scan-detail">
              {progress < 30
                ? "Analyzing humor levels..."
                : progress < 60
                ? "Detecting prank residue..."
                : progress < 90
                ? "Calibrating joke sensors..."
                : "Almost there (probably)..."}
            </p>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            className="bsod-reveal"
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="bsod-reveal-emoji">😂</div>
            <h2>JUST KIDDING!</h2>
            <p>Your computer is fine. Your trust issues, however...</p>
            <motion.p
              className="bsod-reveal-sub"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Returning to reality in 3...2...1...
            </motion.p>
          </motion.div>
        )}

        {/* CRT flicker effect */}
        <div className="bsod-crt-flicker" />
      </motion.div>
    </AnimatePresence>
  );
}
