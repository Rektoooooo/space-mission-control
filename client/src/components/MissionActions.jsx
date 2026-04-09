import { Button } from "@/components/ui/button";
import { Rocket, RotateCcw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import MissionProgressBar from "./MissionProgressBar";

export default function MissionActions({ mission, lifecycle, onTransition, crewCount = 0 }) {
  const { status } = mission;
  const lc = lifecycle || {};

  if (status === "Planning") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-sm text-muted-foreground">
          {crewCount === 0
            ? "Assign at least one crew member to begin"
            : `${crewCount} crew member${crewCount !== 1 ? "s" : ""} assigned`}
        </p>
        <Button
          size="lg"
          disabled={crewCount === 0}
          onClick={() => onTransition(mission._id, "Preparing")}
          className="gap-2"
        >
          <Rocket className="w-4 h-4" />
          Prepare for Takeoff
        </Button>
      </div>
    );
  }

  if (status === "Preparing") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-xs text-muted-foreground">Launch sequence initiated...</p>
        <CountdownTimer countdown={lc.countdown} />
      </div>
    );
  }

  if (status === "Traveling") {
    return (
      <div className="py-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <Rocket className="w-4 h-4" />
          En route to {mission.destination}
        </div>
        <MissionProgressBar
          progress={lc.progress}
          elapsed={lc.elapsed}
          total={lc.totalDuration}
          phase="Traveling"
        />
      </div>
    );
  }

  if (status === "Exploring") {
    return (
      <div className="py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-purple-300">
          Exploring {mission.destination}
        </div>
        <MissionProgressBar
          progress={lc.progress}
          elapsed={lc.elapsed}
          total={lc.totalDuration}
          phase="Exploring"
        />
        {lc.exploringDone && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <p className="text-xs text-emerald-300">Exploration complete!</p>
            <Button
              onClick={() => onTransition(mission._id, "PreparingReturn")}
              className="gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Prepare for Return
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === "PreparingReturn") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-xs text-muted-foreground">Preparing for return journey...</p>
        <CountdownTimer countdown={lc.countdown} />
      </div>
    );
  }

  if (status === "Returning") {
    return (
      <div className="py-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-orange-300">
          <RotateCcw className="w-4 h-4" />
          Returning to Earth
        </div>
        <MissionProgressBar
          progress={lc.progress}
          elapsed={lc.elapsed}
          total={lc.totalDuration}
          phase="Returning"
        />
      </div>
    );
  }

  if (status === "Completed") {
    return (
      <div className="flex items-center gap-2 py-4 text-emerald-300">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Mission Complete</span>
      </div>
    );
  }

  if (status === "Failed") {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex items-center gap-2 text-red-400">
          <XCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Mission Aborted</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTransition(mission._id, "Planning")}
          className="gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset to Planning
        </Button>
      </div>
    );
  }

  return null;
}
