import { useState } from "react";
import { ArrowRight, CheckCircle2, Radio, Share2 } from "lucide-react";
import type { Asset, WorkflowStatus } from "@/types";
import { WORKFLOW_ORDER } from "@/types";
import { useStudio } from "@/store/studio";
import { PLATFORM_LABELS } from "@/data/platformFormats";
import { PUBLISH_PROVIDERS, composeCopy } from "@/publish/share";
import { assetPlatforms } from "@/render/helpers";
import { StatusBadge, cn } from "@/components/ui";

const COLUMNS = WORKFLOW_ORDER;

export function Workflow() {
  const { assets, phases, campaigns, events, setStatus } = useStudio();
  const [publishFor, setPublishFor] = useState<Asset | null>(null);

  const campaignName = (assetId: string) => {
    const a = assets.find((x) => x.id === assetId);
    const p = phases.find((x) => x.id === a?.phaseId);
    return campaigns.find((c) => c.id === p?.campaignId)?.name ?? "";
  };

  const next = (s: WorkflowStatus): WorkflowStatus | null => {
    if (s === "Changes Requested") return "Review";
    const i = WORKFLOW_ORDER.indexOf(s);
    return i >= 0 && i < WORKFLOW_ORDER.length - 1 ? WORKFLOW_ORDER[i + 1] : null;
  };

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-ink/10 px-8 py-6">
        <div className="font-script text-2xl text-terracotta">Approvals</div>
        <h1 className="font-serif text-3xl font-semibold text-forest">Workflow</h1>
        <p className="mt-1 text-sm text-ink/60">
          Move assets through the pipeline. Publishing is gated to <span className="font-medium text-forest">Approved</span> and{" "}
          <span className="font-medium text-forest">Ready</span>.
        </p>
      </header>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex min-w-max gap-4">
          {COLUMNS.map((col) => {
            const items = assets.filter((a) => a.status === col);
            return (
              <div key={col} className="flex w-72 flex-col rounded-2xl border border-ink/10 bg-surface/60">
                <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2.5">
                  <StatusBadge status={col} />
                  <span className="font-mono text-xs text-ink/45">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2 p-2">
                  {items.length === 0 && (
                    <div className="px-2 py-6 text-center text-[11px] text-ink/30">Empty</div>
                  )}
                  {items.map((a) => {
                    const to = next(a.status);
                    const canPublish = a.status === "Approved" || a.status === "Ready";
                    return (
                      <div key={a.id} className="rounded-xl border border-ink/10 bg-canvas p-3">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-terracotta">
                          {campaignName(a.id)}
                        </div>
                        <div className="mt-0.5 text-[13px] font-medium leading-snug text-ink">{a.name}</div>
                        <div className="mt-1 text-[11px] text-ink/45">{a.family}</div>
                        <div className="mt-2.5 flex items-center gap-1.5">
                          {to && (
                            <button
                              onClick={() => setStatus(a.id, to)}
                              className="inline-flex items-center gap-1 rounded-md bg-forest/10 px-2 py-1 text-[10px] font-medium text-forest transition hover:bg-forest/20"
                            >
                              {to} <ArrowRight className="size-3" />
                            </button>
                          )}
                          {canPublish && (
                            <button
                              onClick={() => setPublishFor(a)}
                              className="inline-flex items-center gap-1 rounded-md bg-terracotta/10 px-2 py-1 text-[10px] font-medium text-clay transition hover:bg-terracotta/20"
                            >
                              <Radio className="size-3" /> Publish
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* event log */}
        {events.length > 0 && (
          <div className="mt-8 max-w-2xl">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink/45">Recent activity</div>
            <div className="flex flex-col gap-1.5">
              {events.slice(0, 12).map((e) => {
                const a = assets.find((x) => x.id === e.assetId);
                return (
                  <div key={e.id} className="flex items-center gap-2 rounded-lg border border-ink/8 bg-surface px-3 py-2 text-[12px]">
                    <CheckCircle2 className="size-3.5 text-forest/60" />
                    <span className="font-medium text-ink/80">{a?.name ?? e.assetId}</span>
                    <span className="text-ink/40">{e.from}</span>
                    <ArrowRight className="size-3 text-ink/30" />
                    <span className="text-forest">{e.to}</span>
                    <span className="ml-auto font-mono text-[10px] text-ink/35">
                      {new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {publishFor && <PublishSheet asset={publishFor} onClose={() => setPublishFor(null)} />}
    </div>
  );
}

function PublishSheet({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const { setStatus } = useStudio();
  const platforms = assetPlatforms(asset);
  const copy = composeCopy(asset);
  const [sent, setSent] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-ink/10 bg-[#1f2f20] px-5 py-4">
          <div className="font-script text-xl text-gold">Publish</div>
          <div className="font-serif text-lg font-semibold text-canvas">{asset.name}</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          <div className="mb-4 rounded-xl border border-ink/10 bg-surface p-3">
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink/45">Resolved copy</div>
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink/80">{copy}</p>
          </div>

          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink/45">Targets</div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <span key={p} className="rounded-full border border-ink/12 bg-surface-2 px-2.5 py-1 text-[11px] text-ink/70">
                {PLATFORM_LABELS[p]}
              </span>
            ))}
          </div>

          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink/45">Direct publishing</div>
          <div className="flex flex-col gap-2">
            {PUBLISH_PROVIDERS.map((prov) => (
              <div key={prov.platform} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-surface px-3 py-2.5">
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-ink">{prov.label}</div>
                  <div className="text-[11px] text-ink/45">
                    {prov.connected ? "Connected" : "Requires authenticated connection"}
                  </div>
                </div>
                <button
                  disabled={!prov.connected}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 text-[11px] font-medium text-ink/60 transition enabled:hover:bg-surface-2 disabled:opacity-40"
                >
                  {prov.connected ? "Publish" : "Connect"}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-ink/45">
            Direct publishing needs OAuth + a backend for token exchange (flagged for a later phase). Use{" "}
            <span className="font-medium text-forest">Share</span> in the workspace for native device hand-off today.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-ink/10 px-5 py-4">
          <button onClick={onClose} className="text-sm text-ink/60 hover:text-ink">
            Close
          </button>
          <button
            onClick={() => {
              setStatus(asset.id, "Published", "Marked published from queue");
              setSent(["done"]);
              setTimeout(onClose, 700);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-canvas transition hover:bg-clay"
          >
            <Share2 className="size-4" />
            {sent.length ? "Published ✓" : "Mark as Published"}
          </button>
        </div>
      </div>
    </div>
  );
}
