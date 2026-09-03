import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useStudio } from "@/store/studio";
import { StatusBadge, cn } from "@/components/ui";

export function CampaignTree({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const { campaigns, phases, assets } = useStudio();
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(campaigns.map((c) => [c.id, true])),
  );

  return (
    <div className="flex flex-col gap-1 p-3">
      {campaigns.map((c) => {
        const cPhases = phases.filter((p) => p.campaignId === c.id).sort((a, b) => a.sequence - b.sequence);
        const cAssets = assets.filter((a) => cPhases.some((p) => p.id === a.phaseId));
        return (
          <div key={c.id}>
            <button
              onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-surface-2"
            >
              <ChevronRight className={cn("size-4 text-ink/40 transition", open[c.id] && "rotate-90")} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-serif text-[15px] font-semibold text-forest">{c.name}</div>
                <div className="truncate text-[11px] text-ink/45">{cAssets.length} assets · {cPhases.length} phases</div>
              </div>
            </button>

            {open[c.id] && (
              <div className="ml-3 border-l border-ink/10 pl-2">
                {cPhases.map((p) => {
                  const pAssets = assets.filter((a) => a.phaseId === p.id);
                  return (
                    <div key={p.id} className="py-1">
                      <div className="flex items-center gap-2 px-2 py-1">
                        <span className="font-mono text-[10px] text-terracotta">
                          {p.dayOffset >= 0 ? `D+${p.dayOffset}` : `D${p.dayOffset}`}
                        </span>
                        <span className="text-xs font-medium text-ink/70">{p.name}</span>
                      </div>
                      {pAssets.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => onSelect(a.id)}
                          className={cn(
                            "group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition",
                            a.id === selectedId ? "bg-forest/10" : "hover:bg-surface-2",
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full",
                              a.id === selectedId ? "bg-terracotta" : "bg-ink/20 group-hover:bg-ink/40",
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate text-[13px] text-ink/80">{a.name}</span>
                          <StatusBadge status={a.status} className="scale-90" />
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
