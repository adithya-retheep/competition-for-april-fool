import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playBoing, playRecordScratch, playFanfare, playPop } from "../utils/soundEffects";

type CaptchaStep = "images" | "text" | "checkbox" | "passed";

const fakeImages = ["🚦", "🚥", "🚧", "🔴", "🟡", "🟢", "💡", "🔦", "🚨"];

export default function ImpossibleCaptcha() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState<CaptchaStep>("images");
  const [selected, setSelected] = useState<number[]>([]);
  const [failCount, setFailCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [scrambledText, setScrambledText] = useState("Pr4nK3d");
  const [checkboxPos, setCheckboxPos] = useState({ x: 0, y: 0 });
  const [checkboxDodges, setCheckboxDodges] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show captcha after 25s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 25000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Scramble text continuously in step 2
  useEffect(() => {
    if (step === "text") {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";
      const interval = setInterval(() => {
        const len = 6 + Math.floor(Math.random() * 4);
        let result = "";
        for (let i = 0; i < len; i++) {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
        setScrambledText(result);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleImageSelect = (idx: number) => {
    playPop();
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleImageVerify = () => {
    // Always fail
    setFailCount((prev) => prev + 1);
    playRecordScratch();
    setSelected([]);
    if (failCount >= 2) {
      setStep("text");
    }
  };

  const handleTextVerify = () => {
    // Input will never match since text keeps changing
    setFailCount((prev) => prev + 1);
    playRecordScratch();
    setInputText("");
    if (failCount >= 4) {
      setStep("checkbox");
    }
  };

  const handleCheckboxHover = () => {
    if (checkboxDodges >= 5) return;
    const newX = (Math.random() - 0.5) * 200;
    const newY = (Math.random() - 0.5) * 100;
    setCheckboxPos({ x: newX, y: newY });
    setCheckboxDodges((prev) => prev + 1);
    playBoing();
  };

  const handleCheckboxClick = () => {
    if (checkboxDodges >= 5) {
      setStep("passed");
      playFanfare();
    }
  };

  if (!visible || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="captcha-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="captcha-box"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          ref={containerRef}
        >
          <div className="captcha-header">
            <div className="captcha-shield">🛡️</div>
            <div>
              <div className="captcha-brand">reCAPTCHA</div>
              <div className="captcha-sub">Definitely Real Verification™</div>
            </div>
            <button
              className="captcha-close"
              onClick={() => { setDismissed(true); setVisible(false); }}
            >
              ×
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "images" && (
              <motion.div key="images" exit={{ opacity: 0, x: -50 }}>
                <p className="captcha-instruction">
                  Select all images containing <strong>traffic lights</strong>
                </p>
                <div className="captcha-grid">
                  {fakeImages.map((emoji, idx) => (
                    <motion.button
                      key={`captcha-img-${idx}`}
                      className={`captcha-img-btn ${selected.includes(idx) ? "selected" : ""}`}
                      onClick={() => handleImageSelect(idx)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="captcha-emoji">{emoji}</span>
                      {selected.includes(idx) && (
                        <motion.div
                          className="captcha-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                <button className="captcha-verify-btn" onClick={handleImageVerify}>
                  Verify ({failCount > 0 ? `Attempt ${failCount + 1}` : "Submit"})
                </button>
                {failCount > 0 && (
                  <motion.p
                    className="captcha-fail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ❌ Incorrect. Try again. (Hint: they're all traffic lights... or none of them are)
                  </motion.p>
                )}
              </motion.div>
            )}

            {step === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <p className="captcha-instruction">Type the text you see below:</p>
                <motion.div
                  className="captcha-scrambled"
                  animate={{
                    rotate: [0, 2, -2, 1, -1, 0],
                    scale: [1, 1.05, 0.95, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {scrambledText}
                </motion.div>
                <input
                  className="captcha-text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Good luck typing this..."
                />
                <button className="captcha-verify-btn" onClick={handleTextVerify}>
                  Verify
                </button>
                <motion.p
                  className="captcha-fail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  🔄 Text changes every 0.8 seconds. Speed is key! (It's not.)
                </motion.p>
              </motion.div>
            )}

            {step === "checkbox" && (
              <motion.div
                key="checkbox"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="captcha-checkbox-step"
              >
                <p className="captcha-instruction">Just check the box. Easy, right?</p>
                <div className="captcha-checkbox-area">
                  <motion.div
                    className="captcha-checkbox-wrapper"
                    animate={{ x: checkboxPos.x, y: checkboxPos.y }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onMouseEnter={handleCheckboxHover}
                    onClick={handleCheckboxClick}
                  >
                    <div className={`captcha-fake-checkbox ${checkboxDodges >= 5 ? "catchable" : ""}`}>
                      {checkboxDodges >= 5 ? "✓" : ""}
                    </div>
                    <span>I'm not a robot</span>
                  </motion.div>
                </div>
                {checkboxDodges > 0 && checkboxDodges < 5 && (
                  <motion.p className="captcha-fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Dodges: {checkboxDodges}/5 — Almost there!
                  </motion.p>
                )}
              </motion.div>
            )}

            {step === "passed" && (
              <motion.div
                key="passed"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="captcha-passed"
              >
                <div className="captcha-passed-emoji">🎉</div>
                <h3>Congratulations!</h3>
                <p>You failed the CAPTCHA 3 different ways.</p>
                <p className="captcha-passed-sub">You're definitely human. 🧍</p>
                <button
                  className="captcha-dismiss-btn"
                  onClick={() => { setDismissed(true); setVisible(false); }}
                >
                  I Accept My Fate
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
