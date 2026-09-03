import { ArrowUpRight, Layers, Megaphone, Share2 } from "lucide-react";
import type { WorkflowStatus } from "@/types";
import { WORKFLOW_ORDER } from "@/types";
import { useStudio } from "@/store/studio";
import { BRANDS } from "@/data/brandAssets";
import { LogoLockup } from "@/components/BrandLogo";
import { StatusBadge, cn } from "@/components/ui";

export function Dashboard({ onOpen }: { onOpen: (assetId: string) => void }) {
  const { campaigns, phases, assets } = useStudio();

  const counts = WORKFLOW_ORDER.reduce<Record<WorkflowStatus, number>>(
    (acc, s) => ((acc[s] = assets.filter((a) => a.status === s).length), acc),
    {} as Record<WorkflowStatus, number>,
  );
  const published = counts.Published;
  const ready = counts.Ready + counts.Approved;

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-10 flex items-end justify-between gap-6">
        <div>
          <div className="mb-2 font-script text-3xl text-terracotta">Renew48 Wellness Collective</div>
          <h1 className="font-serif text-4xl font-semibold text-forest">Campaign Asset Studio</h1>
          <p className="mt-2 max-w-xl text-sm text-ink/60">
            Produce, manage, and publish every campaign asset across email and social — one source of content,
            native formats for every platform.
          </p>
        </div>
        <LogoLockup brandIds={["renew48", "chirogoaz", "aromahmt"]} surfaceTone="light" size={30} align="left" />
      </header>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat icon={<Megaphone className="size-4" />} label="Campaigns" value={campaigns.length} />
        <Stat icon={<Layers className="size-4" />} label="Assets" value={assets.length} />
        <Stat icon={<Share2 className="size-4" />} label="Ready / Approved" value={ready} />
        <Stat icon={<ArrowUpRight className="size-4" />} label="Published" value={published} />
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Pipeline</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>
      <div className="mb-12 flex flex-wrap gap-2">
        {WORKFLOW_ORDER.map((s) => (
          <div key={s} className="flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-3 py-1.5">
            <StatusBadge status={s} />
            <span className="font-mono text-sm text-ink/70">{counts[s]}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {campaigns.map((c) => {
          const cPhases = phases.filter((p) => p.campaignId === c.id);
          const cAssets = assets.filter((a) => cPhases.some((p) => p.id === a.phaseId));
          return (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
              <div className="flex items-start justify-between gap-4 border-b border-ink/10 bg-[#1f2f20] p-5">
                <div>
                  <div className="font-script text-xl text-gold">{c.tagline}</div>
                  <h2 className="font-serif text-2xl font-semibold text-canvas">{c.name}</h2>
                  <p className="mt-1 text-xs text-canvas/60">{c.theme}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="divide-y divide-ink/8">
                {cPhases
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((p) => {
                    const pAssets = cAssets.filter((a) => a.phaseId === p.id);
                    return (
                      <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="w-12 shrink-0 font-mono text-[11px] text-terracotta">
                          {p.dayOffset >= 0 ? `D+${p.dayOffset}` : `D${p.dayOffset}`}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-ink">{p.name}</div>
                          <div className="truncate text-[11px] text-ink/45">{p.purpose}</div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-1">
                          {pAssets.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => onOpen(a.id)}
                              className={cn(
                                "rounded-md border border-ink/10 bg-canvas px-2 py-1 text-[10px] text-ink/60 transition hover:border-forest/40 hover:text-forest",
                              )}
                              title={a.name}
                            >
                              {a.family}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="flex items-center gap-2 border-t border-ink/10 px-5 py-3 text-[11px] text-ink/50">
                {c.brandIds.map((b) => BRANDS[b].name).join(" · ")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-4">
      <div className="mb-3 inline-flex size-8 items-center justify-center rounded-lg bg-forest/10 text-forest">{icon}</div>
      <div className="font-serif text-3xl font-semibold text-forest">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-ink/45">{label}</div>
    </div>
  );
}
