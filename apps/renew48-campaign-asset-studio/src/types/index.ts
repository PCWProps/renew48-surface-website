// Core domain types for the Campaign Asset Studio.
// Principle: an asset = data (content) + template + platform format, composed by the render engine.

export type WorkflowStatus =
  | "Draft"
  | "Review"
  | "Changes Requested"
  | "Approved"
  | "Ready"
  | "Published";

export const WORKFLOW_ORDER: WorkflowStatus[] = [
  "Draft",
  "Review",
  "Changes Requested",
  "Approved",
  "Ready",
  "Published",
];

export type BrandId = "renew48" | "chirogoaz" | "aromahmt";

export type BrandAssetVariant =
  | "primary" // horizontal wordmark / primary logo
  | "wordmark"
  | "badge"
  | "lockup"
  | "squareAvatar"
  | "circleAvatar";

export type Tone = "light" | "dark";

export interface BrandAsset {
  id: string;
  brandId: BrandId;
  name: string;
  variant: BrandAssetVariant;
  tone: Tone; // does the mark read best on light or dark surface
  path: string; // under /assets
  aspect?: number; // w/h for horizontal marks
}

export interface Brand {
  id: BrandId;
  name: string;
  role: "umbrella" | "participating";
  subTagline: string;
  color: string;
  accent: string;
}

// ---- Platform format matrix ----
export type Platform =
  | "email"
  | "instagram"
  | "facebook"
  | "x"
  | "tiktok"
  | "youtube"
  | "gbp"
  | "yelp"
  | "snapchat"
  | "linkedin";

export type Surface =
  | "email"
  | "feed"
  | "portrait"
  | "story"
  | "landscape"
  | "thumbnail"
  | "cover"
  | "square"
  | "profile";

export interface PlatformFormat {
  id: string;
  platform: Platform;
  label: string;
  surface: Surface;
  width: number;
  height: number;
  safeArea: { top: number; right: number; bottom: number; left: number };
  density: "compact" | "standard" | "roomy";
  exportTypes: ExportType[];
}

export type ExportType = "png" | "jpg" | "svg" | "pdf" | "html";

// ---- Asset content ----
export type TemplateFamily =
  | "EmailStage"
  | "TeaserOverlay"
  | "FeedPost"
  | "StoryReel"
  | "OfferCard"
  | "TestimonialCard"
  | "PromoBanner"
  | "HowItWorks"
  | "RewardTiers"
  | "ShareLinkCard"
  | "IconRow"
  | "ReferralOverview"
  | "FaqCard"
  | "CtaStrip";

export interface AssetContent {
  eyebrow?: string;
  scriptAccent?: string;
  headline: string;
  subhead?: string;
  body?: string;
  bullets?: string[];
  cta?: { label: string; url: string };
  offer?: { value: string; code?: string; expiry?: string };
  reward?: { amount: string; tier?: string };
  referralUrl?: string;
  testimonial?: { quote: string; attribution: string };
  steps?: { title: string; detail: string }[];
  tiers?: { count: string; reward: string }[];
  faq?: { question: string; answer: string }[];
  imageRef?: string; // unsplash url
  hashtags?: string[];
  disclaimer?: string;
  review?: string[]; // fields flagged for human review
}

export interface Asset {
  id: string;
  phaseId: string;
  name: string;
  family: TemplateFamily;
  purpose: string;
  content: AssetContent;
  brandIds: BrandId[];
  platformTargets: Platform[];
  status: WorkflowStatus;
}

export interface Phase {
  id: string;
  campaignId: string;
  name: string;
  sequence: number;
  dayOffset: number;
  purpose: string;
}

export interface Campaign {
  id: string;
  name: string;
  theme: string;
  tagline: string;
  brandIds: BrandId[];
  status: WorkflowStatus;
}

export interface WorkflowEvent {
  id: string;
  assetId: string;
  from: WorkflowStatus;
  to: WorkflowStatus;
  note?: string;
  at: number;
}
