import { motion, AnimatePresence } from "framer-motion";
import { COUNTDOWN_DURATION } from "@/lib/missionConstants";

export default function CountdownTimer({ countdown, total = COUNTDOWN_DURATION }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = ((total - countdown) / total) * 100;
  const dashOffset = circumference - (progress / 100) * circumference;

  // Urgency escalation: color shifts from cyan to orange to red
  const isUrgent = countdown <= 3;
  const isCritical = countdown <= 1;
  const strokeColor = isCritical
    ? "rgba(255, 80, 30, 0.95)"
    : isUrgent
      ? "rgba(255, 160, 50, 0.9)"
      : "rgba(100, 200, 255, 0.8)";
  const trackColor = isCritical
    ? "rgba(255, 80, 30, 0.2)"
    : isUrgent
      ? "rgba(255, 160, 50, 0.15)"
      : "rgba(100, 180, 255, 0.15)";
  const textColor = isCritical
    ? "text-red-400"
    : isUrgent
      ? "text-orange-300"
      : "text-cyan-300";
  const glowColor = isCritical
    ? "rgba(255, 80, 30, 0.7)"
    : isUrgent
      ? "rgba(255, 160, 50, 0.5)"
      : "rgba(100, 200, 255, 0.5)";

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        animate={
          isUrgent
            ? { scale: [1, 1.05, 1] }
            : {}
        }
        transition={
          isUrgent
            ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        {/* Outer glow ring when urgent */}
        {isUrgent && (
          <motion.div
            className="absolute inset-[-4px] rounded-full"
            style={{
              boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isUrgent ? "5" : "4"}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-100"
          />
        </svg>

        {/* Animated countdown number */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={countdown}
            className={`text-2xl font-bold ${textColor} tabular-nums`}
            style={{
              textShadow: `0 0 12px ${glowColor}`,
            }}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            T-{countdown}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
