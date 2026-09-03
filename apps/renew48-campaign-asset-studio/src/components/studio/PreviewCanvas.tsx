import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, Maximize2, Share2, SquareDashed } from "lucide-react";
import type { Asset, ExportType, Platform, PlatformFormat } from "@/types";
import { PLATFORM_LABELS } from "@/data/platformFormats";
import { AssetRender } from "@/render/templates";
import { PlatformFrame } from "@/render/PlatformFrame";
import { applicableFormats, assetPlatforms, formatsForAssetOnPlatform } from "@/render/helpers";
import { downloadOne } from "@/export/exporter";
import { webShare } from "@/publish/share";
import { Button, cn } from "@/components/ui";

const EXPORT_TYPES: ExportType[] = ["png", "jpg", "svg", "pdf"];

export function PreviewCanvas({ asset }: { asset: Asset }) {
  const formats = useMemo(() => applicableFormats(asset), [asset]);
  const platforms = useMemo(() => assetPlatforms(asset), [asset]);
  const [platform, setPlatform] = useState<Platform>(platforms[0]);
  const [format, setFormat] = useState<PlatformFormat>(formats[0]);
  const [showSafe, setShowSafe] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.3);

  // Reset selection when the asset changes.
  useEffect(() => {
    const f = applicableFormats(asset);
    setPlatform(assetPlatforms(asset)[0]);
    setFormat(f[0]);
  }, [asset]);

  // Keep the current platform/format valid.
  const platFormats = formatsForAssetOnPlatform(asset, platform);
  useEffect(() => {
    if (!platFormats.some((f) => f.id === format.id)) setFormat(platFormats[0] ?? formats[0]);
  }, [platform]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fit-to-container scaling.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const pad = 48;
      const availW = el.clientWidth - pad;
      const availH = el.clientHeight - pad;
      setScale(Math.min(availW / format.width, availH / format.height, 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [format]);

  async function handleExport(type: ExportType) {
    if (!exportRef.current) return;
    setBusy(type);
    try {
      await downloadOne(exportRef.current, asset, format, type);
      setToast(`Exported ${format.width}×${format.height} ${type.toUpperCase()}`);
    } catch {
      setToast("Export failed — check console.");
    } finally {
      setBusy(null);
      setTimeout(() => setToast(null), 2600);
    }
  }

  async function handleShare() {
    if (!exportRef.current) return;
    setBusy("share");
    const res = await webShare(exportRef.current, asset, format);
    setToast(res.message);
    setBusy(null);
    setTimeout(() => setToast(null), 2600);
  }

  if (!format) {
    return <div className="grid h-full place-items-center text-ink/40">No applicable format for this template.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* platform switcher */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/10 px-4 py-3">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              p === platform ? "bg-forest text-canvas" : "text-ink/60 hover:bg-surface-2",
            )}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => setShowSafe((s) => !s)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition",
              showSafe ? "bg-terracotta/15 text-clay" : "text-ink/55 hover:bg-surface-2",
            )}
            title="Toggle safe-area guides"
          >
            <SquareDashed className="size-3.5" /> Safe area
          </button>
        </div>
      </div>

      {/* format tabs */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2.5">
        {platFormats.map((f) => (
          <button
            key={f.id}
            onClick={() => setFormat(f)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[11px] font-mono transition",
              f.id === format.id ? "bg-surface-2 text-ink" : "text-ink/45 hover:text-ink/70",
            )}
          >
            {f.label.split("·")[1]?.trim() ?? f.label} · {f.width}×{f.height}
          </button>
        ))}
      </div>

      {/* stage */}
      <div ref={wrapRef} className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#e9e1d3] p-6">
        <PlatformFrame format={format} scale={scale} showSafe={showSafe} exportRef={(el) => (exportRef.current = el)}>
          <AssetRender asset={asset} format={format} />
        </PlatformFrame>
        <span className="absolute bottom-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] text-canvas">
          <Maximize2 className="size-3" />
          {Math.round(scale * 100)}%
        </span>
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-forest px-4 py-2 text-xs text-canvas shadow-lg">
            {toast}
          </div>
        )}
      </div>

      {/* export bar */}
      <div className="flex flex-wrap items-center gap-2 border-t border-ink/10 px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Export</span>
        {(format.platform === "email" ? [...EXPORT_TYPES, "html" as ExportType] : EXPORT_TYPES).map((t) => (
          <Button key={t} variant="outline" onClick={() => handleExport(t)} disabled={!!busy}>
            {busy === t ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            {t.toUpperCase()}
          </Button>
        ))}
        <Button variant="accent" className="ml-auto" onClick={handleShare} disabled={!!busy}>
          {busy === "share" ? <Loader2 className="size-3.5 animate-spin" /> : <Share2 className="size-3.5" />}
          Share
        </Button>
      </div>
    </div>
  );
}
