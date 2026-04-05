import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playDing, playLaugh } from "../utils/soundEffects";

export default function FakeNotification() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [partyMode, setPartyMode] = useState(false);

  useEffect(() => {
    // Show notification after 8 seconds on the page
    const timer = setTimeout(() => {
      if (!dismissed) {
        setVisible(true);
        playDing();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleResponse = () => {
    setPartyMode(true);
    playLaugh();
    setTimeout(() => {
      setVisible(false);
      setDismissed(true);
      setPartyMode(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fake-notification"
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {!partyMode ? (
            <>
              <div className="notif-header">
                <div className="notif-icon">⚠️</div>
                <div className="notif-app">
                  <span className="notif-app-name">BrowserOS</span>
                  <span className="notif-time">now</span>
                </div>
                <button className="notif-close" onClick={() => { setVisible(false); setDismissed(true); }}>×</button>
              </div>
              <div className="notif-body">
                <p className="notif-title">Your browser wants to have fun</p>
                <p className="notif-text">
                  Allow this page to replace your boring reality with something better?
                </p>
              </div>
              <div className="notif-actions">
                <button className="notif-btn notif-btn-deny" onClick={handleResponse}>
                  Deny
                </button>
                <button className="notif-btn notif-btn-allow" onClick={handleResponse}>
                  Allow
                </button>
              </div>
            </>
          ) : (
            <motion.div
              className="notif-party"
              animate={{ rotate: [0, -3, 3, -3, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <div className="party-emojis">🎉🥳🎊🪅🎭</div>
              <p>Both buttons did the same thing! 😜</p>
              <p className="party-sub">Welcome to the party!</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
