import type { Brand, BrandAsset, BrandId } from "@/types";

const APP_ASSETS = `${import.meta.env.BASE_URL}assets/`;

// Authoritative brand identities. Renew48 is the umbrella collective over the two practices.
export const BRANDS: Record<BrandId, Brand> = {
  renew48: {
    id: "renew48",
    name: "Renew48 Wellness Collective",
    role: "umbrella",
    subTagline: "Rooted in the desert. Elevated by care.",
    color: "var(--color-renew)",
    accent: "var(--color-gold)",
  },
  chirogoaz: {
    id: "chirogoaz",
    name: "ChiroGoAZ",
    role: "participating",
    subTagline: "Move Better. Live Better.",
    color: "var(--color-chiro)",
    accent: "var(--color-chiro-accent)",
  },
  aromahmt: {
    id: "aromahmt",
    name: "AromaHMT",
    role: "participating",
    subTagline: "Healing Massage Therapy",
    color: "var(--color-aroma)",
    accent: "var(--color-aroma-accent)",
  },
};

// Canonical manifest of the linked R48 Brand Kit assets committed to public/assets.
// Used directly — never traced, typeset, or regenerated.
export const BRAND_ASSETS: BrandAsset[] = [
  // Renew48
  { id: "renew48-primary", brandId: "renew48", name: "Renew48 primary logo", variant: "primary", tone: "light", path: `${APP_ASSETS}3e8fa.png`, aspect: 2.6 },
  { id: "renew48-cactus", brandId: "renew48", name: "Renew48 botanical cactus lockup", variant: "lockup", tone: "light", path: `${APP_ASSETS}7bb3d.png`, aspect: 1.4 },
  { id: "renew48-badge-wc", brandId: "renew48", name: "Wellness Collective badge", variant: "badge", tone: "light", path: `${APP_ASSETS}3db6b.png`, aspect: 1 },
  { id: "renew48-badge-member", brandId: "renew48", name: "Collective Member badge", variant: "badge", tone: "light", path: `${APP_ASSETS}e2056.png`, aspect: 1 },

  // ChiroGoAZ
  { id: "chiro-wordmark", brandId: "chirogoaz", name: "ChiroGoAZ wordmark", variant: "wordmark", tone: "light", path: `${APP_ASSETS}chirogoaz-wordmark.png`, aspect: 3.0 },
  { id: "chiro-sq-dark", brandId: "chirogoaz", name: "ChiroGoAZ CG square (dark)", variant: "squareAvatar", tone: "dark", path: `${APP_ASSETS}aea4b.png`, aspect: 1 },
  { id: "chiro-sq-light", brandId: "chirogoaz", name: "ChiroGoAZ cactus square (light)", variant: "squareAvatar", tone: "light", path: `${APP_ASSETS}56a13.png`, aspect: 1 },
  { id: "chiro-circle-green", brandId: "chirogoaz", name: "ChiroGoAZ CG circle", variant: "circleAvatar", tone: "dark", path: `${APP_ASSETS}47622.png`, aspect: 1 },
  { id: "chiro-circle-desert", brandId: "chirogoaz", name: "ChiroGoAZ desert circle", variant: "circleAvatar", tone: "light", path: `${APP_ASSETS}8bc17.png`, aspect: 1 },

  // AromaHMT
  { id: "aroma-wordmark", brandId: "aromahmt", name: "AromaHMT wordmark", variant: "wordmark", tone: "light", path: `${APP_ASSETS}aromahmt-wordmark.png`, aspect: 3.1 },
  { id: "aroma-sq-dark", brandId: "aromahmt", name: "AromaHMT AH square (dark)", variant: "squareAvatar", tone: "dark", path: `${APP_ASSETS}508cc.png`, aspect: 1 },
  { id: "aroma-sq-light", brandId: "aromahmt", name: "AromaHMT AH lotus square (light)", variant: "squareAvatar", tone: "light", path: `${APP_ASSETS}846f2.png`, aspect: 1 },
  { id: "aroma-circle", brandId: "aromahmt", name: "AromaHMT AH circle", variant: "circleAvatar", tone: "light", path: `${APP_ASSETS}0ae97.png`, aspect: 1 },
  { id: "aroma-circle-stones", brandId: "aromahmt", name: "AromaHMT AH circle (stones)", variant: "circleAvatar", tone: "light", path: `${APP_ASSETS}349fd.png`, aspect: 1 },
];

export function assetsForBrand(brandId: BrandId): BrandAsset[] {
  return BRAND_ASSETS.filter((a) => a.brandId === brandId);
}

// Variant auto-selection: pick the right mark for a context.
export function pickBrandAsset(
  brandId: BrandId,
  opts: { context: "wordmark" | "avatar" | "badge"; surfaceTone: Tone; round?: boolean },
): BrandAsset | undefined {
  const pool = assetsForBrand(brandId);
  const { context, surfaceTone, round } = opts;

  if (context === "badge") {
    return pool.find((a) => a.variant === "badge") ?? pool.find((a) => a.variant === "lockup");
  }
  if (context === "avatar") {
    const wantVariant: BrandAssetVariant = round ? "circleAvatar" : "squareAvatar";
    // prefer a mark that contrasts the surface: dark surface -> light mark, and vice versa
    const wantTone: Tone = surfaceTone === "dark" ? "light" : "dark";
    return (
      pool.find((a) => a.variant === wantVariant && a.tone === wantTone) ??
      pool.find((a) => a.variant === wantVariant) ??
      pool.find((a) => a.variant === "circleAvatar" || a.variant === "squareAvatar")
    );
  }
  // wordmark / horizontal
  return (
    pool.find((a) => a.variant === "wordmark") ??
    pool.find((a) => a.variant === "primary") ??
    pool.find((a) => a.variant === "lockup")
  );
}

type BrandAssetVariant = BrandAsset["variant"];
type Tone = BrandAsset["tone"];
