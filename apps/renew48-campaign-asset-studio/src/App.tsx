import { useState } from "react";
import { LayoutDashboard, Library as LibraryIcon, PanelsTopLeft, Package, KanbanSquare, RotateCcw, CircleHelp } from "lucide-react";
import { StudioProvider, useStudio } from "@/store/studio";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/components/ui";
import { Dashboard } from "@/components/studio/Dashboard";
import { CampaignTree } from "@/components/studio/CampaignTree";
import { PreviewCanvas } from "@/components/studio/PreviewCanvas";
import { AssetEditor } from "@/components/studio/AssetEditor";
import { Library } from "@/components/studio/Library";
import { ExportCenter } from "@/components/studio/ExportCenter";
import { Workflow } from "@/components/studio/Workflow";
import { Guidance } from "@/components/studio/Guidance";

type View = "dashboard" | "workspace" | "library" | "export" | "workflow" | "guidance";

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { id: "workspace", label: "Workspace", icon: <PanelsTopLeft className="size-4" /> },
  { id: "library", label: "Library", icon: <LibraryIcon className="size-4" /> },
  { id: "export", label: "Export", icon: <Package className="size-4" /> },
  { id: "workflow", label: "Workflow", icon: <KanbanSquare className="size-4" /> },
  { id: "guidance", label: "User Guidance", icon: <CircleHelp className="size-4" /> },
];

function Shell() {
  const { assets, resetSeed } = useStudio();
  const [view, setView] = useState<View>("dashboard");
  const [selectedId, setSelectedId] = useState<string>(assets[0]?.id ?? "");

  const open = (id: string) => {
    setSelectedId(id);
    setView("workspace");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-ink">
      {/* sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-ink/10 bg-surface">
        <div className="border-b border-ink/10 px-4 py-5">
          <BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={34} />
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">Campaign Asset Studio</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                view === n.id ? "bg-forest text-canvas" : "text-ink/65 hover:bg-surface-2",
              )}
            >
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>
        <button
          onClick={resetSeed}
          className="m-3 inline-flex items-center gap-2 rounded-lg border border-ink/12 px-3 py-2 text-[11px] text-ink/50 transition hover:bg-surface-2"
        >
          <RotateCcw className="size-3.5" /> Reset to seed
        </button>
      </aside>

      {/* main */}
      <main className="flex-1 overflow-hidden">
        {view === "dashboard" && (
          <div className="h-full overflow-y-auto">
            <Dashboard onOpen={open} />
          </div>
        )}
        {view === "workspace" && <Workspace selectedId={selectedId} onSelect={setSelectedId} />}
        {view === "library" && (
          <div className="h-full overflow-y-auto">
            <Library />
          </div>
        )}
        {view === "export" && (
          <div className="h-full overflow-y-auto">
            <ExportCenter />
          </div>
        )}
        {view === "workflow" && <Workflow />}
        {view === "guidance" && (
          <div className="h-full overflow-y-auto">
            <Guidance />
          </div>
        )}
      </main>
    </div>
  );
}

function Workspace({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const { assets } = useStudio();
  const asset = assets.find((a) => a.id === selectedId) ?? assets[0];

  return (
    <div className="grid h-full grid-cols-[minmax(240px,300px)_1fr_minmax(300px,360px)] overflow-hidden">
      <div className="overflow-y-auto border-r border-ink/10 bg-surface/50">
        <CampaignTree selectedId={asset?.id ?? ""} onSelect={onSelect} />
      </div>
      <div className="overflow-hidden bg-canvas">
        {asset ? <PreviewCanvas asset={asset} /> : <div className="grid h-full place-items-center text-ink/40">Select an asset</div>}
      </div>
      <div className="overflow-y-auto border-l border-ink/10 bg-surface/50 px-5 py-5">
        {asset && (
          <>
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta">{asset.family}</div>
              <h2 className="font-serif text-xl font-semibold text-forest">{asset.name}</h2>
              <p className="mt-1 text-[12px] text-ink/55">{asset.purpose}</p>
            </div>
            <AssetEditor asset={asset} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  );
}
