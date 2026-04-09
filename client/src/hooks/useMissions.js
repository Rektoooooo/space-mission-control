import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/api";

export function useMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getMissions();
      setMissions(data);
    } catch (err) {
      console.error("Failed to fetch missions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const create = async (data) => {
    const mission = await api.createMission(data);
    setMissions((prev) => [mission, ...prev]);
    return mission;
  };

  const update = async (id, data) => {
    const mission = await api.updateMission(id, data);
    setMissions((prev) => prev.map((m) => (m._id === id ? mission : m)));
    return mission;
  };

  const remove = async (id) => {
    await api.deleteMission(id);
    setMissions((prev) => prev.filter((m) => m._id !== id));
  };

  const transition = async (id, status) => {
    const mission = await api.transitionMission(id, status);
    setMissions((prev) => prev.map((m) => (m._id === id ? mission : m)));
    return mission;
  };

  return { missions, loading, fetchMissions, create, update, remove, transition };
}
