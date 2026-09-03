import type { ExportType, Platform, PlatformFormat, Surface } from "@/types";

const raster: ExportType[] = ["png", "jpg", "svg", "pdf"];

function fmt(
  platform: Platform,
  label: string,
  surface: Surface,
  width: number,
  height: number,
  density: PlatformFormat["density"],
  safe = 0.06,
  exportTypes: ExportType[] = raster,
): PlatformFormat {
  return {
    id: `${platform}-${surface}-${width}x${height}`,
    platform,
    label,
    surface,
    width,
    height,
    density,
    safeArea: {
      top: Math.round(height * safe),
      bottom: Math.round(height * safe),
      left: Math.round(width * safe),
      right: Math.round(width * safe),
    },
    exportTypes,
  };
}

export const PLATFORM_FORMATS: PlatformFormat[] = [
  fmt("email", "Email · Desktop", "email", 600, 800, "roomy", 0.04, ["html", "png", "pdf"]),
  fmt("instagram", "Instagram · Feed", "feed", 1080, 1080, "standard"),
  fmt("instagram", "Instagram · Portrait", "portrait", 1080, 1350, "standard"),
  fmt("instagram", "Instagram · Story/Reel", "story", 1080, 1920, "compact", 0.09),
  fmt("facebook", "Facebook · Feed", "landscape", 1200, 630, "compact"),
  fmt("facebook", "Facebook · Story", "story", 1080, 1920, "compact", 0.09),
  fmt("x", "X / Twitter · Post", "landscape", 1600, 900, "compact"),
  fmt("tiktok", "TikTok · Vertical", "story", 1080, 1920, "compact", 0.1),
  fmt("youtube", "YouTube · Thumbnail", "thumbnail", 1280, 720, "compact"),
  fmt("youtube", "YouTube · Shorts", "story", 1080, 1920, "compact", 0.1),
  fmt("gbp", "Google Business · Post", "landscape", 1200, 900, "standard"),
  fmt("yelp", "Yelp · Photo", "landscape", 1200, 800, "standard"),
  fmt("snapchat", "Snapchat · Vertical", "story", 1080, 1920, "compact", 0.1),
  fmt("linkedin", "LinkedIn · Feed", "landscape", 1200, 627, "compact"),
  fmt("linkedin", "LinkedIn · Square", "square", 1200, 1200, "standard"),
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  email: "Email",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X / Twitter",
  tiktok: "TikTok",
  youtube: "YouTube",
  gbp: "Google Business",
  yelp: "Yelp",
  snapchat: "Snapchat",
  linkedin: "LinkedIn",
};

export function formatsForPlatform(p: Platform): PlatformFormat[] {
  return PLATFORM_FORMATS.filter((f) => f.platform === p);
}

// Which surfaces a template family renders well into (applicability, not force-crop).
import type { TemplateFamily } from "@/types";
export const FAMILY_SURFACES: Record<TemplateFamily, Surface[]> = {
  EmailStage: ["email"],
  TeaserOverlay: ["email", "feed", "portrait", "story", "square"],
  FeedPost: ["feed", "portrait", "landscape", "square", "thumbnail"],
  StoryReel: ["story"],
  OfferCard: ["feed", "portrait", "story", "landscape", "square"],
  TestimonialCard: ["feed", "portrait", "landscape", "square"],
  PromoBanner: ["landscape", "cover", "thumbnail"],
  HowItWorks: ["feed", "portrait", "story", "landscape"],
  RewardTiers: ["feed", "portrait", "landscape", "square"],
  ShareLinkCard: ["feed", "portrait", "story", "square"],
  IconRow: ["feed", "landscape", "square"],
  ReferralOverview: ["email", "feed", "portrait", "landscape", "square"],
  FaqCard: ["email", "feed", "portrait", "landscape", "square"],
  CtaStrip: ["landscape", "cover", "thumbnail"],
};

export function isApplicable(family: TemplateFamily, f: PlatformFormat): boolean {
  return FAMILY_SURFACES[family].includes(f.surface);
}
