import { motion } from "framer-motion";
import rocket1Img from "@/assets/rockets/rocket1.png";
import rocket2Img from "@/assets/rockets/rocket2.png";
import { ROCKET_VISIBLE_STATUSES } from "@/lib/missionConstants";

const ROCKETS = [rocket1Img, rocket2Img];

const PLANET_POSITIONS = {
  Moon: { x: 25, y: 8 },
  Mars: { x: 78, y: 10 },
  Europa: { x: 8, y: 40 },
  Titan: { x: 90, y: 38 },
  Venus: { x: 85, y: 58 },
  Saturn: { x: 10, y: 60 },
};

const EARTH_POS = { x: 50, y: 35 };

function hashIndex(id, count) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % count;
}

/** Thruster flame rendered behind the rocket when traveling */
function ThrusterFlame({ angle, isMoving }) {
  if (!isMoving) return null;

  // The flame points opposite to the direction of travel.
  // The rocket image is rotated by `angle` (where 0 = pointing up).
  // We position the flame below the rocket (at the bottom) and it
  // inherits the rotation from the parent, so we just place it offset downward.
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ top: "100%", width: 20 }}
    >
      {/* Core flame */}
      <motion.div
        className="mx-auto rounded-full"
        style={{
          width: 6,
          background: "linear-gradient(to bottom, #fff, #fbbf24, #f97316, transparent)",
        }}
        animate={{
          height: [16, 22, 14, 20, 16],
          opacity: [0.9, 1, 0.85, 1, 0.9],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Outer glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 14,
          background: "radial-gradient(circle, rgba(251,191,36,0.5), rgba(249,115,22,0.2), transparent)",
          filter: "blur(3px)",
        }}
        animate={{
          height: [20, 28, 18, 26, 20],
          opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Particle sparks */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            background: i === 0 ? "#fbbf24" : i === 1 ? "#f97316" : "#fde68a",
            left: `${8 + (i - 1) * 4}px`,
          }}
          animate={{
            top: [14, 28 + i * 6, 14],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 0.5 + i * 0.15,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export default function Rocket({ mission, lifecycle }) {
  const dest = PLANET_POSITIONS[mission.destination];
  if (!dest || !ROCKET_VISIBLE_STATUSES.includes(mission.status)) return null;

  // Only use progress for movement phases (Traveling/Returning), not stale countdown progress
  const isMovementPhase = mission.status === "Traveling" || mission.status === "Returning";
  const progress = isMovementPhase ? (lifecycle?.progress ?? 0) : 0;
  let currentX, currentY, angle;
  let isMoving = false;

  if (mission.status === "Traveling") {
    const t = progress / 100;
    currentX = EARTH_POS.x + (dest.x - EARTH_POS.x) * t;
    currentY = EARTH_POS.y + (dest.y - EARTH_POS.y) * t;
    angle =
      Math.atan2(dest.y - EARTH_POS.y, dest.x - EARTH_POS.x) *
        (180 / Math.PI) +
      90;
    isMoving = true;
  } else if (
    mission.status === "Exploring" ||
    mission.status === "PreparingReturn"
  ) {
    currentX = dest.x;
    currentY = dest.y;
    angle = 0;
  } else if (mission.status === "Returning") {
    const t = progress / 100;
    currentX = dest.x + (EARTH_POS.x - dest.x) * t;
    currentY = dest.y + (EARTH_POS.y - dest.y) * t;
    angle =
      Math.atan2(EARTH_POS.y - dest.y, EARTH_POS.x - dest.x) *
        (180 / Math.PI) +
      90;
    isMoving = true;
  }

  const rocketImg = ROCKETS[hashIndex(mission._id, ROCKETS.length)];

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${currentX}%`,
        top: `${currentY}%`,
        transform: "translate(-50%, -50%)",
        transition: "left 0.06s linear, top 0.06s linear",
      }}
    >
      <div
        className="relative"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <img
          src={rocketImg}
          alt="Rocket"
          className="w-8 h-8 md:w-10 md:h-10 object-contain relative z-10"
          draggable={false}
        />
        <ThrusterFlame angle={angle} isMoving={isMoving} />
        {/* Thruster glow halo around the rocket when moving */}
        {isMoving && (
          <motion.div
            className="absolute inset-0 rounded-full -z-10"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)",
              margin: "-6px",
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}

export { PLANET_POSITIONS };
