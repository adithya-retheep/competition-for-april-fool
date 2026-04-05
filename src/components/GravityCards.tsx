import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { playVineBoom, playPop } from "../utils/soundEffects";

const features = [
  {
    id: 1,
    emoji: "🪄",
    title: "Magic Buttons",
    description: "Buttons that have a mind of their own. Try clicking them... if you can!",
    color: "#00ffff",
  },
  {
    id: 2,
    emoji: "🌀",
    title: "Reality Bender",
    description: "What you see isn't always what you get. Things aren't quite as they seem.",
    color: "#ff00ff",
  },
  {
    id: 3,
    emoji: "🎭",
    title: "Identity Crisis",
    description: "Elements that forget their purpose. Labels that lie. Forms that fight back.",
    color: "#ffd700",
  },
  {
    id: 4,
    emoji: "🌙",
    title: "Dark Side",
    description: "Toggle dark mode... but maybe not the dark mode you were expecting.",
    color: "#ff6b35",
  },
  {
    id: 5,
    emoji: "🔔",
    title: "Fake Alerts",
    description: "System notifications that look real but are hilariously fake.",
    color: "#7b68ee",
  },
  {
    id: 6,
    emoji: "🎪",
    title: "Grand Finale",
    description: "Reach the end for a surprise you won't forget. We promise it's worth it!",
    color: "#ff69b4",
  },
];

export default function GravityCards() {
  const [hasDropped, setHasDropped] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [swappedCards, setSwappedCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => { setHasDropped(true); playVineBoom(); }, 1500);
          // Reset after the drop
          setTimeout(() => setHasDropped(false), 3500);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("features");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (id: number) => {
    // Swap this card with a random other card
    const otherIds = features.filter((f) => f.id !== id).map((f) => f.id);
    const randomOther = otherIds[Math.floor(Math.random() * otherIds.length)];
    setSwappedCards([id, randomOther]);
    playPop();
    setTimeout(() => setSwappedCards([]), 600);
  };

  return (
    <div className="gravity-cards-grid">
      {features.map((feature, index) => (
        <motion.div
          key={feature.id}
          className="gravity-card"
          layout
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, type: "spring" }}
          animate={
            hasDropped
              ? {
                  y: [0, -50, 300],
                  rotate: [0, -10, 180],
                  opacity: [1, 1, 0],
                }
              : swappedCards.includes(feature.id)
              ? { scale: [1, 0.8, 1], rotate: [0, 360, 0] }
              : {}
          }
          onMouseEnter={() => setHoveredCard(feature.id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => handleCardClick(feature.id)}
          whileHover={{ scale: 1.05, y: -10 }}
          style={{
            borderColor: hoveredCard === feature.id ? feature.color : "rgba(255,255,255,0.1)",
            boxShadow:
              hoveredCard === feature.id
                ? `0 0 30px ${feature.color}40, 0 20px 40px rgba(0,0,0,0.3)`
                : "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <motion.div
            className="card-emoji"
            animate={
              hoveredCard === feature.id
                ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.3, 1] }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            {feature.emoji}
          </motion.div>
          <h3 className="card-title">{feature.title}</h3>
          <p className="card-desc">{feature.description}</p>
          <div className="card-glow" style={{ background: feature.color }} />
        </motion.div>
      ))}
    </div>
  );
}
