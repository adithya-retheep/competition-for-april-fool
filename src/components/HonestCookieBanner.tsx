import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, playLaugh } from "../utils/soundEffects";

export default function HonestCookieBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [closePos, setClosePos] = useState({ x: 0, y: 0 });
  const [closeDodges, setCloseDodges] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleAccept = () => {
    setClickCount((prev) => prev + 1);
    playPop();

    if (clickCount === 0) {
      setExpanded(true);
    } else if (clickCount >= 2) {
      playLaugh();
      setTimeout(() => {
        setVisible(false);
        setDismissed(true);
      }, 2000);
    }
  };

  const handleCloseHover = () => {
    if (closeDodges >= 4) return;
    const newX = (Math.random() - 0.5) * 60;
    const newY = (Math.random() - 0.5) * 30;
    setClosePos({ x: newX, y: newY });
    setCloseDodges((prev) => prev + 1);
  };

  const handleCloseClick = () => {
    if (closeDodges >= 4) {
      setVisible(false);
      setDismissed(true);
    }
  };

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cookie-banner"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        layout
      >
        <motion.button
          className="cookie-close"
          animate={{ x: closePos.x, y: closePos.y }}
          transition={{ type: "spring", stiffness: 400 }}
          onMouseEnter={handleCloseHover}
          onClick={handleCloseClick}
        >
          ×
        </motion.button>

        <div className="cookie-icon">🍪</div>

        <div className="cookie-content">
          <h3 className="cookie-title">Cookie Consent</h3>

          {!expanded ? (
            <div className="cookie-text">
              <p>We use cookies to:</p>
              <ul className="cookie-list">
                <li>✅ Track your every move</li>
                <li>✅ Sell your data to clowns 🤡</li>
                <li>✅ Make this popup impossible to close</li>
                <li>✅ Absolutely nothing useful</li>
              </ul>
            </div>
          ) : (
            <motion.div
              className="cookie-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Nice try! Here are MORE cookies:</p>
              <ul className="cookie-list cookie-list-expanded">
                <li>🍪 Tracking Cookie (flavor: suspicion)</li>
                <li>🍪 Third-party Cookie (from your mom)</li>
                <li>🍪 Sentiment Cookie (we know you're annoyed)</li>
                <li>🍪 Fortune Cookie: "You will click Accept again"</li>
                <li>🍪 Session Cookie (expires: never)</li>
                <li>🍪 Super Cookie (has a cape)</li>
              </ul>
            </motion.div>
          )}
        </div>

        <div className="cookie-buttons">
          <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
            {clickCount === 0
              ? "Accept All"
              : clickCount === 1
              ? "Accept Even More"
              : "Fine, Stop! 😤"}
          </button>
          <button className="cookie-btn cookie-btn-deny" onClick={handleAccept}>
            {clickCount === 0
              ? "Accept All But In Red"
              : clickCount === 1
              ? "Reject (lol no)"
              : "We'll track you anyway 😈"}
          </button>
        </div>

        {clickCount >= 2 && (
          <motion.p
            className="cookie-gotcha"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            🎉 Both buttons did the same thing! Welcome to the internet.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
