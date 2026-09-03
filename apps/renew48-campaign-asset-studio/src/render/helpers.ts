import type { Asset, Platform, PlatformFormat } from "@/types";
import { PLATFORM_FORMATS, isApplicable } from "@/data/platformFormats";

// Formats this asset actually targets AND that its template can render into.
export function applicableFormats(asset: Asset): PlatformFormat[] {
  return PLATFORM_FORMATS.filter(
    (f) => asset.platformTargets.includes(f.platform) && isApplicable(asset.family, f),
  );
}

export function defaultFormat(asset: Asset): PlatformFormat {
  return applicableFormats(asset)[0] ?? PLATFORM_FORMATS[1];
}

export function formatsForAssetOnPlatform(asset: Asset, platform: Platform): PlatformFormat[] {
  return applicableFormats(asset).filter((f) => f.platform === platform);
}

export function assetPlatforms(asset: Asset): Platform[] {
  const seen = new Set<Platform>();
  return applicableFormats(asset)
    .map((f) => f.platform)
    .filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
}
