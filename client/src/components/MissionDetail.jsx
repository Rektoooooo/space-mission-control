import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, UserPlus, UserMinus, AlertTriangle } from "lucide-react";
import { STATUS_COLORS } from "@/lib/missionConstants";
import * as api from "@/lib/api";
import MissionActions from "./MissionActions";
import rocket1Img from "@/assets/rockets/rocket1.png";
import rocket2Img from "@/assets/rockets/rocket2.png";
import rocket3Img from "@/assets/rockets/rocket3.png";

const ROCKET_OPTIONS = [
  { value: "falcon9", label: "Falcon 9", img: rocket1Img },
  { value: "shuttle", label: "Space Shuttle", img: rocket2Img },
  { value: "saturnV", label: "Saturn V", img: rocket3Img },
];

export default function MissionDetail({
  missions,
  lifecycles,
  crewMembers,
  onTransition,
  onUpdateMission,
  onUpdateCrew,
  onRefreshCrew,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crew, setCrew] = useState([]);
  const [assignId, setAssignId] = useState("");

  const mission = missions.find((m) => m._id === id);
  const lifecycle = lifecycles?.[id];

  useEffect(() => {
    if (id) {
      api.getMissionCrew(id).then(setCrew).catch(console.error);
    }
  }, [id, crewMembers]);

  if (!mission) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Mission not found.</p>
        <Button variant="ghost" className="mt-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-3 h-3 mr-1" /> Back
        </Button>
      </div>
    );
  }

  const isPlanning = mission.status === "Planning";
  const isActive = !["Planning", "Completed", "Failed"].includes(mission.status);

  const unassigned = crewMembers.filter(
    (c) =>
      !c.missionId ||
      (typeof c.missionId === "object" ? !c.missionId?._id : !c.missionId)
  );

  const handleAssign = async () => {
    if (!assignId) return;
    await onUpdateCrew(assignId, { missionId: id });
    onRefreshCrew();
    setAssignId("");
  };

  const handleUnassign = async (memberId) => {
    await onUpdateCrew(memberId, { missionId: null });
    onRefreshCrew();
  };

  const handleAbort = () => {
    if (window.confirm("Are you sure you want to abort this mission?")) {
      onTransition(mission._id, "Failed");
    }
  };

  const handleRocketChange = (rocketType) => {
    onUpdateMission(mission._id, { rocketType });
  };

  const currentRocket =
    ROCKET_OPTIONS.find((r) => r.value === mission.rocketType) ||
    ROCKET_OPTIONS[0];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="w-3 h-3 mr-1" /> Back
          </Button>
          <h3 className="text-sm font-bold">{mission.name}</h3>
          <Badge variant="outline" className={STATUS_COLORS[mission.status]}>
            {mission.status === "PreparingReturn"
              ? "Preparing Return"
              : mission.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {mission.destination} &bull;{" "}
            {new Date(mission.launchDate).toLocaleDateString()}
          </span>
        </div>
        {isActive && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleAbort}
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> Abort
          </Button>
        )}
      </div>

      {mission.description && (
        <p className="text-xs text-muted-foreground">{mission.description}</p>
      )}

      {/* Rocket selector + preview — only during Planning */}
      {isPlanning && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-muted-foreground">Rocket:</span>
            <Select
              value={mission.rocketType || "falcon9"}
              onValueChange={handleRocketChange}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue>{currentRocket.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ROCKET_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <span className="flex items-center gap-2">
                      <img src={r.img} alt={r.label} className="w-4 h-4 object-contain" />
                      {r.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <img
            src={currentRocket.img}
            alt={currentRocket.label}
            className="w-12 h-12 object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Show rocket preview when not planning */}
      {!isPlanning && (
        <div className="flex items-center gap-2">
          <img
            src={currentRocket.img}
            alt={currentRocket.label}
            className="w-8 h-8 object-contain"
            draggable={false}
          />
          <span className="text-xs text-muted-foreground">{currentRocket.label}</span>
        </div>
      )}

      {/* Lifecycle Actions */}
      <MissionActions
        mission={mission}
        lifecycle={lifecycle}
        onTransition={onTransition}
        crewCount={crew.length}
      />

      <Separator className="bg-border/50" />

      {/* Crew section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Crew Roster ({crew.length})
        </h4>

        {/* Assign crew — only during Planning */}
        {isPlanning && (
          <div className="flex items-center gap-2">
            <Select value={assignId} onValueChange={setAssignId}>
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue placeholder="Select crew member to assign...">
                  {assignId
                    ? (() => {
                        const c = unassigned.find((m) => m._id === assignId);
                        return c ? `${c.name} (${c.role})` : "Select...";
                      })()
                    : "Select crew member to assign..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {unassigned.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No unassigned crew available
                  </SelectItem>
                ) : (
                  unassigned.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name} ({c.role})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleAssign} disabled={!assignId}>
              <UserPlus className="w-3 h-3 mr-1" /> Assign
            </Button>
          </div>
        )}

        {/* Crew table */}
        <div className="max-h-[120px] overflow-y-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Experience</TableHead>
                {isPlanning && (
                  <TableHead className="text-xs w-16">Remove</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {crew.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isPlanning ? 4 : 3}
                    className="text-center text-muted-foreground text-sm py-4"
                  >
                    No crew assigned.
                  </TableCell>
                </TableRow>
              ) : (
                crew.map((c) => (
                  <TableRow key={c._id} className="text-sm">
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.role}</TableCell>
                    <TableCell>{c.experienceLevel}</TableCell>
                    {isPlanning && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleUnassign(c._id)}
                        >
                          <UserMinus className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
