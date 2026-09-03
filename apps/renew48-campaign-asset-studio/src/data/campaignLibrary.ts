export type CampaignLibraryItem = {
  path: string;
  campaign: "Committed to Wellness" | "Referral Program" | "Unleashed" | "Campaign references";
  kind: "image" | "vector" | "email" | "document";
};

// Mirrors the approved source folders copied into public/campaign-library.
export const CAMPAIGN_LIBRARY: CampaignLibraryItem[] = [
  { path: "/campaign-library/Marketing-Campaign.png", campaign: "Campaign references", kind: "image" },
  { path: "/campaign-library/emailcampaign.png", campaign: "Campaign references", kind: "image" },
  { path: "/campaign-library/marketing-assets-1.png", campaign: "Campaign references", kind: "image" },
  { path: "/campaign-library/marketing-assets-2.png", campaign: "Campaign references", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-launch-email-campaign.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-launch-email-campaign-2.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-launch-social-campaign.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-launch-social-campaign-2.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-social-marketing-options-1.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-social-marketing-options-2.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/ctw-campaign/ctw-social-marketing-options-3.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/committed-to-wellness-desert-dawn.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/email-reference-preview.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/feed-post.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/feed-post.svg", campaign: "Committed to Wellness", kind: "vector" },
  { path: "/campaign-library/renew48-campaign-assets-6/mailpoet-email.html", campaign: "Committed to Wellness", kind: "email" },
  { path: "/campaign-library/renew48-campaign-assets-6/renew48-badge.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/renew48-logo.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/story-reel.png", campaign: "Committed to Wellness", kind: "image" },
  { path: "/campaign-library/renew48-campaign-assets-6/story-reel.svg", campaign: "Committed to Wellness", kind: "vector" },
  { path: "/campaign-library/referral-campaign/referral-program-email-campaign.png", campaign: "Referral Program", kind: "image" },
  { path: "/campaign-library/referral-campaign/referral-program-site-assets.png", campaign: "Referral Program", kind: "image" },
  { path: "/campaign-library/referral-campaign/referral-program-social-campaign.png", campaign: "Referral Program", kind: "image" },
  { path: "/campaign-library/referral-campaign/referral-program-social-campaign-2.png", campaign: "Referral Program", kind: "image" },
  { path: "/campaign-library/referral-campaign/referral-program-social-campaign-3.png", campaign: "Referral Program", kind: "image" },
  { path: "/campaign-library/unleashed/Unleashed-campaign.png", campaign: "Unleashed", kind: "image" },
  { path: "/campaign-library/unleashed/Unleashed-sq.png", campaign: "Unleashed", kind: "image" },
  ...Array.from({ length: 9 }, (_, index) => ({
    path: `/campaign-library/unleashed/unleasehed${index + 2}.png`,
    campaign: "Unleashed" as const,
    kind: "image" as const,
  })),
  { path: "/campaign-library/unleashed/unleshed.png", campaign: "Unleashed", kind: "image" },
  { path: "/campaign-library/unleashed/brand-kit-raw-assets28.png", campaign: "Unleashed", kind: "image" },
  { path: "/campaign-library/unleashed/UNLEASHED_Post_01_Committed_to_Wellness.docx", campaign: "Unleashed", kind: "document" },
];
