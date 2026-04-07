// Sound effects manager using Web Audio API
// Generates trending meme sounds synthetically - no external files needed!

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isUnlocked = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    // Master volume boost
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.5;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Get the output node (routes through master gain for volume boost)
function getOutput(): AudioNode {
  const ctx = getAudioContext();
  return masterGain || ctx.destination;
}

// CRITICAL: Browsers require a user gesture (click/touch/keydown) to unlock AudioContext.
// mouseenter does NOT count! This function must be called once from App on first interaction.
export function unlockAudio() {
  if (isUnlocked) return;
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  // Play a silent buffer to fully unlock
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
  isUnlocked = true;
  console.log("🔊 Audio unlocked!");
}

// ============ "FAHH" MEME SOUND (Viral Version) ============
// This uses the authentic viral "Fahh" sound from the YouTube Short provided
const FAHH_URL = "https://www.myinstants.com/media/sounds/faaah.mp3";
let fahhAudio: HTMLAudioElement | null = null;

export function playFahh() {
  if (!fahhAudio) {
    fahhAudio = new Audio(FAHH_URL);
    fahhAudio.volume = 0.8;
  }
  
  // Clone and play to allow rapid repeated triggers
  const playInstance = fahhAudio.cloneNode() as HTMLAudioElement;
  playInstance.volume = 0.8;
  playInstance.play().catch(e => {
    console.warn("Failed to play authentic FAHH, falling back to synthetic:", e);
    playSyntheticFahh();
  });
}

// ============ NEW TRENDING SOUNDS ============
const MEME_URLS = {
  emotional: "https://www.myinstants.com/media/sounds/emotional-damage-meme.mp3",
  what: "https://www.myinstants.com/media/sounds/what-the-hell-is-even-that-meme.mp3",
  omg: "https://www.myinstants.com/media/sounds/oh-my-god-meme.mp3",
  huh: "https://www.myinstants.com/media/sounds/huh.mp3",
  shootingStars: "https://www.myinstants.com/media/sounds/shooting-stars.mp3",
};

const memeAudios: Record<string, HTMLAudioElement> = {};

function playMeme(key: keyof typeof MEME_URLS, volume = 0.8) {
  if (!memeAudios[key]) {
    memeAudios[key] = new Audio(MEME_URLS[key]);
  }
  const playInstance = memeAudios[key].cloneNode() as HTMLAudioElement;
  playInstance.volume = volume;
  playInstance.play().catch(e => console.error(`Error playing ${key}:`, e));
  return playInstance;
}

export const playEmotionalDamage = () => playMeme("emotional");
export const playWhatTheHell = () => playMeme("what");
export const playOMG = () => playMeme("omg");
export const playHuh = () => playMeme("huh");
export const playShootingStars = () => playMeme("shootingStars", 1.0);


// Keep synthetic version as a robust fallback
function playSyntheticFahh() {
  const ctx = getAudioContext();
  const out = getOutput();
  const now = ctx.currentTime;

  // === Layer 1: Mid-tone "FAH" vocal formant ===
  const vowelFreqs = [250, 500, 750]; 
  vowelFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.6);

    filter.type = "bandpass";
    filter.frequency.value = freq;
    filter.Q.value = 8;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2 - i * 0.03, now + 0.02);
    gain.gain.setValueAtTime(0.2 - i * 0.03, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.7);
  });
}

// Alias: playVineBoom now triggers the authentic FAHH sound
export const playVineBoom = playFahh;

// ============ LAUGH TRACK ============
export function playLaugh() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Simulate "ha ha ha" with rapid frequency modulation
  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = now + i * 0.15;

    osc.type = "sine";
    osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.06);
    gain.gain.linearRampToValueAtTime(0, t + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Breathy noise layer
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const envelope = Math.sin((i / bufferSize) * Math.PI * 5) * 0.5 + 0.5;
    data[i] = (Math.random() * 2 - 1) * envelope * 0.08;
  }
  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 2;
  noise.buffer = buffer;
  noise.connect(filter);
  filter.connect(ctx.destination);
  noise.start(now);
}

// ============ SAD TROMBONE (wah wah wahhh) ============
export function playSadTrombone() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [
    { freq: 350, start: 0, dur: 0.3 },
    { freq: 330, start: 0.3, dur: 0.3 },
    { freq: 311, start: 0.6, dur: 0.3 },
    { freq: 293, start: 0.9, dur: 0.6 },
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now + start);

    // Vibrato for trombone effect
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 3;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(now + start);
    vibrato.stop(now + start + dur);

    gain.gain.setValueAtTime(0.15, now + start);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + dur);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1000;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + dur);
  });
}

// ============ CLOWN HONK ============
export function playHonk() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(350, now + 0.2);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.setValueAtTime(0.3, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

// ============ BOING / SPRING ============
export function playBoing() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

// ============ WHOOPEE CUSHION / FART ============
export function playWhoopee() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.6;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    const freq = 80 + Math.sin(t * 30) * 30;
    data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 +
              (Math.random() * 2 - 1) * 0.15;
    data[i] *= Math.pow(1 - i / bufferSize, 0.5);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, now);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
}

// ============ POP / CLICK ============
export function playPop() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// ============ VICTORY FANFARE ============
export function playFanfare() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05);
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.12);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.4);
  });
}

// ============ RECORD SCRATCH ============
export function playRecordScratch() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / ctx.sampleRate;
    const freq = 2000 * Math.pow(0.01, t / 0.3);
    data[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 +
              (Math.random() * 2 - 1) * 0.1 * (1 - t / 0.3);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
}

// ============ DING (notification) ============
export function playDing() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 1200;
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

// ============ RANDOM FUNNY SOUND ============
const funnySounds = [
  playFahh, 
  playFahh, 
  playLaugh, 
  playHonk, 
  playBoing, 
  playWhoopee, 
  playPop,
  playEmotionalDamage,
  playWhatTheHell,
  playOMG,
  playHuh
];

export function playRandomFunny() {
  const fn = funnySounds[Math.floor(Math.random() * funnySounds.length)];
  fn();
}
