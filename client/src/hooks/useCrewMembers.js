import { useState, useEffect, useCallback } from "react";
import * as api from "@/lib/api";

export function useCrewMembers() {
  const [crewMembers, setCrewMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrewMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCrewMembers();
      setCrewMembers(data);
    } catch (err) {
      console.error("Failed to fetch crew members:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrewMembers();
  }, [fetchCrewMembers]);

  const create = async (data) => {
    const member = await api.createCrewMember(data);
    setCrewMembers((prev) => [member, ...prev]);
    return member;
  };

  const update = async (id, data) => {
    const member = await api.updateCrewMember(id, data);
    setCrewMembers((prev) => prev.map((m) => (m._id === id ? member : m)));
    return member;
  };

  const remove = async (id) => {
    await api.deleteCrewMember(id);
    setCrewMembers((prev) => prev.filter((m) => m._id !== id));
  };

  return { crewMembers, loading, fetchCrewMembers, create, update, remove };
}
