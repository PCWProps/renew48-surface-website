import type { Asset, PlatformFormat } from "@/types";
import { exportBlob, assetFileName } from "@/export/exporter";

// Platform-specific post copy assembled from structured content.
export function composeCopy(asset: Asset): string {
  const c = asset.content;
  const lines: string[] = [];
  if (c.headline) lines.push(c.headline);
  if (c.subhead) lines.push(c.subhead);
  if (c.body) lines.push(c.body);
  if (c.offer) lines.push(`${c.offer.value}${c.offer.code ? ` — code ${c.offer.code}` : ""}`);
  if (c.referralUrl) lines.push(c.referralUrl);
  if (c.cta) lines.push(`${c.cta.label}: ${c.cta.url}`);
  if (c.hashtags?.length) lines.push(c.hashtags.join(" "));
  return lines.join("\n\n");
}

export function canWebShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export interface ShareResult {
  ok: boolean;
  method: "web-share" | "clipboard" | "unsupported";
  message: string;
}

export async function webShare(node: HTMLElement, asset: Asset, format: PlatformFormat): Promise<ShareResult> {
  const text = composeCopy(asset);
  const url = asset.content.cta?.url ? `https://${asset.content.cta.url.replace(/^https?:\/\//, "")}` : undefined;
  try {
    const blob = await exportBlob(node, asset, format, "png");
    const file = new File([blob], assetFileName(asset, format, "png"), { type: "image/png" });
    const data: ShareData = { title: asset.name, text, url };
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      (data as ShareData & { files: File[] }).files = [file];
    }
    if (navigator.share) {
      await navigator.share(data);
      return { ok: true, method: "web-share", message: "Shared via device share sheet." };
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") return { ok: false, method: "web-share", message: "Share cancelled." };
  }
  // Fallback: copy the composed caption
  try {
    await navigator.clipboard.writeText(text);
    return { ok: true, method: "clipboard", message: "Web Share unavailable — caption copied to clipboard." };
  } catch {
    return { ok: false, method: "unsupported", message: "Sharing not supported on this device." };
  }
}

// ---- Direct authenticated publishing (architecture; not wired at MVP) ----
export interface PublishProvider {
  platform: string;
  connected: boolean;
  authenticate: () => Promise<void>;
  publish: (asset: Asset, copy: string) => Promise<void>;
}

// Placeholder adapters advertise capability + connection state for the UI.
export const PUBLISH_PROVIDERS: { platform: string; label: string; connected: boolean; note: string }[] = [
  { platform: "linkedin", label: "LinkedIn", connected: false, note: "Requires OAuth + backend token exchange." },
  { platform: "facebook", label: "Facebook / Instagram", connected: false, note: "Meta Graph API — server-side auth required." },
  { platform: "x", label: "X / Twitter", connected: false, note: "OAuth 2.0 + media upload endpoint." },
  { platform: "youtube", label: "YouTube", connected: false, note: "Google OAuth — Shorts upload scope." },
];
