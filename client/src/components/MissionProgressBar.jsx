const PHASE_COLORS = {
  Traveling: "bg-amber-500",
  Exploring: "bg-purple-500",
  Returning: "bg-orange-500",
  Preparing: "bg-cyan-500",
  PreparingReturn: "bg-cyan-500",
};

const PHASE_BG = {
  Traveling: "bg-amber-500/20",
  Exploring: "bg-purple-500/20",
  Returning: "bg-orange-500/20",
  Preparing: "bg-cyan-500/20",
  PreparingReturn: "bg-cyan-500/20",
};

export default function MissionProgressBar({
  progress,
  elapsed,
  total,
  label,
  phase = "Traveling",
  compact = false,
}) {
  const barColor = PHASE_COLORS[phase] || "bg-blue-500";
  const bgColor = PHASE_BG[phase] || "bg-blue-500/20";

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className={`flex-1 h-1.5 rounded-full ${bgColor}`}>
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-100`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums w-8">
          {Math.round(progress)}%
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs text-muted-foreground">{label}</p>
      )}
      <div className={`w-full h-2.5 rounded-full ${bgColor}`}>
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-100`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>{Math.round(elapsed || 0)}s elapsed</span>
        <span>{Math.round(total || 0)}s total</span>
      </div>
    </div>
  );
}
