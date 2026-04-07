import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CursorPhase = "trail" | "invert" | "clone" | "clown";

export default function CursorChaos() {
  const [phase, setPhase] = useState<CursorPhase>("trail");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const [clones, setClones] = useState<{ x: number; y: number }[]>([]);
  const [phaseMessage, setPhaseMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const trailId = useRef(0);
  const realMouseRef = useRef({ x: 0, y: 0 });

  const showPhaseMsg = useCallback((msg: string) => {
    setPhaseMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500);
  }, []);

  // Phase progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => {
      setPhase("invert");
      showPhaseMsg("⚠️ Cursor Inverted!");
    }, 20000));

    timers.push(setTimeout(() => {
      setPhase("clone");
      showPhaseMsg("👀 Cursor Multiplied!");
    }, 35000));

    timers.push(setTimeout(() => {
      setPhase("clown");
      showPhaseMsg("🤡 Cursor Evolved!");
    }, 50000));

    // Reset back to trail after full cycle
    timers.push(setTimeout(() => {
      setPhase("trail");
      showPhaseMsg("🔄 Cursor Reset... or did it?");
    }, 65000));

    return () => timers.forEach(clearTimeout);
  }, [showPhaseMsg]);

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      realMouseRef.current = { x: e.clientX, y: e.clientY };

      if (phase === "invert") {
        setMousePos({
          x: window.innerWidth - e.clientX,
          y: window.innerHeight - e.clientY,
        });
      } else {
        setMousePos({ x: e.clientX, y: e.clientY });
      }

      // Trail
      if (phase === "trail" || phase === "clown") {
        trailId.current++;
        setTrail((prev) => [
          ...prev.slice(-12),
          { x: e.clientX, y: e.clientY, id: trailId.current },
        ]);
      }

      // Clones follow with offset
      if (phase === "clone") {
        setClones([
          { x: e.clientX + 40, y: e.clientY + 20 },
          { x: e.clientX - 30, y: e.clientY + 35 },
          { x: e.clientX + 20, y: e.clientY - 40 },
          { x: e.clientX - 45, y: e.clientY - 15 },
        ]);
      }
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [phase]);

  // Clean trail periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(-8));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Hide real cursor globally
  useEffect(() => {
    if (phase === "invert" || phase === "clone" || phase === "clown") {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => { document.body.style.cursor = "auto"; };
  }, [phase]);

  const trailColors = [
    "#ff0000", "#ff7700", "#ffff00", "#00ff00",
    "#00ffff", "#0077ff", "#7700ff", "#ff00ff",
    "#ff0077", "#ff3366", "#33ff99", "#9933ff",
  ];

  return (
    <>
      {/* Rainbow trail */}
      {(phase === "trail" || phase === "clown") &&
        trail.map((point, i) => (
          <motion.div
            key={point.id}
            className="cursor-trail-dot"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed",
              left: point.x - 4,
              top: point.y - 4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: trailColors[i % trailColors.length],
              pointerEvents: "none",
              zIndex: 9998,
              boxShadow: `0 0 6px ${trailColors[i % trailColors.length]}`,
            }}
          />
        ))}

      {/* Fake cursor for invert mode */}
      {phase === "invert" && (
        <motion.div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 9999,
            pointerEvents: "none",
            fontSize: "24px",
          }}
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          🔀
        </motion.div>
      )}

      {/* Clone cursors */}
      {phase === "clone" && (
        <>
          {/* Real cursor */}
          <div
            style={{
              position: "fixed",
              left: mousePos.x - 6,
              top: mousePos.y - 2,
              zIndex: 9999,
              pointerEvents: "none",
              width: 0,
              height: 0,
              borderLeft: "6px solid white",
              borderRight: "6px solid transparent",
              borderBottom: "10px solid transparent",
              borderTop: "10px solid white",
              filter: "drop-shadow(0 0 2px rgba(0,255,255,0.5))",
            }}
          />
          {/* Fake clones */}
          {clones.map((clone, i) => (
            <motion.div
              key={i}
              animate={{ x: clone.x, y: clone.y }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: (i + 1) * 0.03 }}
              style={{
                position: "fixed",
                left: -6,
                top: -2,
                zIndex: 9999,
                pointerEvents: "none",
                width: 0,
                height: 0,
                borderLeft: "6px solid rgba(255,255,255,0.6)",
                borderRight: "6px solid transparent",
                borderBottom: "10px solid transparent",
                borderTop: "10px solid rgba(255,255,255,0.6)",
                filter: `drop-shadow(0 0 4px ${trailColors[i * 3]})`,
              }}
            />
          ))}
        </>
      )}

      {/* Clown cursor */}
      {phase === "clown" && (
        <motion.div
          style={{
            position: "fixed",
            left: mousePos.x - 12,
            top: mousePos.y - 12,
            zIndex: 9999,
            pointerEvents: "none",
            fontSize: "24px",
          }}
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          🤡
        </motion.div>
      )}

      {/* Phase transition message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="cursor-phase-msg"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring" }}
          >
            {phaseMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
