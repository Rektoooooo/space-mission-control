import { motion } from "framer-motion";
import earthImg from "@/assets/earth.png";

const PHASE_GLOW_CLASS = {
  idle: "earth-glow",
  countdown: "earth-glow earth-glow-countdown",
  launch: "earth-glow earth-glow-launch",
  complete: "earth-glow earth-glow-complete",
};

export default function Earth({ phase = "idle" }) {
  const glowClass = PHASE_GLOW_CLASS[phase] || "earth-glow";

  return (
    <motion.div
      className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-10"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className={glowClass}>
        <img
          src={earthImg}
          alt="Earth"
          className="w-40 h-40 md:w-56 md:h-56 object-contain"
          draggable={false}
        />
      </div>
      <p className="text-center text-xs text-blue-300/70 mt-2 font-medium tracking-widest uppercase">
        Earth
      </p>
    </motion.div>
  );
}
