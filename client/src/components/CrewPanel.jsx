import { useState } from "react";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import CrewForm from "./CrewForm";

const ROLE_COLORS = {
  Commander: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Pilot: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Engineer: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Scientist: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Medic: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const LEVEL_COLORS = {
  Rookie: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  Veteran: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Elite: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export default function CrewPanel({
  crewMembers,
  missions,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleEdit = (member) => {
    setEditing(member);
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

  const getMissionName = (member) => {
    if (!member.missionId) return "Unassigned";
    if (typeof member.missionId === "object") return member.missionId.name;
    const m = missions.find((mi) => mi._id === member.missionId);
    return m ? m.name : "Unassigned";
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Crew Members</h3>
          <span className="text-xs text-muted-foreground">
            ({crewMembers.length} total)
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" /> Add Crew
        </Button>
      </div>

      {/* Table */}
      <div className="max-h-[240px] overflow-y-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Role</TableHead>
              <TableHead className="text-xs">Level</TableHead>
              <TableHead className="text-xs">Nationality</TableHead>
              <TableHead className="text-xs">Mission</TableHead>
              <TableHead className="text-xs w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crewMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground text-sm py-6"
                >
                  No crew members yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              crewMembers.map((c) => (
                <TableRow key={c._id} className="text-sm">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={ROLE_COLORS[c.role]}>
                      {c.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={LEVEL_COLORS[c.experienceLevel]}
                    >
                      {c.experienceLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.nationality}</TableCell>
                  <TableCell className="text-xs">
                    {getMissionName(c)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleEdit(c)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => onDelete(c._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CrewForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        crewMember={editing}
        missions={missions}
      />
    </div>
  );
}
