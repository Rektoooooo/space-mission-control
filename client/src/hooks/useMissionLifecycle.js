import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  COUNTDOWN_DURATION,
  TRAVEL_TIMES,
  EXPLORE_TIMES,
  ACTIVE_STATUSES,
} from "@/lib/missionConstants";

export function useMissionLifecycles(missions, onTransition) {
  const [lifecycles, setLifecycles] = useState({});
  const transitioningRef = useRef(new Set());
  const onTransitionRef = useRef(onTransition);
  onTransitionRef.current = onTransition;

  // Stabilize: only re-run when active missions actually change
  const activeMissions = useMemo(() => {
    return missions.filter(
      (m) => ACTIVE_STATUSES.includes(m.status) && m.phaseStartedAt
    );
  }, [missions]);

  const activeKey = useMemo(() => {
    return activeMissions
      .map((m) => `${m._id}:${m.status}:${m.phaseStartedAt}`)
      .join("|");
  }, [activeMissions]);

  useEffect(() => {
    if (activeMissions.length === 0) {
      setLifecycles({});
      return;
    }

    // Immediately clear stale data when phases change
    setLifecycles({});

    const interval = setInterval(() => {
      const now = Date.now();
      const newState = {};

      for (const mission of activeMissions) {
        const startTime = new Date(mission.phaseStartedAt).getTime();
        const elapsedMs = now - startTime;
        const elapsedSec = elapsedMs / 1000;

        if (
          mission.status === "Preparing" ||
          mission.status === "PreparingReturn"
        ) {
          const remaining = Math.max(0, COUNTDOWN_DURATION - elapsedSec);
          newState[mission._id] = {
            countdown: Math.ceil(remaining),
            countdownDone: remaining <= 0,
            progress:
              (Math.min(elapsedMs, COUNTDOWN_DURATION * 1000) /
                (COUNTDOWN_DURATION * 1000)) *
              100,
            elapsed: elapsedSec,
            totalDuration: COUNTDOWN_DURATION,
          };
          // Auto-launch when countdown finishes (only for Preparing, not PreparingReturn)
          // PreparingReturn waits for the Rocket component to find the Earth-facing orbit angle
          if (
            remaining <= 0 &&
            mission.status === "Preparing" &&
            !transitioningRef.current.has(mission._id)
          ) {
            transitioningRef.current.add(mission._id);
            onTransitionRef.current(mission._id, "Traveling")
              .catch((err) => console.error("Auto-launch failed:", err))
              .finally(() => transitioningRef.current.delete(mission._id));
          }
        } else if (
          mission.status === "Traveling" ||
          mission.status === "Returning"
        ) {
          const duration = TRAVEL_TIMES[mission.destination];
          const pct = Math.min(100, (elapsedSec / duration) * 100);
          newState[mission._id] = {
            progress: pct,
            elapsed: Math.min(elapsedSec, duration),
            totalDuration: duration,
          };
          if (
            pct >= 100 &&
            !transitioningRef.current.has(mission._id)
          ) {
            transitioningRef.current.add(mission._id);
            const next =
              mission.status === "Traveling" ? "Exploring" : "Completed";
            onTransitionRef.current(mission._id, next)
              .catch((err) => console.error("Auto-transition failed:", err))
              .finally(() => transitioningRef.current.delete(mission._id));
          }
        } else if (mission.status === "Exploring") {
          const duration = EXPLORE_TIMES[mission.destination];
          const pct = Math.min(100, (elapsedSec / duration) * 100);
          newState[mission._id] = {
            progress: pct,
            elapsed: Math.min(elapsedSec, duration),
            totalDuration: duration,
            exploringDone: pct >= 100,
          };
        }
      }

      setLifecycles(newState);
    }, 100);

    return () => clearInterval(interval);
  }, [activeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return lifecycles;
}
