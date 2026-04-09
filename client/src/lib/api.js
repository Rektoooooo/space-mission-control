const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Missions
export const getMissions = () => request("/missions");
export const getMission = (id) => request(`/missions/${id}`);
export const createMission = (data) =>
  request("/missions", { method: "POST", body: JSON.stringify(data) });
export const updateMission = (id, data) =>
  request(`/missions/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteMission = (id) =>
  request(`/missions/${id}`, { method: "DELETE" });
export const transitionMission = (id, status) =>
  request(`/missions/${id}/transition`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
export const getMissionCrew = (id) => request(`/missions/${id}/crew`);

// Crew Members
export const getCrewMembers = () => request("/crew-members");
export const getCrewMember = (id) => request(`/crew-members/${id}`);
export const createCrewMember = (data) =>
  request("/crew-members", { method: "POST", body: JSON.stringify(data) });
export const updateCrewMember = (id, data) =>
  request(`/crew-members/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCrewMember = (id) =>
  request(`/crew-members/${id}`, { method: "DELETE" });
