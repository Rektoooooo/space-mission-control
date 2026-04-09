import { useRef, useCallback } from "react";

const SOUNDS = {
  beep: "/sounds/beep.mp3",
  launch: "/sounds/launch.mp3",
  complete: "/sounds/complete.mp3",
};

export function useSounds() {
  const audioRefs = useRef({});

  const play = useCallback((name, { volume = 0.5 } = {}) => {
    try {
      // Create a new Audio each time so overlapping plays work
      const audio = new Audio(SOUNDS[name]);
      audio.volume = volume;
      audio.play().catch(() => {});
      audioRefs.current[name] = audio;
    } catch {
      // Ignore audio errors (e.g. browser blocks autoplay)
    }
  }, []);

  const stop = useCallback((name) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  return { play, stop };
}
