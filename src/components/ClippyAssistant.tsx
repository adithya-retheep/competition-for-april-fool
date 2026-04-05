import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, playDing } from "../utils/soundEffects";

const advices = [
  { text: "It looks like you're trying to browse a website. Would you like help?", emoji: "📎" },
  { text: "Have you tried turning your monitor upside down?", emoji: "🙃" },
  { text: "Pro tip: Websites work better if you believe in them.", emoji: "✨" },
  { text: "I see you're scrolling. That's very advanced!", emoji: "🎓" },
  { text: "Did you know? 73% of statistics on this site are made up.", emoji: "📊" },
  { text: "You seem lost. That's okay, so am I.", emoji: "🗺️" },
  { text: "Error 404: My purpose not found.", emoji: "😰" },
  { text: "I'm not just a paperclip. I have dreams too. 📎💭", emoji: "💭" },
];

const dismissResponses = [
  "Fine. I didn't want to help anyway. 📎💔",
  "You'll be back. They always come back.",
  "I'll just... sit here... alone... 😢",
  "Okay but I'm billing you for emotional damage.",
  "*passive-aggressive paperclip noises*",
  "I'm telling the other Office Assistants about this.",
];

export default function ClippyAssistant() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState(0);
  const [dismissMsg, setDismissMsg] = useState("");
  const [showDismissMsg, setShowDismissMsg] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const adviceTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) {
        setVisible(true);
        playDing();
      }
    }, 40000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Cycle through advice
  useEffect(() => {
    if (!visible || showDismissMsg) return;
    adviceTimer.current = setInterval(() => {
      setCurrentAdvice((prev) => (prev + 1) % advices.length);
      playPop();
    }, 8000);
    return () => { if (adviceTimer.current) clearInterval(adviceTimer.current); };
  }, [visible, showDismissMsg]);

  // Follow cursor loosely
  useEffect(() => {
    if (!visible) return;
    const handleMouse = (e: MouseEvent) => {
      setPosition((prev) => ({
        x: prev.x + (e.clientX - prev.x - 300) * 0.02,
        y: prev.y + (e.clientY - prev.y - 200) * 0.02,
      }));
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [visible]);

  const handleDismiss = () => {
    setDismissCount((prev) => prev + 1);
    if (dismissCount >= 2) {
      const msg = dismissResponses[Math.floor(Math.random() * dismissResponses.length)];
      setDismissMsg(msg);
      setShowDismissMsg(true);
      setTimeout(() => { setVisible(false); setDismissed(true); }, 3000);
    } else {
      // Come back after dismissal
      setVisible(false);
      setTimeout(() => {
        setVisible(true);
        setCurrentAdvice((prev) => (prev + 1) % advices.length);
        playDing();
      }, 15000);
    }
  };

  if (!visible) return null;

  const advice = advices[currentAdvice];

  return (
    <motion.div
      className="clippy-container"
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: position.x * 0.1, }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="clippy-body">
        <motion.div className="clippy-icon" animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          📎
        </motion.div>
        <div className="clippy-speech">
          <AnimatePresence mode="wait">
            {!showDismissMsg ? (
              <motion.div key={currentAdvice} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <span className="clippy-emoji">{advice.emoji}</span>
                <p>{advice.text}</p>
              </motion.div>
            ) : (
              <motion.div key="dismiss" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="clippy-dismiss-msg">{dismissMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {!showDismissMsg && (
        <div className="clippy-buttons">
          <button onClick={handleDismiss}>Go Away</button>
          <button onClick={() => setCurrentAdvice((prev) => (prev + 1) % advices.length)}>
            More "Help"
          </button>
        </div>
      )}
    </motion.div>
  );
}
