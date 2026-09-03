import { AlertTriangle, Copy } from "lucide-react";
import { useState } from "react";
import type { Asset, WorkflowStatus } from "@/types";
import { WORKFLOW_ORDER } from "@/types";
import { useStudio } from "@/store/studio";
import { BRANDS } from "@/data/brandAssets";
import { Field, StatusBadge, TextArea, TextInput, cn } from "@/components/ui";
import { composeCopy } from "@/publish/share";
import { PLATFORM_LABELS } from "@/data/platformFormats";
import { assetPlatforms } from "@/render/helpers";

export function WorkflowBar({ asset }: { asset: Asset }) {
  const { setStatus } = useStudio();
  const idx = WORKFLOW_ORDER.indexOf(asset.status);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {WORKFLOW_ORDER.filter((s) => s !== "Changes Requested").map((s, i) => {
        const active = s === asset.status;
        const done = WORKFLOW_ORDER.indexOf(s) < idx;
        return (
          <button
            key={s}
            onClick={() => setStatus(asset.id, s)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] font-medium transition",
              active ? "bg-forest text-canvas" : done ? "bg-forest/12 text-forest" : "text-ink/45 hover:bg-surface-2",
            )}
          >
            {s}
          </button>
        );
      })}
      <button
        onClick={() => setStatus(asset.id, "Changes Requested")}
        className={cn(
          "ml-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition",
          asset.status === "Changes Requested" ? "bg-terracotta text-canvas" : "text-terracotta hover:bg-terracotta/10",
        )}
      >
        Request changes
      </button>
    </div>
  );
}

