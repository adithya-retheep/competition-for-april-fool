import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPop, playBoing, playVineBoom } from "../utils/soundEffects";

const menuItems = [
  { label: "🔍 Inspect Your Life Choices", action: "shake" },
  { label: "📋 Copy My Homework", action: "flip" },
  { label: "🔄 Refresh Your Attitude", action: "spin" },
  { label: "🍝 View Page Sauce", action: "emoji-rain" },
  { label: "💾 Save As... Just Kidding", action: "shrink" },
  { label: "🖨️ Print (on a typewriter)", action: "typewriter" },
  { label: "🔗 Share With Your Enemies", action: "confetti" },
  { label: "🪲 Report a Feature", action: "boom" },
];

export default function RightClickMenu() {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [emojiRain, setEmojiRain] = useState<{ id: number; x: number; emoji: string }[]>([]);
  const emojiId = { current: 0 };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      playPop();
    };

    const handleClick = () => setVisible(false);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const triggerAction = (action: string) => {
    setVisible(false);
    const root = document.getElementById("root");

    switch (action) {
      case "shake":
        playBoing();
        if (root) {
          root.style.animation = "menuShake 0.5s ease";
          setTimeout(() => { root.style.animation = ""; }, 500);
        }
        break;

      case "flip":
        playVineBoom();
        if (root) {
          root.style.transition = "transform 1s ease";
          root.style.transform = "scaleX(-1)";
          setTimeout(() => { root.style.transform = ""; }, 2000);
        }
        break;

      case "spin":
        playBoing();
        if (root) {
          root.style.transition = "transform 1s ease";
          root.style.transform = "rotate(360deg)";
          setTimeout(() => { root.style.transition = "none"; root.style.transform = ""; }, 1000);
        }
        break;

      case "emoji-rain":
        playPop();
        const emojis = ["🍝", "🍕", "🌮", "🍔", "🍟", "🌭", "🍩", "🧁"];
        for (let i = 0; i < 30; i++) {
          setTimeout(() => {
            emojiId.current++;
            setEmojiRain((prev) => [...prev.slice(-25), {
              id: emojiId.current,
              x: Math.random() * window.innerWidth,
              emoji: emojis[Math.floor(Math.random() * emojis.length)],
            }]);
          }, i * 100);
        }
        break;

      case "shrink":
        playPop();
        if (root) {
          root.style.transition = "transform 0.5s ease";
          root.style.transform = "scale(0.5)";
          setTimeout(() => {
            root.style.transform = "";
          }, 1500);
        }
        break;

      case "boom":
        playVineBoom();
        break;

      default:
        playPop();
    }


  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="custom-context-menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ left: pos.x, top: pos.y }}
          >
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                className="context-menu-item"
                onClick={(e) => { e.stopPropagation(); triggerAction(item.action); }}
                whileHover={{ backgroundColor: "rgba(0,255,255,0.15)", x: 4 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji rain */}
      {emojiRain.map((e) => (
        <motion.div
          key={e.id}
          style={{ position: "fixed", left: e.x, top: -30, zIndex: 9990, fontSize: "2rem", pointerEvents: "none" }}
          initial={{ y: -30 }}
          animate={{ y: window.innerHeight + 50, rotate: Math.random() * 360 }}
          transition={{ duration: 2 + Math.random(), ease: "linear" }}
        >
          {e.emoji}
        </motion.div>
      ))}
    </>
  );
}
