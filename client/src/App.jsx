import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMissions } from "@/hooks/useMissions";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useMissionLifecycles } from "@/hooks/useMissionLifecycle";
import SpaceScene from "@/components/SpaceScene";
import ControlPanel from "@/components/ControlPanel";
import MissionsPanel from "@/components/MissionsPanel";
import CrewPanel from "@/components/CrewPanel";
import MissionDetail from "@/components/MissionDetail";
import { useState } from "react";

function Dashboard() {
  const { missions, create, update, remove, transition } = useMissions();
  const {
    crewMembers,
    create: createCrew,
    update: updateCrew,
    remove: removeCrew,
    fetchCrewMembers,
  } = useCrewMembers();

  const lifecycles = useMissionLifecycles(missions, transition);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();

  const handlePlanetClick = (name) => {
    setSelectedDestination((prev) => (prev === name ? null : name));
    navigate("/");
  };

  return (
    <>
      <SpaceScene
        missions={missions}
        lifecycles={lifecycles}
        selectedDestination={selectedDestination}
        onPlanetClick={handlePlanetClick}
      />
      <ControlPanel>
        <Routes>
          <Route
            path="/"
            element={
              <MissionsPanel
                missions={missions}
                lifecycles={lifecycles}
                selectedDestination={selectedDestination}
                onClearFilter={() => setSelectedDestination(null)}
                onCreate={create}
                onUpdate={update}
                onDelete={remove}
              />
            }
          />
          <Route
            path="/crew"
            element={
              <CrewPanel
                crewMembers={crewMembers}
                missions={missions}
                onCreate={createCrew}
                onUpdate={updateCrew}
                onDelete={removeCrew}
              />
            }
          />
          <Route
            path="/missions/:id"
            element={
              <MissionDetail
                missions={missions}
                lifecycles={lifecycles}
                crewMembers={crewMembers}
                onTransition={transition}
                onUpdateCrew={updateCrew}
                onRefreshCrew={fetchCrewMembers}
              />
            }
          />
        </Routes>
      </ControlPanel>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </BrowserRouter>
  );
}
