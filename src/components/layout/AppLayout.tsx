import { useState, useCallback, createContext, useContext } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { FilterBar } from "@/components/layout/FilterBar";
import { VeraPanel } from "@/components/vera/VeraPanel";

export type VeraContext = "general" | "brand-safety-create" | "brand-safety-analyze" | "brand-safety-campaign-setup";

interface VeraContextValue {
  openVeraWithContext: (ctx: VeraContext) => void;
  profileCreated: boolean;
  setProfileCreated: (v: boolean) => void;
}

const VeraCtx = createContext<VeraContextValue>({ openVeraWithContext: () => {}, profileCreated: false, setProfileCreated: () => {} });
export const useVeraContext = () => useContext(VeraCtx);

interface AppLayoutProps {
  children: React.ReactNode;
  program: string;
  source: string;
  onProgramChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export function AppLayout({ children, program, source, onProgramChange, onSourceChange }: AppLayoutProps) {
  const [veraOpen, setVeraOpen] = useState(false);
  const [veraContext, setVeraContext] = useState<VeraContext>("general");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);

  const openVeraWithContext = useCallback((ctx: VeraContext) => {
    setVeraContext(ctx);
    setVeraOpen(true);
  }, []);

  return (
    <VeraCtx.Provider value={{ openVeraWithContext, profileCreated, setProfileCreated }}>
      <div className="h-screen bg-neutral-25 flex flex-col overflow-hidden relative">
        {/* Scrim overlay — covers header, sidebar, and content but NOT the Vera panel */}
        {veraOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 transition-opacity duration-300"
            onClick={() => setVeraOpen(false)}
          />
        )}

        <AppHeader
          onOpenVera={() => {
            setVeraContext("general");
            setVeraOpen((prev) => !prev);
          }}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          veraOpen={veraOpen}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <AppSidebar collapsed={sidebarCollapsed} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <FilterBar
              program={program}
              source={source}
              onProgramChange={onProgramChange}
              onSourceChange={onSourceChange}
            />
            {children}
          </div>

          {/* Vera Inline Panel — sits above the scrim */}
          <VeraPanel
            open={veraOpen}
            onClose={() => setVeraOpen(false)}
            context={veraContext}
          />
        </div>
      </div>
    </VeraCtx.Provider>
  );
}
