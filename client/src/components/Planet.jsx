import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import moonImg from "@/assets/planets/moon.png";
import marsImg from "@/assets/planets/mars.png";
import europaImg from "@/assets/planets/europa.png";
import titanImg from "@/assets/planets/titan.png";
import venusImg from "@/assets/planets/venus.png";
import saturnImg from "@/assets/planets/saturn.png";

const PLANET_IMAGES = {
  Moon: moonImg,
  Mars: marsImg,
  Europa: europaImg,
  Titan: titanImg,
  Venus: venusImg,
  Saturn: saturnImg,
};

export default function Planet({
  name,
  style,
  isActive,
  isExploring = false,
  missionCount = 0,
  onClick,
}) {
  const img = PLANET_IMAGES[name];
  const size = name === "Saturn" ? 80 : 64;

  const classNames = [
    "flex flex-col items-center",
    isActive ? "planet-active" : "",
    isExploring ? "planet-exploring" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className="absolute z-10 cursor-pointer"
      style={style}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
      whileHover={{ scale: 1.2 }}
      onClick={onClick}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={classNames}>
            <img
              src={img}
              alt={name}
              style={{ width: size, height: size }}
              className="object-contain"
              draggable={false}
            />
            <p className="text-[10px] text-white/60 mt-1 font-medium tracking-wider uppercase">
              {name}
            </p>
            {missionCount > 0 && (
              <span className="text-[9px] bg-primary/80 text-primary-foreground px-1.5 rounded-full mt-0.5">
                {missionCount} mission{missionCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>
            {name} — {missionCount} active mission{missionCount !== 1 ? "s" : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
