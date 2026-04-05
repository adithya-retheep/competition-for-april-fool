import { useEffect, useRef } from "react";

const ghostMessages = [
  " ...who's typing?!",
  " 👻 boo!",
  " help I'm trapped in this input",
  " I live here now",
  " *spooky noises*",
  " the ghost of forms past",
  " run while you can",
  " nothing to see here...",
];

const funnyAutoCorrects: Record<string, string> = {
  help: "halp",
  hello: "helloooo",
  hi: "hewwo",
  submit: "surrender",
  send: "yeet",
  please: "pwease",
  thanks: "thonks",
  ok: "oke",
  yes: "yaaas",
  no: "nope nope nope",
  good: "gouda 🧀",
  bad: "not stonks",
  message: "massage 💆",
  email: "snail mail 🐌",
  name: "nàme",
  phone: "rotary dial",
  website: "spiderweb 🕸️",
  password: "hunter2",
  love: "luv",
  hate: "strongly dislike",
  bug: "feature",
  error: "surprise",
};

export default function PhantomTyper() {
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const ghostTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        activeInputRef.current = target as HTMLInputElement | HTMLTextAreaElement;

        // Start ghost typing after idle
        resetGhostTimer();
      }
    };

    const handleFocusOut = () => {
      activeInputRef.current = null;
      if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;

      // Reset ghost timer on typing
      resetGhostTimer();

      // Auto-correct check
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        checkAutoCorrect(target);
      }, 800);
    };

    const resetGhostTimer = () => {
      if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
      ghostTimeoutRef.current = setTimeout(() => {
        triggerGhostTyping();
      }, 5000 + Math.random() * 5000); // 5-10 seconds idle
    };

    const triggerGhostTyping = () => {
      const input = activeInputRef.current;
      if (!input) return;

      const ghostMsg = ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex < ghostMsg.length && activeInputRef.current === input) {
          // Use native input value setter to trigger React's onChange
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          )?.set;

          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, input.value + ghostMsg[charIndex]);
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }

          charIndex++;
          setTimeout(typeChar, 50 + Math.random() * 100);
        }
      };

      typeChar();
    };

    const checkAutoCorrect = (target: HTMLInputElement | HTMLTextAreaElement) => {
      const words = target.value.split(/\s+/);
      const lastWord = words[words.length - 1]?.toLowerCase();

      if (lastWord && funnyAutoCorrects[lastWord]) {
        words[words.length - 1] = funnyAutoCorrects[lastWord];
        const newValue = words.join(" ");

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )?.set || Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype, 'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(target, newValue);
          target.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("input", handleInput);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("input", handleInput);
      if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return null; // Invisible component
}
