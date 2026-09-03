import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import type { Asset, ExportType, PlatformFormat } from "@/types";

const APP_ASSETS = `${import.meta.env.BASE_URL}assets/`;

const esc = (value = "") =>
  value.replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[char] ?? char);

function absoluteAssetUrl(path?: string) {
  if (!path) return "";
  if (/^(https?:|data:|cid:)/i.test(path)) return path;
  return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

// MailPoet accepts a normal HTML document, but its importer is much more reliable
// when the email itself is table-based and all presentation styles are inline.
function mailPoetHtml(asset: Asset): string {
  const c = asset.content;
  const image = absoluteAssetUrl(c.imageRef);
  const logo = absoluteAssetUrl(`${APP_ASSETS}founding-member-lockup.png`);
  const bullets = (c.bullets ?? []).map((item) => `<tr><td style="padding:0 0 10px;color:#23291f;font:15px/1.5 Arial,sans-serif;">&#9670;&nbsp; ${esc(item)}</td></tr>`).join("");
  const testimonial = c.testimonial
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 22px;background:#f4efe6;border:1px solid #ddd3c2;"><tr><td style="padding:22px 24px;text-align:center;color:#2f4630;font:italic 18px/1.45 Georgia,serif;">“${esc(c.testimonial.quote)}”<br><span style="display:inline-block;margin-top:12px;color:#c96f43;font:600 12px/1.4 Arial,sans-serif;">${esc(c.testimonial.attribution)}</span></td></tr></table>`
    : "";
  const offer = c.offer
    ? `<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 20px;background:#2f4630;"><tr><td style="padding:14px 24px;color:#f4efe6;font:700 24px/1 Arial,sans-serif;letter-spacing:1px;text-align:center;">${esc(c.offer.value)}${c.offer.code ? `<br><span style="font:500 12px/1.4 Arial,sans-serif;letter-spacing:2px;">CODE ${esc(c.offer.code)}</span>` : ""}</td></tr></table>`
    : "";
  const cta = c.cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:6px 0 0;"><tr><td style="background:#2f4630;"><a href="${esc(c.cta.url)}" style="display:inline-block;padding:13px 22px;color:#f4efe6;text-decoration:none;font:700 12px/1 Arial,sans-serif;letter-spacing:.4px;text-transform:uppercase;">${esc(c.cta.label)}</a></td></tr></table>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.headline)}</title></head><body style="margin:0;padding:0;background:#efe8db;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(c.subhead ?? c.body ?? c.headline)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#efe8db;"><tr><td align="center" style="padding:24px 12px;"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fbf8f2;"><tr><td align="center" style="padding:22px 28px;background:#1f2f20;"><img src="${logo}" width="480" alt="ChiroGoAZ · Renew48 · AromaHMT" style="display:block;width:100%;max-width:480px;height:auto;border:0;"></td></tr><tr><td style="padding:34px 40px 12px;text-align:center;"><div style="color:#c96f43;font:700 11px/1.3 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">${esc(c.eyebrow)}</div><div style="margin-top:8px;color:#c96f43;font:italic 28px/1.1 Georgia,serif;">${esc(c.scriptAccent)}</div><h1 style="margin:8px 0 0;color:#1f2f20;font:600 32px/1.08 Georgia,serif;">${esc(c.headline)}</h1>${c.subhead ? `<p style="margin:12px 0 0;color:#7c8b6a;font:15px/1.5 Arial,sans-serif;">${esc(c.subhead)}</p>` : ""}</td></tr>${image ? `<tr><td style="padding:0 40px;"><img src="${esc(image)}" width="520" alt="" style="display:block;width:100%;height:260px;object-fit:cover;border:0;"></td></tr>` : ""}<tr><td style="padding:24px 40px 34px;color:#57604c;font:15px/1.6 Arial,sans-serif;"><p style="margin:0 0 18px;">${esc(c.body)}</p>${testimonial}${offer}${bullets ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">${bullets}</table>` : ""}${cta}${c.disclaimer ? `<p style="margin:18px 0 0;color:#8a8f82;font:11px/1.4 Arial,sans-serif;">${esc(c.disclaimer)}</p>` : ""}</td></tr><tr><td align="center" style="padding:22px 28px;background:#1f2f20;color:#d9a441;font:11px/1.4 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">Rooted in the desert · Elevated by care · Inspired by movement<br><span style="display:inline-block;margin-top:10px;color:#aeb7a5;font:11px/1.4 Arial,sans-serif;letter-spacing:0;text-transform:none;">Manage preferences · Unsubscribe</span></td></tr></table></td></tr></table></body></html>`;
}

// Deterministic filename: {campaign}-{phase}-{family}-{platform}-{w}x{h}.{ext}
export function assetFileName(asset: Asset, format: PlatformFormat, ext: string) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug(asset.name)}-${format.platform}-${format.width}x${format.height}.${ext}`;
}

// The DOM node passed here is the true-dimension export node (data-export-node).
async function raster(node: HTMLElement, format: PlatformFormat, type: "png" | "jpg"): Promise<Blob> {
  const opts = {
    width: format.width,
    height: format.height,
    canvasWidth: format.width,
    canvasHeight: format.height,
    pixelRatio: 1,
    cacheBust: true,
    style: { transform: "none", transformOrigin: "top left" },
  };
  const dataUrl = type === "png" ? await toPng(node, opts) : await toJpeg(node, { ...opts, quality: 0.92 });
  const res = await fetch(dataUrl);
  return res.blob();
}

async function pdf(node: HTMLElement, format: PlatformFormat): Promise<Blob> {
  const dataUrl = await toPng(node, {
    width: format.width,
    height: format.height,
    canvasWidth: format.width,
    canvasHeight: format.height,
    pixelRatio: 1,
    cacheBust: true,
    style: { transform: "none" },
  });
  const doc = new jsPDF({
    orientation: format.width >= format.height ? "landscape" : "portrait",
    unit: "px",
    format: [format.width, format.height],
  });
  doc.addImage(dataUrl, "PNG", 0, 0, format.width, format.height);
  return doc.output("blob");
}

export async function exportBlob(node: HTMLElement, asset: Asset, format: PlatformFormat, type: ExportType): Promise<Blob> {
  if (type === "png") return raster(node, format, "png");
  if (type === "jpg") return raster(node, format, "jpg");
  if (type === "pdf") return pdf(node, format);
  if (type === "svg") {
    // Wrap the raster in an SVG foreignObject-free image for portability.
    const dataUrl = await toPng(node, { width: format.width, height: format.height, pixelRatio: 1, cacheBust: true, style: { transform: "none" } });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${format.width}" height="${format.height}" viewBox="0 0 ${format.width} ${format.height}"><image href="${dataUrl}" width="${format.width}" height="${format.height}"/></svg>`;
    return new Blob([svg], { type: "image/svg+xml" });
  }
  return new Blob([mailPoetHtml(asset)], { type: "text/html;charset=utf-8" });
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadOne(node: HTMLElement, asset: Asset, format: PlatformFormat, type: ExportType) {
  const blob = await exportBlob(node, asset, format, type);
  download(blob, assetFileName(asset, format, type));
}

// Bundle a set of {node, asset, format} into a ZIP under Campaign/Phase folders.
export async function exportPackage(
  items: { node: HTMLElement; asset: Asset; format: PlatformFormat; folder: string }[],
  type: ExportType,
  packageName: string,
) {
  const zip = new JSZip();
  const manifest: Record<string, unknown>[] = [];
  for (const it of items) {
    const blob = await exportBlob(it.node, it.asset, it.format, type);
    const name = assetFileName(it.asset, it.format, type);
    zip.file(`${it.folder}/${name}`, blob);
    manifest.push({ file: `${it.folder}/${name}`, asset: it.asset.name, platform: it.format.platform, width: it.format.width, height: it.format.height, status: it.asset.status });
  }
  zip.file("manifest.json", JSON.stringify({ package: packageName, generatedAt: new Date().toISOString(), assets: manifest }, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, `${packageName}.zip`);
}
