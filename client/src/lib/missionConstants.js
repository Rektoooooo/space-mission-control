export const COUNTDOWN_DURATION = 10;

export const TRAVEL_TIMES = {
  Moon: 5,
  Venus: 10,
  Mars: 12,
  Europa: 18,
  Titan: 22,
  Saturn: 25,
};

export const EXPLORE_TIMES = {
  Moon: 12,
  Venus: 15,
  Mars: 18,
  Europa: 20,
  Titan: 22,
  Saturn: 25,
};

export const STATUS_COLORS = {
  Planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Preparing: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Traveling: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Exploring: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  PreparingReturn: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Returning: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Failed: "bg-red-500/20 text-red-300 border-red-500/30",
};

export const ROCKET_VISIBLE_STATUSES = [
  "Traveling",
  "Exploring",
  "PreparingReturn",
  "Returning",
];

export const ACTIVE_STATUSES = [
  "Preparing",
  "Traveling",
  "Exploring",
  "PreparingReturn",
  "Returning",
];

export const ALL_STATUSES = [
  "Planning",
  "Preparing",
  "Traveling",
  "Exploring",
  "PreparingReturn",
  "Returning",
  "Completed",
  "Failed",
];