export function AssetEditor({ asset }: { asset: Asset }) {
  const { updateAssetContent } = useStudio();
  const [copied, setCopied] = useState(false);
  const c = asset.content;
  const set = (patch: Partial<Asset["content"]>) => updateAssetContent(asset.id, patch);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Workflow</span>
          <StatusBadge status={asset.status} />
        </div>
        <WorkflowBar asset={asset} />
      </div>

      {c.review?.length ? (
        <div className="flex gap-2 rounded-xl border border-gold/40 bg-gold/10 p-3 text-[12px] text-[#7a5a10]">
          <AlertTriangle className="size-4 shrink-0" />
          <div>
            <div className="font-semibold">⚑ Review needed</div>
            {c.review.map((r) => (
              <div key={r}>{r}</div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Brands</span>
        <div className="flex flex-wrap gap-1.5">
          {asset.brandIds.map((b) => (
            <span key={b} className="rounded-full border border-ink/12 bg-surface-2 px-2.5 py-1 text-[11px] text-ink/70">
              {BRANDS[b].name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Content</span>
        {c.eyebrow !== undefined && (
          <Field label="Eyebrow">
            <TextInput value={c.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} />
          </Field>
        )}
        {c.scriptAccent !== undefined && (
          <Field label="Script accent">
            <TextInput value={c.scriptAccent ?? ""} onChange={(e) => set({ scriptAccent: e.target.value })} />
          </Field>
        )}
        <Field label="Headline">
          <TextArea rows={2} value={c.headline} onChange={(e) => set({ headline: e.target.value })} />
        </Field>
        {c.subhead !== undefined && (
          <Field label="Subhead">
            <TextInput value={c.subhead ?? ""} onChange={(e) => set({ subhead: e.target.value })} />
          </Field>
        )}
        {c.body !== undefined && (
          <Field label="Body">
            <TextArea rows={3} value={c.body ?? ""} onChange={(e) => set({ body: e.target.value })} />
          </Field>
        )}
      </div>

      {c.offer && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Offer</span>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Value">
              <TextInput value={c.offer.value} onChange={(e) => set({ offer: { ...c.offer!, value: e.target.value } })} />
            </Field>
            <Field label="Promo code">
              <TextInput value={c.offer.code ?? ""} onChange={(e) => set({ offer: { ...c.offer!, code: e.target.value } })} />
            </Field>
          </div>
          <Field label="Expiry">
            <TextInput value={c.offer.expiry ?? ""} onChange={(e) => set({ offer: { ...c.offer!, expiry: e.target.value } })} />
          </Field>
        </div>
      )}

      {c.reward && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Reward</span>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Amount">
              <TextInput value={c.reward.amount} onChange={(e) => set({ reward: { ...c.reward!, amount: e.target.value } })} />
            </Field>
            <Field label="Tier">
              <TextInput value={c.reward.tier ?? ""} onChange={(e) => set({ reward: { ...c.reward!, tier: e.target.value } })} />
            </Field>
          </div>
        </div>
      )}

      {c.referralUrl !== undefined && (
        <Field label="Referral URL">
          <TextInput value={c.referralUrl ?? ""} onChange={(e) => set({ referralUrl: e.target.value })} />
        </Field>
      )}

      {c.testimonial && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Testimonial</span>
          <Field label="Quote">
            <TextArea rows={3} value={c.testimonial.quote} onChange={(e) => set({ testimonial: { ...c.testimonial!, quote: e.target.value } })} />
          </Field>
          <Field label="Attribution">
            <TextInput value={c.testimonial.attribution} onChange={(e) => set({ testimonial: { ...c.testimonial!, attribution: e.target.value } })} />
          </Field>
        </div>
      )}

      {c.steps && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Steps</span>
          {c.steps.map((s, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-ink/10 p-2">
              <TextInput value={s.title} onChange={(e) => set({ steps: c.steps!.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
              <TextArea rows={2} value={s.detail} onChange={(e) => set({ steps: c.steps!.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)) })} />
            </div>
          ))}
        </div>
      )}

      {c.tiers && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Reward tiers</span>
          {c.tiers.map((t, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <TextInput value={t.count} onChange={(e) => set({ tiers: c.tiers!.map((x, j) => (j === i ? { ...x, count: e.target.value } : x)) })} />
              <TextInput value={t.reward} onChange={(e) => set({ tiers: c.tiers!.map((x, j) => (j === i ? { ...x, reward: e.target.value } : x)) })} />
            </div>
          ))}
        </div>
      )}

      {c.bullets && (
        <Field label="List items" hint="One per line">
          <TextArea
            rows={Math.max(3, c.bullets.length)}
            value={c.bullets.join("\n")}
            onChange={(e) => set({ bullets: e.target.value.split("\n") })}
          />
        </Field>
      )}

      {c.cta && (
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/45">Call to action</span>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Label">
              <TextInput value={c.cta.label} onChange={(e) => set({ cta: { ...c.cta!, label: e.target.value } })} />
            </Field>
            <Field label="URL">
              <TextInput value={c.cta.url} onChange={(e) => set({ cta: { ...c.cta!, url: e.target.value } })} />
            </Field>
          </div>
        </div>
      )}

      {c.imageRef !== undefined && (
        <Field label="Image URL" hint="Unsplash or hosted image">
          <TextInput value={c.imageRef ?? ""} onChange={(e) => set({ imageRef: e.target.value })} />
        </Field>
      )}

      {c.hashtags && (
        <Field label="Hashtags" hint="Space or newline separated">
          <TextArea
            rows={2}
            value={c.hashtags.join(" ")}
            onChange={(e) => set({ hashtags: e.target.value.split(/\s+/).filter(Boolean) })}
          />
        </Field>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-forest/15 bg-forest/5 p-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-forest">User Guidance · Handoff</span>
          {asset.platformTargets.length > 0 && <span className="text-[10px] text-ink/45">{assetPlatforms(asset).map((p) => PLATFORM_LABELS[p]).join(" · ")}</span>}
        </div>
        <p className="text-[11px] leading-relaxed text-ink/55">Suggested copy and tags are starting points. Verify the destination, offer details, and account handles before publishing.</p>
        {asset.family !== "EmailStage" && (
          <>
            <div className="relative">
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-ink/10 bg-surface px-3 py-2 text-[11px] leading-relaxed text-ink/75">{composeCopy(asset)}</pre>
              <button onClick={() => { void navigator.clipboard?.writeText(composeCopy(asset)); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-forest px-2 py-1 text-[10px] font-medium text-canvas"><Copy className="size-3" />{copied ? "Copied" : "Copy"}</button>
            </div>
            <div className="text-[11px] leading-relaxed text-ink/60"><span className="font-medium text-ink/75">Suggested @tags:</span> {asset.brandIds.map((b) => `@${b === "chirogoaz" ? "ChiroGoAZ" : b === "aromahmt" ? "AromaHMT" : "Renew48"}`).join(" · ")}</div>
          </>
        )}
      </div>

      {c.disclaimer !== undefined && (
        <Field label="Disclaimer">
          <TextArea rows={2} value={c.disclaimer ?? ""} onChange={(e) => set({ disclaimer: e.target.value })} />
        </Field>
      )}
    </div>
  );
}
