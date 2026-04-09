import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Users } from "lucide-react";

export default function ControlPanel({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.startsWith("/crew")
    ? "crew"
    : "missions";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-3xl">
      <div className="control-panel rounded-xl px-5 pt-3 pb-4">
        {/* Tab navigation — only show when not on detail page */}
        {!location.pathname.startsWith("/missions/") && (
          <Tabs
            value={currentTab}
            onValueChange={(v) => navigate(v === "crew" ? "/crew" : "/")}
            className="mb-3"
          >
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="missions" className="text-xs gap-1">
                <Rocket className="w-3 h-3" /> Missions
              </TabsTrigger>
              <TabsTrigger value="crew" className="text-xs gap-1">
                <Users className="w-3 h-3" /> Crew
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {children}
      </div>
    </div>
  );
}
