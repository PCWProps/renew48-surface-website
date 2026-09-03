import type { BrandId, Tone } from "@/types";
import { BRANDS, pickBrandAsset } from "@/data/brandAssets";

interface BrandLogoProps {
  brandId: BrandId;
  context?: "wordmark" | "avatar" | "badge";
  surfaceTone?: Tone;
  round?: boolean;
  height?: number; // px
  className?: string;
}

// Renders a linked R48 Brand Kit asset (never traced/typeset). Auto-selects the
// right variant for the given background + context.
export function BrandLogo({
  brandId,
  context = "wordmark",
  surfaceTone = "light",
  round,
  height = 40,
  className,
}: BrandLogoProps) {
  const asset = pickBrandAsset(brandId, { context, surfaceTone, round });
  if (!asset) return null;
  return (
    <img
      src={asset.path}
      alt={`${BRANDS[brandId].name} logo`}
      style={{ height }}
      className={`w-auto object-contain select-none ${className ?? ""}`}
      draggable={false}
    />
  );
}

// Co-brand treatment: Renew48 as parent, participating brands beneath a hairline.
export function LogoLockup({
  brandIds,
  surfaceTone = "light",
  size = 40,
  align = "center",
}: {
  brandIds: BrandId[];
  surfaceTone?: Tone;
  size?: number;
  align?: "left" | "center";
}) {
  const umbrella = brandIds.find((b) => BRANDS[b].role === "umbrella");
  const participating = brandIds.filter((b) => BRANDS[b].role === "participating");
  const line = surfaceTone === "dark" ? "rgba(255,255,255,.28)" : "rgba(35,41,31,.18)";
  const items = align === "center" ? "items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-2 ${items}`}>
      {umbrella && <BrandLogo brandId={umbrella} context="wordmark" surfaceTone={surfaceTone} height={size} />}
      {participating.length > 0 && (
        <div className="flex items-center gap-3" style={{ borderTop: umbrella ? `1px solid ${line}` : "none", paddingTop: umbrella ? 8 : 0 }}>
          {participating.map((b, i) => (
            <div key={b} className="flex items-center gap-3">
              {i > 0 && <span style={{ width: 1, height: size * 0.6, background: line }} />}
              <BrandLogo brandId={b} context="wordmark" surfaceTone={surfaceTone} height={size * 0.72} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
