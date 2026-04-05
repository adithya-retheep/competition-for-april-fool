import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playWhoopee, playBoing, playSadTrombone, playRecordScratch } from "../utils/soundEffects";

export default function PrankForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitBtnPos, setSubmitBtnPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [labelSwapped, setLabelSwapped] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxDodges = 3;

  // Swap labels on first focus
  const handleFirstFocus = () => {
    if (!labelSwapped) {
      setLabelSwapped(true);
    }
  };

  // Auto-fill name field cheekily
  const handleNameFocus = () => {
    handleFirstFocus();
    if (name === "") {
      setShakeField("name");
      playWhoopee();
      setTimeout(() => {
        setName("April Fool 🤡");
        setShakeField(null);
      }, 500);
    }
  };

  // Email field prank
  const handleEmailFocus = () => {
    handleFirstFocus();
    if (email === "") {
      setShakeField("email");
      playRecordScratch();
      setTimeout(() => {
        setEmail("definitely@not.real");
        setShakeField(null);
      }, 500);
    }
  };

  // Submit button dodges
  const handleSubmitHover = () => {
    if (submitted) return;
    if (dodgeCount >= maxDodges) return;

    const container = containerRef.current;
    if (!container) return;

    const newX = (Math.random() - 0.5) * 200;
    const newY = (Math.random() - 0.5) * 80;

    setSubmitBtnPos({ x: newX, y: newY });
    setDodgeCount((prev) => prev + 1);
    playBoing();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    playSadTrombone();
  };

  return (
    <div className="prank-form-container" ref={containerRef}>
      <motion.div
        className="prank-form"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="form-title">📬 Send Us a Message</h2>
        <p className="form-subtitle">
          {submitted
            ? "Message sent to: Nobody 🤡"
            : labelSwapped
            ? "Wait... those labels weren't like that before..."
            : "We'd love to hear from you!"}
        </p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" exit={{ opacity: 0, rotateX: 90 }}>
              <div className="form-field">
                <label>{labelSwapped ? "📧 Email" : "👤 Your Name"}</label>
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleNameFocus}
                  placeholder="Type your name..."
                  animate={shakeField === "name" ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="form-field">
                <label>{labelSwapped ? "👤 Your Name" : "📧 Email"}</label>
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  placeholder="your@email.com"
                  animate={shakeField === "email" ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="form-field">
                <label>💬 Message</label>
                <motion.textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something nice..."
                  rows={4}
                />
              </div>

              <div className="submit-area">
                <motion.button
                  className="submit-btn"
                  animate={{
                    x: submitBtnPos.x,
                    y: submitBtnPos.y,
                    scale: dodgeCount >= maxDodges ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onMouseEnter={handleSubmitHover}
                  onClick={handleSubmit}
                  whileTap={{ scale: 0.9 }}
                >
                  {dodgeCount >= maxDodges
                    ? "Fine, click me 😤"
                    : dodgeCount > 0
                    ? `Can't catch me! (${dodgeCount}/${maxDodges})`
                    : "Send Message 🚀"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="form-success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="success-emoji">🎉</div>
              <h3>Gotcha!</h3>
              <p>Your message was sent to the void.</p>
              <p className="success-detail">
                Name: {name}<br />
                Email: {email}<br />
                Status: Successfully pranked ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
