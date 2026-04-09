import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Rocket } from "lucide-react";
import { STATUS_COLORS, ALL_STATUSES } from "@/lib/missionConstants";
import MissionForm from "./MissionForm";
import MissionProgressBar from "./MissionProgressBar";

export default function MissionsPanel({
  missions,
  lifecycles = {},
  selectedDestination,
  onClearFilter,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = missions.filter((m) => {
    if (selectedDestination && m.destination !== selectedDestination)
      return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    return true;
  });

  const handleEdit = (mission) => {
    setEditing(mission);
    setFormOpen(true);
  };

  const handleSubmit = (data) => {
    if (editing) {
      onUpdate(editing._id, data);
    } else {
      onCreate(data);
    }
    setEditing(null);
  };

  const renderInlineStatus = (mission) => {
    const lc = lifecycles[mission._id];
    if (!lc) return null;

    if (mission.status === "Preparing" || mission.status === "PreparingReturn") {
      return (
        <span className="text-[10px] text-cyan-300 tabular-nums">
          T-{lc.countdown}s
        </span>
      );
    }

    if (["Traveling", "Exploring", "Returning"].includes(mission.status)) {
      return (
        <MissionProgressBar
          progress={lc.progress}
          phase={mission.status}
          compact
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Missions</h3>
          {selectedDestination && (
            <Badge
              variant="outline"
              className="text-xs cursor-pointer"
              onClick={onClearFilter}
            >
              {selectedDestination} &times;
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue>
                {statusFilter === "all"
                  ? "All statuses"
                  : statusFilter === "PreparingReturn"
                    ? "Preparing Return"
                    : statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "PreparingReturn" ? "Preparing Return" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-3 h-3 mr-1" /> New Mission
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[240px] overflow-y-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Destination</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Progress</TableHead>
              <TableHead className="text-xs w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground text-sm py-6"
                >
                  No missions found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow
                  key={m._id}
                  className="text-sm cursor-pointer"
                  onClick={() => navigate(`/missions/${m._id}`)}
                >
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.destination}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_COLORS[m.status]}
                    >
                      {m.status === "PreparingReturn"
                        ? "Prep. Return"
                        : m.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{renderInlineStatus(m)}</TableCell>
                  <TableCell>
                    {m.status === "Planning" && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(m);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(m._id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MissionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        mission={editing}
      />
    </div>
  );
}
