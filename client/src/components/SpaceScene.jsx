import { useState, useEffect, useMemo } from "react";
import Starfield from "./Starfield";
import Earth from "./Earth";
import Planet from "./Planet";
import Rocket from "./Rocket";
import { ROCKET_VISIBLE_STATUSES, ACTIVE_STATUSES } from "@/lib/missionConstants";

const PLANET_LAYOUT = [
  { name: "Moon", style: { left: "22%", top: "6%" } },
  { name: "Mars", style: { right: "18%", top: "8%" } },
  { name: "Europa", style: { left: "5%", top: "38%" } },
  { name: "Titan", style: { right: "5%", top: "36%" } },
  { name: "Venus", style: { right: "10%", top: "56%" } },
  { name: "Saturn", style: { left: "6%", top: "58%" } },
];

/**
 * Derive the "dominant" visual phase from all active missions.
 * Priority: launch flash > countdown > traveling > exploring > returning > idle
 */
function useScenePhase(missions, lifecycles) {
  const [launchFlash, setLaunchFlash] = useState(false);
  const [completionFlash, setCompletionFlash] = useState(false);
  const prevStatusesRef = useMemo(() => ({ current: {} }), []);

  // Detect transitions: Preparing -> Traveling (launch) and Returning -> Completed
  useEffect(() => {
    const prevStatuses = prevStatusesRef.current;
    for (const m of missions) {
      const prev = prevStatuses[m._id];
      if (prev === "Preparing" && m.status === "Traveling") {
        setLaunchFlash(true);
        setTimeout(() => setLaunchFlash(false), 700);
      }
      if (prev === "PreparingReturn" && m.status === "Returning") {
        setLaunchFlash(true);
        setTimeout(() => setLaunchFlash(false), 700);
      }
      if (prev === "Returning" && m.status === "Completed") {
        setCompletionFlash(true);
        setTimeout(() => setCompletionFlash(false), 4500);
      }
      prevStatuses[m._id] = m.status;
    }
  }, [missions, prevStatusesRef]);

  const hasStatus = (status) => missions.some((m) => m.status === status);
  const hasTraveling = hasStatus("Traveling") || hasStatus("Returning");
  const hasCountdown = hasStatus("Preparing") || hasStatus("PreparingReturn");
  const hasExploring = hasStatus("Exploring");

  // Countdown urgency: last 3 seconds get extra vibration
  const isCountdownUrgent = Object.values(lifecycles).some(
    (lc) => lc.countdown !== undefined && lc.countdown <= 3 && !lc.countdownDone
  );

  // Destinations currently being explored
  const exploringDestinations = new Set(
    missions
      .filter((m) => m.status === "Exploring")
      .map((m) => m.destination)
  );

  return {
    launchFlash,
    completionFlash,
    hasTraveling,
    hasCountdown,
    hasExploring,
    isCountdownUrgent,
    exploringDestinations,
  };
}

export default function SpaceScene({
  missions = [],
  lifecycles = {},
  selectedDestination,
  onPlanetClick,
}) {
  const rocketMissions = missions.filter((m) =>
    ROCKET_VISIBLE_STATUSES.includes(m.status)
  );

  const getMissionCount = (planetName) =>
    missions.filter(
      (m) =>
        m.destination === planetName && ACTIVE_STATUSES.includes(m.status)
    ).length;

  const phase = useScenePhase(missions, lifecycles);

  // Build scene CSS classes
  const sceneClasses = [
    "fixed inset-0 z-0",
    phase.launchFlash ? "scene-shake" : "",
    phase.isCountdownUrgent ? "scene-vibrate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Earth visual phase
  let earthPhase = "idle";
  if (phase.completionFlash) earthPhase = "complete";
  else if (phase.launchFlash) earthPhase = "launch";
  else if (phase.hasCountdown) earthPhase = "countdown";

  return (
    <div className={sceneClasses}>
      <Starfield warp={phase.hasTraveling} />
      {phase.launchFlash && <div className="launch-flash-overlay" />}
      {phase.hasCountdown && <div className="warning-lights" />}
      <Earth phase={earthPhase} />
      {PLANET_LAYOUT.map((planet) => (
        <Planet
          key={planet.name}
          name={planet.name}
          style={planet.style}
          isActive={
            selectedDestination === planet.name ||
            getMissionCount(planet.name) > 0
          }
          isExploring={phase.exploringDestinations.has(planet.name)}
          missionCount={getMissionCount(planet.name)}
          onClick={() => onPlanetClick?.(planet.name)}
        />
      ))}
      {rocketMissions.map((mission) => (
        <Rocket
          key={mission._id}
          mission={mission}
          lifecycle={lifecycles[mission._id]}
        />
      ))}
    </div>
  );
}
