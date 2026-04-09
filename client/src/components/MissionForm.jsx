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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import rocket1Img from "@/assets/rockets/rocket1.png";
import rocket2Img from "@/assets/rockets/rocket2.png";
import rocket3Img from "@/assets/rockets/rocket3.png";

const DESTINATIONS = ["Moon", "Mars", "Europa", "Titan", "Venus", "Saturn"];
const ROCKET_OPTIONS = [
  { value: "falcon9", label: "Falcon 9", img: rocket1Img },
  { value: "shuttle", label: "Space Shuttle", img: rocket2Img },
  { value: "saturnV", label: "Saturn V", img: rocket3Img },
];

const EMPTY = {
  name: "",
  destination: "Moon",
  launchDate: "",
  rocketType: "falcon9",
  description: "",
};

export default function MissionForm({ open, onClose, onSubmit, mission }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!mission;

  useEffect(() => {
    if (mission) {
      setForm({
        name: mission.name,
        destination: mission.destination,
        launchDate: mission.launchDate?.slice(0, 10) || "",
        rocketType: mission.rocketType || "falcon9",
        description: mission.description || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [mission, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const currentRocket =
    ROCKET_OPTIONS.find((r) => r.value === form.rocketType) || ROCKET_OPTIONS[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Mission" : "New Mission"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Mission Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Mars Odyssey"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Destination</Label>
              <Select
                value={form.destination}
                onValueChange={(v) => setForm({ ...form, destination: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="launchDate">Launch Date</Label>
              <Input
                id="launchDate"
                type="date"
                value={form.launchDate}
                onChange={(e) =>
                  setForm({ ...form, launchDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          {/* Rocket selector with preview */}
          <div className="space-y-2">
            <Label>Rocket</Label>
            <div className="flex items-center gap-3">
              <Select
                value={form.rocketType}
                onValueChange={(v) => setForm({ ...form, rocketType: v })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROCKET_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <span className="flex items-center gap-2">
                        <img
                          src={r.img}
                          alt={r.label}
                          className="w-4 h-4 object-contain"
                        />
                        {r.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <img
                src={currentRocket.img}
                alt={currentRocket.label}
                className="w-14 h-14 object-contain"
                draggable={false}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Mission objective..."
              rows={3}
            />
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
