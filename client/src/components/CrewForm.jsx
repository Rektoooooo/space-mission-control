import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = ["Commander", "Pilot", "Engineer", "Scientist", "Medic"];
const LEVELS = ["Rookie", "Veteran", "Elite"];

const EMPTY = {
  name: "",
  role: "Scientist",
  nationality: "",
  experienceLevel: "Rookie",
  missionId: "",
};

export default function CrewForm({
  open,
  onClose,
  onSubmit,
  crewMember,
  missions = [],
}) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!crewMember;

  useEffect(() => {
    if (crewMember) {
      setForm({
        name: crewMember.name,
        role: crewMember.role,
        nationality: crewMember.nationality,
        experienceLevel: crewMember.experienceLevel,
        missionId: crewMember.missionId?._id || crewMember.missionId || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [crewMember, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, missionId: form.missionId || null };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Crew Member" : "New Crew Member"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crew-name">Name</Label>
            <Input
              id="crew-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Elena Kovacs"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <Select
                value={form.experienceLevel}
                onValueChange={(v) =>
                  setForm({ ...form, experienceLevel: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              value={form.nationality}
              onChange={(e) =>
                setForm({ ...form, nationality: e.target.value })
              }
              placeholder="e.g. Hungarian"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Assign to Mission</Label>
            <Select
              value={form.missionId}
              onValueChange={(v) =>
                setForm({ ...form, missionId: v === "none" ? "" : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {missions.map((m) => (
                  <SelectItem key={m._id} value={m._id}>
                    {m.name} ({m.destination})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
