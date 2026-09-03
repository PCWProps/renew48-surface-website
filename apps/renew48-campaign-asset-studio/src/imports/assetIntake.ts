import JSZip from "jszip";

export type IntakeSourceKind = "individual" | "composite-board" | "archive";

export type IntakeGroup =
  | "Brand marks"
  | "Badges & markers"
  | "Typography"
  | "Color systems"
  | "Calls to action"
  | "Background imagery"
  | "Reference boards"
  | "Unsorted intake";

export interface IntakeAsset {
  id: string;
  name: string;
  originalName: string;
  group: IntakeGroup;
  sourceKind: IntakeSourceKind;
  mimeType: string;
  previewUrl?: string;
  size: number;
  note: string;
  needsIndividualSource: boolean;
}

export interface BoardAnalysis {
  width: number;
  height: number;
  aspect: number;
  likelyBoard: boolean;
  summary: string;
  nextStep: string;
}

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|svg|webp)$/i;
const FONT_EXTENSIONS = /\.(eot|otf|ttf|woff2?)$/i;

function mimeForName(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  return ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : ext === "avif" ? "image/avif" : "application/octet-stream";
}

function cleanName(path: string) {
  return path.split("/").pop()?.replace(/\.[^.]+$/, "") || path;
}

export function inferGroup(path: string, isLikelyBoard = false): IntakeGroup {
  const value = path.toLowerCase();
  if (isLikelyBoard || /board|mood|reference|brand.?kit|style.?guide|website.?example/.test(value)) return "Reference boards";
  if (/logo|wordmark|lockup|brand.?mark|identity/.test(value)) return "Brand marks";
  if (/badge|seal|marker|icon|emblem/.test(value)) return "Badges & markers";
  if (/font|type|typograph|woff|ttf|otf/.test(value)) return "Typography";
  if (/color|colour|palette|swatch|theme/.test(value)) return "Color systems";
  if (/cta|button|call.?to.?action/.test(value)) return "Calls to action";
  if (/background|hero|photo|image|texture|desert|landscape/.test(value)) return "Background imagery";
  return "Unsorted intake";
}

function likelyCompositeBoard(name: string, width: number, height: number) {
  const ratio = width / Math.max(height, 1);
  return /board|mood|reference|brand.?kit|style.?guide|website.?example/.test(name.toLowerCase()) || ratio > 1.45 || ratio < 0.68;
}

export async function analyzeImage(file: Blob, name: string): Promise<BoardAnalysis | undefined> {
  if (!file.type.startsWith("image/") && !IMAGE_EXTENSIONS.test(name)) return undefined;
  try {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    await image.decode();
    URL.revokeObjectURL(url);
    const aspect = image.width / Math.max(image.height, 1);
    const likelyBoard = likelyCompositeBoard(name, image.width, image.height);
    return {
      width: image.width,
      height: image.height,
      aspect,
      likelyBoard,
      summary: likelyBoard
        ? `Composite reference detected at ${image.width} × ${image.height}. The board can guide composition, color, type, and spacing.`
        : `Individual image detected at ${image.width} × ${image.height}. It can be used as a selectable source asset.`,
      nextStep: likelyBoard
        ? "Keep this board as a visual reference, then add individual logos, badges, and marks for exact reuse."
        : "Label this source and assign it to a group before using it in a generated asset.",
    };
  } catch {
    return undefined;
  }
}

function toAsset(file: Blob, name: string, sourceKind: IntakeSourceKind, path = name, analysis?: BoardAnalysis): IntakeAsset {
  const isBoard = analysis?.likelyBoard ?? false;
  const group = isBoard ? "Reference boards" : inferGroup(path);
  return {
    id: `intake-${crypto.randomUUID()}`,
    name: cleanName(name),
    originalName: path,
    group,
    sourceKind,
    mimeType: file.type || mimeForName(path),
    previewUrl: file.type.startsWith("image/") || IMAGE_EXTENSIONS.test(path) ? URL.createObjectURL(file) : undefined,
    size: file.size,
    note: isBoard
      ? "Reference only — use this board to guide the visual system; do not crop the whole board into a deliverable."
      : FONT_EXTENSIONS.test(name)
        ? "Source font preserved for the type system."
        : "Selectable source asset available for labeling and reuse.",
    needsIndividualSource: isBoard && /logo|wordmark|badge|seal|mark|identity/i.test(name),
  };
}

export async function intakeFiles(files: FileList | File[]): Promise<{ assets: IntakeAsset[]; boards: BoardAnalysis[] }> {
  const assets: IntakeAsset[] = [];
  const boards: BoardAnalysis[] = [];
  for (const file of Array.from(files)) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.values(zip.files).filter((entry) => !entry.dir && !entry.name.startsWith("__MACOSX/") && !entry.name.split("/").pop()?.startsWith("."));
      for (const entry of entries) {
        const blob = await entry.async("blob");
        const analysis = await analyzeImage(blob, entry.name);
        if (analysis) boards.push(analysis);
        assets.push(toAsset(blob, cleanName(entry.name), "archive", entry.name, analysis));
      }
      continue;
    }
    const analysis = await analyzeImage(file, file.name);
    if (analysis) boards.push(analysis);
    assets.push(toAsset(file, file.name, analysis?.likelyBoard ? "composite-board" : "individual", file.name, analysis));
  }
  return { assets, boards };
}

export function releaseIntakeUrls(assets: IntakeAsset[]) {
  for (const asset of assets) {
    if (asset.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
  }
}
