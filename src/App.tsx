import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FakeLoader from "./components/FakeLoader";
import ShuffleNav from "./components/ShuffleNav";
import HeroScene from "./components/HeroScene";
import RunawayButton from "./components/RunawayButton";
import GravityCards from "./components/GravityCards";
import PrankForm from "./components/PrankForm";
import FakeNotification from "./components/FakeNotification";
import DarkModeOverlay from "./components/DarkModeOverlay";
import GrandFinale from "./components/GrandFinale";
import FloatingHomeButton from "./components/FloatingHomeButton";
import CursorChaos from "./components/CursorChaos";
import ImpossibleCaptcha from "./components/ImpossibleCaptcha";
import FakeBSOD from "./components/FakeBSOD";
import HonestCookieBanner from "./components/HonestCookieBanner";
import KonamiEasterEgg from "./components/KonamiEasterEgg";
import AntiGravityScroll from "./components/AntiGravityScroll";
import GaslightingText from "./components/GaslightingText";
import PhantomTyper from "./components/PhantomTyper";
import ShrinkingPage from "./components/ShrinkingPage";
import ClippyAssistant from "./components/ClippyAssistant";
import RightClickMenu from "./components/RightClickMenu";
import PrankWheel from "./components/PrankWheel";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [heroEntered, setHeroEntered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showFinale, setShowFinale] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode(true);
  };

  const handleDarkModeComplete = useCallback(() => {
    setDarkMode(false);
  }, []);

  // Track current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "features", "wheel", "form", "finale"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect reaching the finale section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFinale(true);
        }
      },
      { threshold: 0.5 }
    );

    const finaleSection = document.getElementById("finale");
    if (finaleSection) observer.observe(finaleSection);

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="app">
      {/* Fake Loading Screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FakeLoader onComplete={handleLoadComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!loading && (
        <motion.div
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Navigation */}
          <ShuffleNav
            onDarkModeToggle={handleDarkModeToggle}
            currentSection={currentSection}
          />

          {/* === NEW PRANK LAYERS === */}
          <CursorChaos />
          <ImpossibleCaptcha />
          <FakeBSOD />
          <HonestCookieBanner />
          <KonamiEasterEgg />
          <AntiGravityScroll />
          <GaslightingText />
          <PhantomTyper />
          <ShrinkingPage />
          <ClippyAssistant />
          <RightClickMenu />

          {/* Floating Runaway Home Button */}
          <FloatingHomeButton />

          {/* Fake System Notification */}
          <FakeNotification />

          {/* Dark Mode Overlay */}
          <DarkModeOverlay active={darkMode} onComplete={handleDarkModeComplete} />

          {/* Hero Section */}
          <section id="hero" className="section hero-section">
            <HeroScene />
            <div className="hero-content">
              <motion.div
                className="hero-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                🎭 PRANKRAFT 2026
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                The World's Most
                <br />
                <span className="gradient-text">Trustworthy</span>
                <br />
                Website
              </motion.h1>

              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Nothing suspicious here. Everything works exactly as expected.
                <br />
                <span className="hero-wink">We promise. 😉</span>
              </motion.p>

              {!heroEntered ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <RunawayButton onCatch={() => setHeroEntered(true)} />
                </motion.div>
              ) : (
                <motion.div
                  className="hero-entered"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <p>🎉 You caught it! Scroll down for more surprises...</p>
                  <motion.div
                    className="scroll-indicator"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ↓
                  </motion.div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="section features-section">
            <motion.div
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">
                <span className="gradient-text">Features</span> That Definitely Work
              </h2>
              <p className="section-subtitle">
                Click a card. We dare you. 😏
              </p>
            </motion.div>
            <GravityCards />
          </section>

          {/* Prank Wheel Section */}
          <section id="wheel" className="section">
            <motion.div
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">
                <span className="gradient-text">Wheel</span> of Misfortune
              </h2>
              <p className="section-subtitle">
                Spin to win amazing prizes! Totally real prizes! 🎡
              </p>
            </motion.div>
            <PrankWheel />
          </section>

          {/* Contact Section */}
          <section id="form" className="section form-section">
            <motion.div
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">
                <span className="gradient-text">Contact</span> Us
              </h2>
              <p className="section-subtitle">
                Your message is very important to us. Totally.
              </p>
            </motion.div>
            <PrankForm />
          </section>

          {/* Grand Finale Section */}
          <section id="finale" className="section finale-section">
            {!showFinale && (
              <motion.div
                className="finale-teaser"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">
                  <span className="gradient-text">The End?</span>
                </h2>
                <p className="section-subtitle">Or is it just the beginning... 🎭</p>
              </motion.div>
            )}
            <GrandFinale triggered={showFinale} />
          </section>

          {/* Footer */}
          <footer className="footer">
            <p>Made with 🤡 for PRANKRAFT 2026 | Happy April Fools!</p>
            <p className="footer-small">No users were harmed in the making of this website</p>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
