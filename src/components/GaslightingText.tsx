import { useState, useEffect, useRef } from "react";

interface TextVariant {
  original: string;
  variants: string[];
}

const gaslightTexts: TextVariant[] = [
  {
    original: "Features That Definitely Work",
    variants: [
      "Features That Might Work",
      "Features That Sometimes Work",
      "Features? What Features?",
      "Bugs That Definitely Exist",
    ],
  },
  {
    original: "Click a card. We dare you. 😏",
    variants: [
      "Click a card. Or don't. We don't care.",
      "Don't click anything. Seriously.",
      "The cards are watching you. 👀",
      "What cards? There are no cards.",
    ],
  },
  {
    original: "Your message is very important to us. Totally.",
    variants: [
      "Your message is somewhat important. Maybe.",
      "Your message will be ignored. Sorry.",
      "lol nobody reads these",
      "Your message has been forwarded to /dev/null",
    ],
  },
  {
    original: "Nothing suspicious here.",
    variants: [
      "Everything suspicious here.",
      "Something may or may not be suspicious.",
      "We are definitely hiding something.",
      "Don't look behind the curtain. 🎭",
    ],
  },
];

export default function GaslightingText() {
  const [variantIndices, setVariantIndices] = useState<number[]>(
    gaslightTexts.map(() => -1) // -1 = original text
  );
  const scrollCountRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollCountRef.current++;

      // Every few scrolls, change a random text
      if (scrollCountRef.current % 4 === 0) {
        setVariantIndices((prev) => {
          const next = [...prev];
          const textIdx = Math.floor(Math.random() * gaslightTexts.length);
          const currentVariant = next[textIdx];
          const maxVariant = gaslightTexts[textIdx].variants.length - 1;

          // Progress through variants
          next[textIdx] = Math.min(currentVariant + 1, maxVariant);
          return next;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getText = (index: number): string => {
    const variantIdx = variantIndices[index];
    if (variantIdx < 0) return gaslightTexts[index].original;
    return gaslightTexts[index].variants[variantIdx];
  };

  // This component injects invisible watchers — the actual text replacement
  // happens via a portal / mutation observer approach
  // But for simplicity, we expose a global function
  useEffect(() => {
    // Expose gaslight function globally
    (window as any).__gaslightText = getText;
    (window as any).__gaslightIndices = variantIndices;
  }, [variantIndices]);

  // Directly mutate DOM text for maximum gaslighting
  useEffect(() => {
    const updateTexts = () => {
      // Find and replace section subtitles
      const subtitles = document.querySelectorAll(".section-subtitle");

      subtitles.forEach((el) => {
        const text = el.textContent || "";
        gaslightTexts.forEach((gt, i) => {
          if (text.includes(gt.original) || gt.variants.some(v => text.includes(v))) {
            const newText = getText(i);
            if (el.textContent !== newText && gt.variants.some(v => v === newText)) {
              // Subtle fade
              (el as HTMLElement).style.transition = "opacity 0.3s";
              (el as HTMLElement).style.opacity = "0";
              setTimeout(() => {
                el.textContent = newText;
                (el as HTMLElement).style.opacity = "1";
              }, 300);
            }
          }
        });
      });
    };

    const interval = setInterval(updateTexts, 2000);
    return () => clearInterval(interval);
  }, [variantIndices]);

  return null; // This component works invisibly
}
