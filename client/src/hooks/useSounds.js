import { useRef, useCallback } from "react";

const SOUNDS = {
  launch: "/sounds/launch.mp3",
  complete: "/sounds/complete.mp3",
};

// Generate a short NASA-style beep using Web Audio API
function playBeep(volume = 0.25) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.value = volume;
    gain.gain.setTargetAtTime(0, ctx.currentTime + 0.1, 0.02);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore
  }
}

export function useSounds() {
  const play = useCallback((name, { volume = 0.5 } = {}) => {
    if (name === "beep") {
      playBeep(volume);
      return;
    }
    try {
      const audio = new Audio(SOUNDS[name]);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {
      // Ignore audio errors
    }
  }, []);

  return { play };
}
