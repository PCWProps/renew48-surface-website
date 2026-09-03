import { useMemo, useRef, useState } from "react";
import { Loader2, Package } from "lucide-react";
import type { ExportType, PlatformFormat } from "@/types";
import { useStudio } from "@/store/studio";
import { PLATFORM_LABELS } from "@/data/platformFormats";
import { AssetRender } from "@/render/templates";
import { PlatformFrame } from "@/render/PlatformFrame";
import { applicableFormats, defaultFormat } from "@/render/helpers";
import { exportPackage } from "@/export/exporter";
import { Button, cn } from "@/components/ui";

const TYPES: ExportType[] = ["png", "jpg", "pdf", "svg", "html"];

export function ExportCenter() {
  const { campaigns, phases, assets } = useStudio();
  const [campaignId, setCampaignId] = useState(campaigns[0].id);
  const [type, setType] = useState<ExportType>("png");
  const [allFormats, setAllFormats] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const nodes = useRef<Map<string, HTMLDivElement>>(new Map());

  const campaign = campaigns.find((c) => c.id === campaignId)!;
  const cPhases = phases.filter((p) => p.campaignId === campaignId);
  const cAssets = assets.filter((a) => cPhases.some((p) => p.id === a.phaseId));
  const exportAssets = type === "html" ? cAssets.filter((a) => applicableFormats(a).some((f) => f.platform === "email")) : cAssets;

  // Build the flat render list (asset × chosen format set).
  const items = useMemo(() => {
    const out: { key: string; assetId: string; format: PlatformFormat }[] = [];
    for (const a of exportAssets) {
      const fmts = allFormats ? applicableFormats(a) : [defaultFormat(a)];
      for (const f of fmts) out.push({ key: `${a.id}__${f.id}`, assetId: a.id, format: f });
    }
    return out;
  }, [exportAssets, allFormats]);

  async function run() {
    setBusy(true);
    setDone(null);
    // allow the offscreen nodes to mount + images to settle
    await new Promise((r) => setTimeout(r, 600));
    const phaseFor = (assetId: string) => {
      const a = cAssets.find((x) => x.id === assetId)!;
      return cPhases.find((p) => p.id === a.phaseId)!;
    };
    const payload = items
      .map((it) => {
        const node = nodes.current.get(it.key);
        const asset = cAssets.find((a) => a.id === it.assetId)!;
        if (!node) return null;
        return { node, asset, format: it.format, folder: `${campaign.name}/${phaseFor(it.assetId).name}` };
      })
      .filter(Boolean) as { node: HTMLDivElement; asset: (typeof cAssets)[number]; format: PlatformFormat; folder: string }[];
    try {
      await exportPackage(payload, type, `${campaign.name.replace(/\s+/g, "-").toLowerCase()}-${type}`);
      setDone(`Packaged ${payload.length} assets → ${type.toUpperCase()} ZIP`);
    } catch {
      setDone("Package failed — check console.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8">
        <div className="font-script text-2xl text-terracotta">Batch delivery</div>
        <h1 className="font-serif text-3xl font-semibold text-forest">Export Center</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Bundle a whole campaign into a ZIP organized by <span className="font-mono text-xs">Campaign / Phase / asset</span>,
          with a manifest. Preview equals export source — what you see is what ships.
        </p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Campaign</span>
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="rounded-lg border border-ink/12 bg-surface px-3 py-2 text-sm"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Format</span>
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition",
                  t === type ? "border-forest bg-forest text-canvas" : "border-ink/12 text-ink/60 hover:bg-surface-2",
                )}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Scope</span>
          <button
            onClick={() => setAllFormats((v) => !v)}
            className={cn(
              "rounded-lg border px-3 py-2 text-xs font-medium transition",
              allFormats ? "border-terracotta bg-terracotta/10 text-clay" : "border-ink/12 text-ink/60 hover:bg-surface-2",
            )}
          >
            {allFormats ? "All platform formats" : "Primary format only"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-ink/10 bg-surface p-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-ink">{items.length} renders queued</div>
          <div className="text-[11px] text-ink/50">{exportAssets.length} assets across {cPhases.length} phases{type === "html" ? " · MailPoet-safe inline HTML" : ""}</div>
        </div>
        <Button variant="accent" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Package className="size-4" />}
          Export package
        </Button>
      </div>
      {done && <div className="mb-6 rounded-lg bg-forest/10 px-4 py-2 text-sm text-forest">{done}</div>}

      {/* asset grid preview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cAssets.map((a) => {
          const f = defaultFormat(a);
          return (
            <div key={a.id} className="overflow-hidden rounded-xl border border-ink/10 bg-surface">
              <div className="grid place-items-center overflow-hidden bg-[#e9e1d3] p-2" style={{ height: 150 }}>
                <div style={{ width: f.width * (140 / f.width), height: f.height * (140 / f.width) }} className="overflow-hidden">
                  <PlatformFrame format={f} scale={140 / f.width}>
                    <AssetRender asset={a} format={f} />
                  </PlatformFrame>
                </div>
              </div>
              <div className="border-t border-ink/10 px-3 py-2">
                <div className="truncate text-[11px] font-medium text-ink">{a.name}</div>
                <div className="font-mono text-[10px] text-ink/40">{PLATFORM_LABELS[f.platform]} · {f.width}×{f.height}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* offscreen full-size render targets for capture */}
      {busy && (
        <div style={{ position: "fixed", left: -99999, top: 0 }} aria-hidden>
          {items.map((it) => {
            const a = cAssets.find((x) => x.id === it.assetId)!;
            return (
              <PlatformFrame
                key={it.key}
                format={it.format}
                scale={0.1}
                exportRef={(el) => {
                  if (el) nodes.current.set(it.key, el);
                  else nodes.current.delete(it.key);
                }}
              >
                <AssetRender asset={a} format={it.format} />
              </PlatformFrame>
            );
          })}
        </div>
      )}
    </div>
  );
}
