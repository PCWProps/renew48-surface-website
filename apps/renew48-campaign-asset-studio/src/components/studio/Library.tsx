import { useEffect, useRef, useState } from "react";
import { Archive, Check, FileArchive, ImagePlus, RotateCcw, Upload, X } from "lucide-react";
import { BRANDS, BRAND_ASSETS } from "@/data/brandAssets";
import { CAMPAIGN_LIBRARY } from "@/data/campaignLibrary";
import type { BrandId } from "@/types";
import { inferGroup, intakeFiles, releaseIntakeUrls, type IntakeAsset, type IntakeGroup } from "@/imports/assetIntake";

const VARIANT_LABEL: Record<string, string> = {
  primary: "Primary logo",
  wordmark: "Wordmark",
  badge: "Badge / seal",
  lockup: "Botanical lockup",
  squareAvatar: "Square avatar",
  circleAvatar: "Circle avatar",
};

export function Library() {
  const brands: BrandId[] = ["renew48", "chirogoaz", "aromahmt"];
  const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const intakeRef = useRef<IntakeAsset[]>([]);
  const [intake, setIntake] = useState<IntakeAsset[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    intakeRef.current = intake;
  }, [intake]);
  useEffect(() => () => releaseIntakeUrls(intakeRef.current), []);

  const onFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setIsReading(true);
    setMessage("");
    try {
      const result = await intakeFiles(files);
      setIntake((current) => [...result.assets, ...current]);
      const boardCount = result.assets.filter((asset) => asset.group === "Reference boards").length;
      setMessage(`${result.assets.length} source${result.assets.length === 1 ? "" : "s"} added${boardCount ? ` · ${boardCount} board reference${boardCount === 1 ? "" : "s"} detected` : ""}.`);
    } catch {
      setMessage("That archive could not be read. Try a standard ZIP with image, font, SVG, or document files.");
    } finally {
      setIsReading(false);
    }
  };

  const updateGroup = (id: string, group: IntakeGroup) => {
    setIntake((current) => current.map((asset) => (asset.id === id ? { ...asset, group } : asset)));
  };

  const removeIntake = (id: string) => {
    setIntake((current) => {
      const asset = current.find((item) => item.id === id);
      if (asset?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const groups: IntakeGroup[] = ["Brand marks", "Badges & markers", "Typography", "Color systems", "Calls to action", "Background imagery", "Reference boards", "Unsorted intake"];
  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8">
        <div className="font-script text-2xl text-terracotta">Brand Kit</div>
        <h1 className="font-serif text-3xl font-semibold text-forest">Asset Library</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          The authoritative R48 Brand Kit assets. Templates compose these directly — logos are never traced,
          typeset, or regenerated. Variants are auto-selected by background, platform, and format.
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-[1.35rem] border border-forest/15 bg-[#f5f0e6] shadow-[0_18px_50px_rgba(24,48,39,0.08)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta"><Archive className="size-3.5" /> Intake workspace</div>
            <h2 className="font-serif text-2xl font-semibold text-forest">Bring in a whole brand kit at once.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
              Upload a ZIP instead of adding files one by one. The studio expands it locally, groups likely logos, badges, fonts, palettes, calls to action, imagery, and boards, and lets you relabel every item before reuse.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={isReading} className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-xs font-semibold text-canvas transition hover:-translate-y-0.5 disabled:opacity-60"><Upload className="size-4" /> {isReading ? "Reading archive…" : "Upload ZIP or files"}</button>
              <input ref={fileRef} type="file" accept=".zip,image/*,.svg,.pdf,.doc,.docx,.ttf,.otf,.woff,.woff2" multiple className="sr-only" onChange={(event) => { if (event.target.files) void onFiles(event.target.files); event.currentTarget.value = ""; }} />
              <span className="self-center text-[11px] text-ink/45">ZIP, PNG, JPG, SVG, PDF, DOCX, fonts</span>
            </div>
            {message && <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-forest"><Check className="size-3.5" />{message}</div>}
          </div>
          <div className="relative overflow-hidden rounded-xl border border-forest/10 bg-forest p-5 text-canvas">
            <div className="absolute -right-8 -top-12 size-36 rounded-full bg-brass/20 blur-2xl" />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">How boards work here</div>
              <p className="mt-3 font-serif text-xl leading-tight">A flat PNG can teach the system. It should not become the deliverable.</p>
              <p className="mt-3 text-xs leading-relaxed text-canvas/70">The board is retained as a reference for layout, color, type, spacing, and art direction. Logos and badges are marked for individual source files when exact reuse matters.</p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-canvas/75"><div className="rounded-lg border border-canvas/15 p-3"><ImagePlus className="mb-2 size-4 text-brass" />Reference board</div><div className="rounded-lg border border-canvas/15 p-3"><Check className="mb-2 size-4 text-brass" />Selectable source</div></div>
            </div>
          </div>
        </div>
        {intake.length > 0 && (
          <div className="border-t border-forest/10 bg-white/45 p-6 lg:p-8">
            <div className="mb-5 flex items-end justify-between gap-4"><div><h3 className="font-serif text-xl font-semibold text-forest">Intake review</h3><p className="mt-1 text-xs text-ink/55">Confirm the group before a source is used in a campaign.</p></div><span className="font-mono text-[10px] uppercase tracking-widest text-ink/45">{intake.length} items</span></div>
            <div className="grid gap-3 md:grid-cols-2">
              {intake.map((asset) => (
                <article key={asset.id} className="flex gap-3 rounded-xl border border-ink/10 bg-surface p-3">
                  <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#eae2d3]">
                    {asset.previewUrl ? <img src={asset.previewUrl} alt="" className="size-full object-contain" /> : asset.sourceKind === "archive" ? <FileArchive className="size-6 text-terracotta" /> : <Archive className="size-6 text-terracotta" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2"><div className="truncate text-xs font-semibold text-ink" title={asset.originalName}>{asset.name}</div><button type="button" onClick={() => removeIntake(asset.id)} aria-label={`Remove ${asset.name}`} className="text-ink/35 transition hover:text-terracotta"><X className="size-4" /></button></div>
                    <div className="mt-1 text-[10px] leading-relaxed text-ink/50">{asset.note}</div>
                    <select aria-label={`Group ${asset.name}`} value={asset.group} onChange={(event) => updateGroup(asset.id, event.target.value as IntakeGroup)} className="mt-2 w-full rounded-md border border-ink/12 bg-white/65 px-2 py-1.5 text-[11px] text-ink outline-none focus:border-forest/45">
                      {groups.map((group) => <option key={group} value={group}>{group}</option>)}
                    </select>
                    {asset.needsIndividualSource && <div className="mt-2 text-[10px] font-medium text-terracotta">Add individual mark for exact reuse.</div>}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-terracotta/20 bg-terracotta/5 p-3 text-[11px] leading-relaxed text-ink/65"><RotateCcw className="mt-0.5 size-3.5 shrink-0 text-terracotta" />Board analysis is intentionally assistive: it identifies likely composite references from image dimensions and names, but it does not trace, redraw, OCR, or claim pixel-perfect logo recreation.</div>
          </div>
        )}
      </section>

      {brands.map((b) => {
        const brand = BRANDS[b];
        const assets = BRAND_ASSETS.filter((a) => a.brandId === b);
        return (
          <section key={b} className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-serif text-xl font-semibold text-forest">{brand.name}</h2>
              <span className="text-xs text-ink/45">{brand.subTagline}</span>
              <span className="ml-auto rounded-full border border-ink/12 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ink/50">
                {brand.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {assets.map((a) => {
                const dark = a.tone === "dark";
                return (
                  <div key={a.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
                    <div
                      className="grid h-32 place-items-center p-5"
                      style={{ background: dark ? "#1f2f20" : "#efe8db" }}
                    >
                      <img src={a.path} alt={a.name} className="max-h-full max-w-full object-contain" draggable={false} />
                    </div>
                    <div className="border-t border-ink/10 p-3">
                      <div className="text-xs font-medium text-ink">{VARIANT_LABEL[a.variant] ?? a.variant}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-ink/40">{a.tone} · {a.path.split("/").pop()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="mt-14 border-t border-ink/10 pt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="font-script text-2xl text-terracotta">Source library</div>
            <h2 className="font-serif text-2xl font-semibold text-forest">Campaign references & deliverables</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink/60">The approved CTW, referral, Unleashed, and campaign-board assets copied from the Renew48 creation library. Open any file to inspect or download it.</p>
          </div>
          <span className="rounded-full border border-ink/12 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">{CAMPAIGN_LIBRARY.length} files</span>
        </div>
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          {CAMPAIGN_LIBRARY.filter((item) => item.campaign === "Campaign references").map((item) => (
            <a key={item.path} href={assetPath(item.path)} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-2xl border border-ink/10 bg-surface transition hover:border-forest/35">
              <img src={assetPath(item.path)} alt="Campaign reference board" className="block max-h-72 w-full object-contain bg-[#efe8db]" />
              <div className="border-t border-ink/10 px-4 py-3 text-xs font-medium text-ink group-hover:text-forest">Open campaign reference ↗</div>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CAMPAIGN_LIBRARY.filter((item) => item.campaign !== "Campaign references").map((item) => {
            const isPreviewable = item.kind === "image" || item.kind === "vector";
            return (
              <a key={item.path} href={assetPath(item.path)} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-ink/10 bg-surface transition hover:border-forest/35">
                <div className="grid h-32 place-items-center bg-[#efe8db] p-2">
                  {isPreviewable ? <img src={assetPath(item.path)} alt="" className="max-h-full max-w-full object-contain" /> : <div className="font-mono text-[10px] uppercase tracking-widest text-ink/45">{item.kind}</div>}
                </div>
                <div className="border-t border-ink/10 px-3 py-2">
                  <div className="truncate text-[11px] font-medium text-ink group-hover:text-forest">{item.path.split("/").pop()}</div>
                  <div className="mt-0.5 text-[10px] text-ink/45">{item.campaign} · {item.kind}</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
