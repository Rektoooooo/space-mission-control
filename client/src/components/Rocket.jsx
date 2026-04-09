import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import rocket1Img from "@/assets/rockets/rocket1.png";
import rocket2Img from "@/assets/rockets/rocket2.png";
import rocket3Img from "@/assets/rockets/rocket3.png";
import landerImg from "@/assets/rockets/lander.png";
import { ROCKET_VISIBLE_STATUSES } from "@/lib/missionConstants";

const ROCKET_IMAGES = {
  falcon9: rocket1Img,
  shuttle: rocket2Img,
  saturnV: rocket3Img,
};

const PLANET_POSITIONS = {
  Moon: { x: 22, y: 6 },
  Mars: { x: 80, y: 8 },
  Europa: { x: 8, y: 38 },
  Titan: { x: 92, y: 36 },
  Venus: { x: 88, y: 56 },
  Saturn: { x: 8, y: 58 },
};

const EARTH_POS = { x: 50, y: 35 };

const PLANET_SIZES = {
  Saturn: 120, Mars: 100, Venus: 95, Europa: 85, Titan: 85, Moon: 75,
};

const ORBIT_DURATION = 6;

function ThrusterFlame() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ top: "100%", width: 20 }}>
      <motion.div className="mx-auto rounded-full"
        style={{ width: 6, background: "linear-gradient(to bottom, #fff, #fbbf24, #f97316, transparent)" }}
        animate={{ height: [16, 22, 14, 20, 16], opacity: [0.9, 1, 0.85, 1, 0.9] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{ width: 14, background: "radial-gradient(circle, rgba(251,191,36,0.5), rgba(249,115,22,0.2), transparent)", filter: "blur(3px)" }}
        animate={{ height: [20, 28, 18, 26, 20], opacity: [0.6, 0.8, 0.5, 0.7, 0.6] }}
        transition={{ duration: 0.25, repeat: Infinity, ease: "linear" }}
      />
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 2, height: 2, background: ["#fbbf24", "#f97316", "#fde68a"][i], left: `${8 + (i - 1) * 4}px` }}
          animate={{ top: [14, 28 + i * 6, 14], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 0.5 + i * 0.15, repeat: Infinity, ease: "easeOut", delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

/** Flying rocket (Earth↔Planet) */
function FlyingRocket({ rocketImg, fromX, fromY, toX, toY, progress }) {
  const t = progress / 100;
  const x = fromX + (toX - fromX) * t;
  const y = fromY + (toY - fromY) * t;
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI) + 90;

  return (
    <div className="absolute z-20 pointer-events-none" style={{
      left: `${x}%`, top: `${y}%`,
      transform: "translate(-50%, -50%)",
      transition: "left 0.06s linear, top 0.06s linear",
    }}>
      <div className="relative" style={{ transform: `rotate(${angle}deg)` }}>
        <img src={rocketImg} alt="Rocket"
          className="w-14 h-14 md:w-18 md:h-18 object-contain relative z-10" draggable={false} />
        <ThrusterFlame />
        <motion.div className="absolute inset-0 rounded-full -z-10"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)", margin: "-6px" }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export default function Rocket({ mission, lifecycle, onTransition }) {
  const dest = PLANET_POSITIONS[mission.destination];
  if (!dest || !ROCKET_VISIBLE_STATUSES.includes(mission.status)) return null;

  const isMovementPhase = mission.status === "Traveling" || mission.status === "Returning";
  const progress = isMovementPhase ? (lifecycle?.progress ?? 0) : 0;
  const rocketImg = ROCKET_IMAGES[mission.rocketType] || rocket1Img;

  const planetSize = PLANET_SIZES[mission.destination] || 90;
  const orbitRadius = planetSize / 2 + 30;

  // JS-driven orbit angle (continuous, based on Date.now)
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [modulePickedUp, setModulePickedUp] = useState(false);
  const orbitStartRef = useRef(null);
  const departedRef = useRef(false);

  // Compute the orbit angle where the rocket's nose faces Earth
  // At orbit angle θ, the rocket nose points in direction θ (standard screen coords: right=0, down=π/2)
  // So we need θ = atan2(dy, dx) from planet to Earth
  const earthDirAngle = Math.atan2(EARTH_POS.y - dest.y, EARTH_POS.x - dest.x);
  const departAngle = ((earthDirAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

  // Track orbit start time when entering Exploring
  useEffect(() => {
    if (mission.status === "Exploring" && !orbitStartRef.current) {
      orbitStartRef.current = Date.now();
      setModulePickedUp(false);
      departedRef.current = false;
    }
    if (mission.status !== "Exploring" && mission.status !== "PreparingReturn") {
      orbitStartRef.current = null;
      departedRef.current = false;
    }
  }, [mission.status]);

  // Animate orbit angle
  useEffect(() => {
    if (mission.status !== "Exploring" && mission.status !== "PreparingReturn") return;
    if (!orbitStartRef.current) orbitStartRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - orbitStartRef.current) / 1000;
      const angle = ((elapsed % ORBIT_DURATION) / ORBIT_DURATION) * Math.PI * 2;
      setOrbitAngle(angle);

      // Module pickup: during PreparingReturn, when rocket passes top (angle near 0 or 2PI)
      if (mission.status === "PreparingReturn" && !modulePickedUp) {
        const normalizedAngle = angle % (Math.PI * 2);
        if (normalizedAngle < 0.3 || normalizedAngle > Math.PI * 2 - 0.3) {
          setModulePickedUp(true);
        }
      }

      // Departure: during PreparingReturn, after countdown done, when rocket faces Earth
      if (
        mission.status === "PreparingReturn" &&
        lifecycle?.countdownDone &&
        !departedRef.current &&
        onTransition
      ) {
        const normalizedAngle = angle % (Math.PI * 2);
        // Check if current angle is within 0.2 radians of the Earth-facing angle
        let diff = Math.abs(normalizedAngle - departAngle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < 0.2) {
          departedRef.current = true;
          onTransition(mission._id, "Returning");
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [mission.status, mission._id, modulePickedUp, lifecycle?.countdownDone]);

  // Orbit box setup
  const rocketSize = 44;
  const boxSize = orbitRadius * 2 + rocketSize;
  const center = boxSize / 2;

  // Compute rocket position on orbit circle
  // angle 0 = top, goes clockwise: sin for X offset, -cos for Y offset
  const orbitRocketX = center + Math.sin(orbitAngle) * orbitRadius - rocketSize / 2;
  const orbitRocketY = center - Math.cos(orbitAngle) * orbitRadius - rocketSize / 2;
  // Tangent rotation: nose points along orbit direction (clockwise)
  const orbitRotation = (orbitAngle * 180) / Math.PI;

  // departAngle already computed above

  // Traveling: fly from Earth to orbit entry (top of orbit circle)
  if (mission.status === "Traveling") {
    return (
      <FlyingRocket rocketImg={rocketImg}
        fromX={EARTH_POS.x} fromY={EARTH_POS.y}
        toX={dest.x} toY={dest.y}
        progress={progress}
      />
    );
  }

  // Exploring / PreparingReturn: JS-driven orbit + landing module
  if (mission.status === "Exploring" || mission.status === "PreparingReturn") {
    const exploreProgress = lifecycle?.progress ?? 50;
    const isExploring = mission.status === "Exploring";

    // Lander phases:
    // Exploring 0-8%: descend from orbit to planet
    // Exploring 8-100%: stay landed on planet
    // PreparingReturn 0-30%: ascend from planet to orbit
    // PreparingReturn 30%+: at orbit waiting for rocket pickup
    let landerPhase = null; // null = hidden (docked)
    if (isExploring) {
      if (exploreProgress < 8) landerPhase = "descending";
      else landerPhase = "landed";
    } else {
      // PreparingReturn
      if (!modulePickedUp) {
        const returnCountdownProgress = lifecycle?.progress ?? 0;
        if (returnCountdownProgress < 30) landerPhase = "ascending";
        else landerPhase = "atOrbit";
      }
    }

    let moduleOffsetY = -orbitRadius;
    if (landerPhase === "descending") {
      const t = Math.min(1, exploreProgress / 8);
      moduleOffsetY = -orbitRadius + t * orbitRadius;
    } else if (landerPhase === "landed") {
      moduleOffsetY = 0;
    } else if (landerPhase === "ascending") {
      const returnCountdownProgress = lifecycle?.progress ?? 0;
      const t = Math.min(1, returnCountdownProgress / 30);
      moduleOffsetY = (1 - t) * 0 + t * -orbitRadius;
    } else if (landerPhase === "atOrbit") {
      moduleOffsetY = -orbitRadius;
    }

    return (
      <div className="absolute z-20 pointer-events-none" style={{
        left: `calc(${dest.x}% + ${planetSize / 2}px)`,
        top: `calc(${dest.y}% + ${planetSize / 2}px)`,
        width: boxSize, height: boxSize,
        transform: "translate(-50%, -50%)",
      }}>
        {/* Orbit path */}
        <div style={{
          position: "absolute",
          left: center - orbitRadius, top: center - orbitRadius,
          width: orbitRadius * 2, height: orbitRadius * 2,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)",
        }} />

        {/* JS-driven orbiting rocket */}
        <img src={rocketImg} alt="Rocket" style={{
          position: "absolute", width: rocketSize, height: rocketSize,
          objectFit: "contain",
          left: orbitRocketX, top: orbitRocketY,
          transform: `rotate(${orbitRotation + 90}deg)`,
        }} draggable={false} />

        {/* Landing module */}
        {landerPhase && (
          <div className="pointer-events-none z-10" style={{
            position: "absolute",
            left: center - 16, top: center - 16 + moduleOffsetY,
            transition: "top 0.5s ease-in-out",
          }}>
            <img src={landerImg} alt="Landing Module"
              style={{ width: 32, height: 32, objectFit: "contain" }} draggable={false} />
            {(landerPhase === "descending" || landerPhase === "ascending") && (
              <motion.div style={{
                position: "absolute", left: "50%", marginLeft: -2, width: 4,
                background: "linear-gradient(to bottom, #fbbf24, transparent)",
                top: landerPhase === "descending" ? -8 : "100%",
                transform: landerPhase === "descending" ? "rotate(180deg)" : "none",
              }}
                animate={{ height: [4, 10, 4], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 0.2, repeat: Infinity }}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Returning: depart from near the planet toward Earth
  if (mission.status === "Returning") {
    return (
      <FlyingRocket rocketImg={rocketImg}
        fromX={dest.x} fromY={dest.y}
        toX={EARTH_POS.x} toY={EARTH_POS.y}
        progress={progress}
      />
    );
  }

  return null;
}

export { PLANET_POSITIONS };
