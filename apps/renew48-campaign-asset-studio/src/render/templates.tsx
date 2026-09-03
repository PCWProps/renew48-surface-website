import type { CSSProperties, ReactNode } from "react";
import type { Asset, BrandId, PlatformFormat, Tone } from "@/types";
import { BrandLogo, LogoLockup } from "@/components/BrandLogo";

// Palette used by rendered assets (resolved hex so exporters capture them).
const C = {
  cream: "#f4efe6",
  surface: "#fbf8f2",
  surface2: "#efe8db",
  ink: "#23291f",
  inkSoft: "#57604c",
  forest: "#2f4630",
  forestDeep: "#1f2f20",
  sage: "#7c8b6a",
  terracotta: "#c96f43",
  gold: "#d9a441",
  clay: "#b0532f",
  line: "rgba(35,41,31,.14)",
};

const APP_ASSETS = `${import.meta.env.BASE_URL}assets/`;

export interface TemplateProps {
  asset: Asset;
  format: PlatformFormat;
}

const isVertical = (f: PlatformFormat) => f.height / f.width >= 1.15;
const isWide = (f: PlatformFormat) => f.width / f.height >= 1.4;

// scale unit relative to a 1080 baseline
const unit = (f: PlatformFormat) => Math.min(f.width, f.height) / 1080;

function Photo({ src, style }: { src?: string; style?: CSSProperties }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      crossOrigin="anonymous"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }}
    />
  );
}

// Desert photography shown as a framed, rounded inset (the reference's signature).
function FramedPhoto({ src, u, style }: { src?: string; u: number; style?: CSSProperties }) {
  if (!src) return null;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 22 * u,
        border: `1px solid ${C.line}`,
        boxShadow: `0 ${20 * u}px ${44 * u}px rgba(31,47,32,.12)`,
        background: C.surface2,
        ...style,
      }}
    >
      <Photo src={src} />
    </div>
  );
}

function Eyebrow({ children, u, color = C.terracotta }: { children: ReactNode; u: number; color?: string }) {
  if (!children) return null;
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 21 * u,
        letterSpacing: 4.5 * u,
        fontWeight: 600,
        color,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function Script({ children, u, color = C.terracotta, size = 66 }: { children: ReactNode; u: number; color?: string; size?: number }) {
  if (!children) return null;
  return (
    <div style={{ fontFamily: "var(--font-script)", fontSize: size * u, lineHeight: 0.95, color, fontWeight: 600 }}>
      {children}
    </div>
  );
}

function Headline({ children, u, color = C.forestDeep, size = 76 }: { children: ReactNode; u: number; color?: string; size?: number }) {
  return (
    <div style={{ fontFamily: "var(--font-serif)", fontSize: size * u, lineHeight: 1.03, fontWeight: 600, color, letterSpacing: -0.5 * u }}>
      {children}
    </div>
  );
}

function Body({ children, u, color = C.inkSoft, size = 27 }: { children: ReactNode; u: number; color?: string; size?: number }) {
  if (!children) return null;
  return <div style={{ fontFamily: "var(--font-sans)", fontSize: size * u, lineHeight: 1.5, color, maxWidth: 660 * u }}>{children}</div>;
}

type CTATone = "forest" | "terracotta" | "glass" | "cream";
function CTA({ label, u, tone = "forest" }: { label: string; u: number; tone?: CTATone }) {
  const map: Record<CTATone, CSSProperties> = {
    forest: { background: C.forest, color: C.cream, border: "none" },
    terracotta: { background: C.terracotta, color: "#fff", border: "none" },
    cream: { background: C.cream, color: C.forestDeep, border: "none" },
    glass: { background: "rgba(255,255,255,.16)", color: "#fff", border: "1px solid rgba(255,255,255,.55)" },
  };
  return (
    <div
      className={tone === "glass" ? "lg-btn" : ""}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10 * u,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 25 * u,
        letterSpacing: 0.3 * u,
        padding: `${17 * u}px ${34 * u}px`,
        borderRadius: 999,
        ...map[tone],
      }}
    >
      {label}
      <span style={{ fontSize: 28 * u, lineHeight: 0 }}>→</span>
    </div>
  );
}

function Hashtags({ tags, u, color = C.sage }: { tags?: string[]; u: number; color?: string }) {
  if (!tags?.length) return null;
  return (
    <div style={{ fontFamily: "var(--font-sans)", fontSize: 20 * u, color, display: "flex", gap: 12 * u, flexWrap: "wrap" }}>
      {tags.slice(0, 4).map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

function Frame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: "absolute", inset: 0, background: C.cream, overflow: "hidden", ...style }}>{children}</div>;
}

// Soft botanical/sun ornament used on cream editorial grounds.
function SunMark({ u, color = C.gold, size = 40, style }: { u: number; color?: string; size?: number; style?: CSSProperties }) {
  const s = size * u;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={style} aria-hidden>
      <circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * 7}
            y1={12 + Math.sin(a) * 7}
            x2={12 + Math.cos(a) * 9.5}
            y2={12 + Math.sin(a) * 9.5}
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// warm scrim over story photos — lighter and warmer than a flat forest wash
function StoryScrim() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(31,47,32,.82) 0%, rgba(31,47,32,.28) 46%, rgba(31,47,32,.08) 72%, rgba(176,83,47,.14) 100%)",
      }}
    />
  );
}

function BrandRow({ brandIds, tone, u, align = "left" }: { brandIds: BrandId[]; tone: Tone; u: number; align?: "left" | "center" }) {
  return <LogoLockup brandIds={brandIds} surfaceTone={tone} size={34 * u} align={align} />;
}

// footer tagline band echoing the reference's green ribbon
function TaglineBand({ u }: { u: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 * u }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 16 * u, letterSpacing: 3 * u, color: C.sage, textTransform: "uppercase" }}>
        Rooted in the desert
      </span>
      <SunMark u={u} size={22} color={C.gold} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 16 * u, letterSpacing: 3 * u, color: C.sage, textTransform: "uppercase" }}>
        Elevated by care
      </span>
    </div>
  );
}

// ---------- Template families ----------

// First-launch teaser: the approved campaign treatment is a full-bleed Arizona
// desert image integrated with a soft ivory overlay, with Renew48 leading and
// the two practices supporting in the lower lockup.
function TeaserOverlay({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const vertical = isVertical(format);
  const pad = 62 * u;
  const supporters = brandIds.filter((id) => id !== "renew48");
  return (
    <Frame style={{ background: C.forestDeep }}>
      <Photo src={content.imageRef} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(244,239,230,.05) 25%, rgba(244,239,230,.18) 42%, rgba(251,248,242,.96) 68%, rgba(251,248,242,.99) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: pad }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 * u }}>
          <BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={vertical ? 78 * u : 66 * u} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14 * u, letterSpacing: 2.5 * u, color: C.inkSoft, textTransform: "uppercase" }}>Renew48 Wellness Collective</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 * u, maxWidth: 860 * u, alignSelf: "center" }}>
          {content.eyebrow && <Eyebrow u={u}>{content.eyebrow}</Eyebrow>}
          {content.scriptAccent && <Script u={u} color={C.forestDeep} size={vertical ? 60 : 54}>{content.scriptAccent}</Script>}
          <Headline u={u} color={C.forestDeep} size={vertical ? 72 : 62}>{content.headline}</Headline>
          <Body u={u} color={C.inkSoft} size={vertical ? 25 : 23}>{content.body}</Body>
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 * u, marginTop: 8 * u }}>
            <span style={{ width: 120 * u, height: 1, background: "rgba(201,166,107,.8)" }} />
            <SunMark u={u} size={24} color={C.gold} />
            <span style={{ width: 120 * u, height: 1, background: "rgba(201,166,107,.8)" }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16 * u, letterSpacing: 2.5 * u, color: C.forestDeep, textTransform: "uppercase" }}>Committed to Wellness · Launching Soon</span>
          {content.cta && <CTA label={content.cta.label} u={u} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * u }}>
          {supporters.length > 0 && <LogoLockup brandIds={supporters} surfaceTone="light" size={28 * u} align="center" />}
          <Hashtags tags={content.hashtags} u={u} />
        </div>
      </div>
    </Frame>
  );
}

// Light editorial card: cream ground, serif + script headline, framed desert photo.
function FeedPost({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 66 * u;
  const wide = isWide(format);

  const TextCol = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 * u, flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 * u }}>
        <BrandRow brandIds={brandIds} tone="light" u={u} />
        <SunMark u={u} size={34} color={C.gold} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 * u }}>
        <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
        {content.scriptAccent && <Script u={u} size={wide ? 60 : 72}>{content.scriptAccent}</Script>}
        <Headline u={u} size={wide ? 58 : 70}>{content.headline}</Headline>
        <Body u={u}>{content.body}</Body>
        {content.cta && <div style={{ marginTop: 10 * u }}><CTA label={content.cta.label} u={u} /></div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 * u }}>
        <Hashtags tags={content.hashtags} u={u} />
      </div>
    </div>
  );

  if (wide) {
    return (
      <Frame>
        <div style={{ position: "absolute", inset: 0, display: "flex", gap: pad * 0.7, padding: pad }}>
          {TextCol}
          {content.imageRef && <FramedPhoto src={content.imageRef} u={u} style={{ width: "42%", height: "100%" }} />}
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 28 * u, padding: pad }}>
        {TextCol}
        {content.imageRef && <FramedPhoto src={content.imageRef} u={u} style={{ width: "100%", height: isVertical(format) ? "42%" : "38%" }} />}
      </div>
    </Frame>
  );
}

// Story/Reel: full-bleed desert photo, warm scrim, cream text, green pill chip up top.
function StoryReel({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 78 * u;
  return (
    <Frame style={{ background: C.forestDeep }}>
      <Photo src={content.imageRef} />
      <StoryScrim />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: pad, textAlign: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 * u, alignItems: "center" }}>
          {content.eyebrow && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18 * u,
                letterSpacing: 3 * u,
                textTransform: "uppercase",
                color: C.forestDeep,
                background: C.cream,
                padding: `${10 * u}px ${22 * u}px`,
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              {content.eyebrow}
            </span>
          )}
          <BrandRow brandIds={brandIds} tone="dark" u={u} align="center" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 * u, alignItems: "center" }}>
          {content.scriptAccent && <Script u={u} color={C.gold} size={78}>{content.scriptAccent}</Script>}
          <Headline u={u} color="#fff" size={88}>{content.headline}</Headline>
          <Body u={u} color="rgba(255,255,255,.92)" size={30}>{content.body}</Body>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 * u, alignItems: "center" }}>
          {content.cta && <CTA label={content.cta.label} u={u} tone="cream" />}
          <Hashtags tags={content.hashtags} u={u} color="rgba(255,255,255,.72)" />
        </div>
      </div>
    </Frame>
  );
}

// Offer / launch special / reward: warm sunset ground, big number, green CTA.
function OfferCard({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 68 * u;
  const bigValue = content.offer?.value ?? content.reward?.amount;
  return (
    <Frame style={{ background: "linear-gradient(160deg, #e0993f 0%, #c96f43 52%, #b0532f 100%)" }}>
      {content.imageRef && <Photo src={content.imageRef} style={{ opacity: 0.16, mixBlendMode: "multiply" }} />}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(130% 100% at 50% -10%, rgba(255,240,214,.35), transparent 55%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: pad, textAlign: "center", alignItems: "center" }}>
        <BrandRow brandIds={brandIds} tone="dark" u={u} align="center" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * u, alignItems: "center" }}>
          {content.scriptAccent && <Script u={u} color="#fff" size={72}>{content.scriptAccent}</Script>}
          <Headline u={u} color="#fff" size={62}>{content.headline}</Headline>
          {bigValue && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 * u, marginTop: 6 * u }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 168 * u, color: "#fff", lineHeight: 0.9, letterSpacing: -2 * u }}>
                {bigValue}
              </span>
              {content.subhead && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 24 * u, letterSpacing: 3 * u, textTransform: "uppercase", color: "rgba(255,255,255,.92)" }}>
                  {content.subhead}
                </span>
              )}
            </div>
          )}
          {!bigValue && content.subhead && <Body u={u} color="rgba(255,255,255,.9)" size={30}>{content.subhead}</Body>}
          {content.offer?.code && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 26 * u,
                letterSpacing: 2 * u,
                color: C.clay,
                background: C.cream,
                padding: `${10 * u}px ${24 * u}px`,
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              CODE {content.offer.code}
            </span>
          )}
          {content.reward?.tier && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 22 * u, color: "rgba(255,255,255,.9)" }}>{content.reward.tier}</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * u, alignItems: "center" }}>
          {content.cta && <CTA label={content.cta.label} u={u} tone="forest" />}
          {content.offer?.expiry && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 20 * u, color: "rgba(255,255,255,.82)" }}>{content.offer.expiry}</span>
          )}
          {content.disclaimer && (
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 16 * u, color: "rgba(255,255,255,.6)" }}>{content.disclaimer}</span>
          )}
        </div>
      </div>
    </Frame>
  );
}

// Testimonial: cream card, gold quote mark, italic serif quote.
function TestimonialCard({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 76 * u;
  return (
    <Frame style={{ background: C.surface }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
            <BrandRow brandIds={brandIds} tone="light" u={u} />
            <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 180 * u, lineHeight: 0.7, color: C.gold }}>“</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 * u }}>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 54 * u, lineHeight: 1.18, color: C.forestDeep }}>
            {content.testimonial?.quote ?? content.headline}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * u }}>
            <span style={{ width: 46 * u, height: 2, background: C.terracotta }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 26 * u, color: C.terracotta, fontWeight: 600 }}>
              {content.testimonial?.attribution}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {content.cta && <CTA label={content.cta.label} u={u} />}
          <Hashtags tags={content.hashtags} u={u} />
        </div>
      </div>
    </Frame>
  );
}

// Banner / cover: wide desert photo with a forest wash + script accent.
function PromoBanner({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 60 * u;
  return (
    <Frame style={{ background: C.forest }}>
      <Photo src={content.imageRef} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(31,47,32,.9) 0%, rgba(31,47,32,.62) 46%, rgba(31,47,32,.22) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 * u, padding: pad }}>
        <BrandRow brandIds={brandIds} tone="dark" u={u} />
        <Eyebrow u={u} color={C.gold}>{content.eyebrow}</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 * u }}>
          <Headline u={u} color="#fff" size={64}>{content.headline}</Headline>
          {content.scriptAccent && <Script u={u} color={C.gold} size={70}>{content.scriptAccent}</Script>}
        </div>
        <Body u={u} color="rgba(255,255,255,.9)">{content.body}</Body>
        {content.cta && <div><CTA label={content.cta.label} u={u} tone="terracotta" /></div>}
      </div>
    </Frame>
  );
}

// How it works: cream ground, forest-green numbered steps.
function HowItWorks({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 68 * u;
  const vertical = isVertical(format);
  const steps = content.steps ?? [];
  return (
    <Frame style={{ background: C.surface }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 34 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
            <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
            {content.scriptAccent && <Script u={u} size={62}>{content.scriptAccent}</Script>}
            <Headline u={u} size={56}>{content.headline}</Headline>
          </div>
          <BrandLogo brandId={brandIds[0]} context="avatar" round surfaceTone="light" height={88 * u} />
        </div>
        <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 22 * u, flex: 1 }}>
          {content.imageRef && !vertical && <FramedPhoto src={content.imageRef} u={u} style={{ width: "28%", height: "100%" }} />}
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: C.cream,
                borderRadius: 26 * u,
                padding: 34 * u,
                border: `1px solid ${C.line}`,
                display: "flex",
                flexDirection: vertical ? "row" : "column",
                alignItems: vertical ? "center" : "flex-start",
                gap: 20 * u,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 66 * u,
                  height: 66 * u,
                  borderRadius: 999,
                  background: C.forest,
                  color: C.cream,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontSize: 34 * u,
                }}
              >
                {i + 1}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 38 * u, color: C.forestDeep }}>{s.title}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 24 * u, color: C.inkSoft, lineHeight: 1.42 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {content.imageRef && vertical && <FramedPhoto src={content.imageRef} u={u} style={{ width: "100%", height: 250 * u }} />}
        {content.cta && <div><CTA label={content.cta.label} u={u} /></div>}
      </div>
    </Frame>
  );
}

// Reward tiers: cream ground, gold-accented tier cards, final tier highlighted.
function RewardTiers({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 68 * u;
  const tiers = content.tiers ?? [];
  return (
    <Frame style={{ background: C.surface }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 28 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
            <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
            {content.scriptAccent && <Script u={u} size={60}>{content.scriptAccent}</Script>}
            <Headline u={u} size={56}>{content.headline}</Headline>
          </div>
          <BrandRow brandIds={brandIds} tone="light" u={u} />
        </div>
        <div style={{ display: "flex", gap: 20 * u, flex: 1, alignItems: "stretch" }}>
          {tiers.map((t, i) => {
            const top = i === tiers.length - 1;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 26 * u,
                  padding: 32 * u,
                  background: top ? C.forest : C.cream,
                  border: `1px solid ${top ? "transparent" : C.line}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 18 * u,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 22 * u,
                    letterSpacing: 2 * u,
                    textTransform: "uppercase",
                    color: top ? C.gold : C.terracotta,
                  }}
                >
                  {t.count}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 66 * u, color: top ? "#fff" : C.forestDeep, lineHeight: 1 }}>
                  {t.reward}
                </div>
              </div>
            );
          })}
        </div>
        {content.body && <Body u={u}>{content.body}</Body>}
        {content.cta && <div><CTA label={content.cta.label} u={u} /></div>}
      </div>
    </Frame>
  );
}

// Share link: cream ground, dashed referral pill, share row.
function ShareLinkCard({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 72 * u;
  return (
    <Frame style={{ background: C.surface }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <BrandRow brandIds={brandIds} tone="light" u={u} />
          <SunMark u={u} size={34} color={C.gold} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 * u }}>
          <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
          {content.scriptAccent && <Script u={u} size={64}>{content.scriptAccent}</Script>}
          <Headline u={u} size={70}>{content.headline}</Headline>
          <Body u={u}>{content.body}</Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 18 * u, letterSpacing: 2 * u, textTransform: "uppercase", color: C.sage }}>
              Your unique link
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16 * u,
                padding: `${24 * u}px ${30 * u}px`,
                borderRadius: 20 * u,
                background: "#fff",
                border: `2px dashed ${C.sage}`,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 30 * u, color: C.forestDeep, fontWeight: 500 }}>
                {content.referralUrl}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: 22 * u,
                  color: C.cream,
                  background: C.forest,
                  padding: `${10 * u}px ${22 * u}px`,
                  borderRadius: 999,
                }}
              >
                Copy
              </span>
            </div>
          </div>
        </div>
        {content.cta && <div><CTA label={content.cta.label} u={u} tone="terracotta" /></div>}
      </div>
    </Frame>
  );
}

// Benefit / approach icon row: cream ground, outlined sun tiles.
function IconRow({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 68 * u;
  const items = content.bullets ?? [];
  return (
    <Frame style={{ background: C.cream }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 30 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
            <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
            {content.scriptAccent && <Script u={u} size={60}>{content.scriptAccent}</Script>}
            <Headline u={u} size={58}>{content.headline}</Headline>
          </div>
          <BrandLogo brandId={brandIds[0]} context="badge" surfaceTone="light" height={110 * u} />
        </div>
        {content.body && <Body u={u}>{content.body}</Body>}
        <div style={{ display: "flex", gap: 24 * u, flexWrap: "wrap", flex: 1, alignContent: "center", justifyContent: "center" }}>
          {items.map((it, i) => {
            const tint = [C.forest, C.terracotta, C.sage, C.gold][i % 4];
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 * u, alignItems: "center", flex: "1 1 30%", minWidth: 180 * u }}>
                <div
                  style={{
                    width: 104 * u,
                    height: 104 * u,
                    borderRadius: 999,
                    background: C.surface,
                    border: `2px solid ${tint}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SunMark u={u} size={52} color={tint} />
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 32 * u, color: C.forestDeep, textAlign: "center", lineHeight: 1.1 }}>
                  {it}
                </div>
              </div>
            );
          })}
        </div>
        {content.cta && <div style={{ alignSelf: "flex-start" }}><CTA label={content.cta.label} u={u} /></div>}
      </div>
    </Frame>
  );
}

// Email: green masthead, cream editorial body with framed photo, green footer.
function EmailStage({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  return (
    <Frame style={{ background: C.surface, overflow: "auto" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ background: C.forestDeep, padding: 20 * u, display: "flex", justifyContent: "center" }}>
          <img src={`${APP_ASSETS}founding-member-lockup.png`} alt="ChiroGoAZ · Renew48 · AromaHMT" style={{ display: "block", width: "100%", maxWidth: 480 * u, height: 76 * u, objectFit: "contain" }} />
        </div>
        <div style={{ padding: `${40 * u}px ${44 * u}px ${20 * u}px`, display: "flex", flexDirection: "column", gap: 12 * u, alignItems: "center", textAlign: "center" }}>
          <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
          {content.scriptAccent && <Script u={u} size={56}>{content.scriptAccent}</Script>}
          <Headline u={u} size={50}>{content.headline}</Headline>
          {content.subhead && <Body u={u} color={C.sage} size={26}>{content.subhead}</Body>}
        </div>
        {content.imageRef && (
          <div style={{ padding: `0 ${44 * u}px` }}>
            <FramedPhoto src={content.imageRef} u={u} style={{ width: "100%", height: 300 * u }} />
          </div>
        )}
        <div style={{ padding: `${28 * u}px ${44 * u}px`, display: "flex", flexDirection: "column", gap: 20 * u }}>
          <Body u={u}>{content.body}</Body>
          {content.testimonial && (
            <div style={{ padding: 22 * u, background: C.cream, border: `1px solid ${C.line}`, textAlign: "center", color: C.forestDeep }}>
              <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 26 * u, lineHeight: 1.35 }}>“{content.testimonial.quote}”</div>
              <div style={{ marginTop: 12 * u, fontFamily: "var(--font-sans)", fontSize: 15 * u, color: C.terracotta }}>{content.testimonial.attribution}</div>
            </div>
          )}
          {content.offer && (
            <div style={{ alignSelf: "center", background: C.forest, color: C.cream, padding: `${18 * u}px ${28 * u}px`, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 42 * u, fontWeight: 700 }}>{content.offer.value}</div>
              {content.offer.code && <div style={{ marginTop: 6 * u, fontFamily: "var(--font-mono)", fontSize: 12 * u, letterSpacing: 2 * u }}>CODE {content.offer.code}</div>}
            </div>
          )}
          {content.bullets && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 * u }}>
              {content.bullets.map((b) => (
                <div key={b} style={{ display: "flex", gap: 14 * u, alignItems: "center", fontFamily: "var(--font-sans)", fontSize: 24 * u, color: C.ink }}>
                  <SunMark u={u} size={26} color={C.terracotta} />
                  {b}
                </div>
              ))}
            </div>
          )}
          {content.cta && <div style={{ marginTop: 6 * u, alignSelf: "flex-start" }}><CTA label={content.cta.label} u={u} /></div>}
        </div>
        <div style={{ marginTop: "auto", background: C.forestDeep, padding: 30 * u, display: "flex", flexDirection: "column", gap: 12 * u, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16 * u, letterSpacing: 3 * u, color: C.gold, textTransform: "uppercase" }}>
            Stay Connected
          </span>
          <Hashtags tags={content.hashtags} u={u} color="rgba(255,255,255,.66)" />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 17 * u, color: "rgba(255,255,255,.55)" }}>
            Rooted in the desert. Elevated by care. Inspired by movement.
          </span>
        </div>
      </div>
    </Frame>
  );
}

// Referral overview: the campaign-board hero treatment with a full-bleed desert image,
// translucent content panel, and three compact benefit markers.
function ReferralOverview({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 58 * u;
  const items = content.bullets ?? ["Share with friends", "They book", "You earn credit"];
  return (
    <Frame style={{ background: C.forestDeep }}>
      <Photo src={content.imageRef} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,47,32,.18), rgba(31,47,32,.76))" }} />
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <BrandRow brandIds={brandIds} tone="dark" u={u} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 * u, alignItems: "center", textAlign: "center" }}>
          {content.scriptAccent && <Script u={u} color={C.gold} size={68}>{content.scriptAccent}</Script>}
          <Headline u={u} color="#fff" size={72}>{content.headline}</Headline>
          <Body u={u} color="rgba(255,255,255,.92)" size={28}>{content.body}</Body>
          <div style={{ display: "flex", gap: 14 * u, width: "100%", justifyContent: "center", marginTop: 12 * u }}>
            {items.slice(0, 3).map((item, i) => (
              <div key={item} style={{ flex: 1, maxWidth: 260 * u, padding: `${18 * u}px ${12 * u}px`, borderRadius: 18 * u, background: "rgba(251,248,242,.9)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 * u }}>
                <SunMark u={u} size={28} color={[C.forest, C.terracotta, C.gold][i]} />
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 19 * u, color: C.forestDeep }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        {content.cta && <div style={{ alignSelf: "center" }}><CTA label={content.cta.label} u={u} tone="cream" /></div>}
      </div>
    </Frame>
  );
}

// FAQ card: compact accordion-style artwork for email and social campaign support.
function FaqCard({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 62 * u;
  return (
    <Frame style={{ background: C.surface }}>
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", flexDirection: "column", gap: 24 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}>
            <Eyebrow u={u}>{content.eyebrow}</Eyebrow>
            <Headline u={u} size={58}>{content.headline}</Headline>
          </div>
          <BrandLogo brandId={brandIds[0]} context="avatar" round surfaceTone="light" height={76 * u} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * u, flex: 1, justifyContent: "center" }}>
          {(content.faq ?? []).map((item) => (
            <div key={item.question} style={{ padding: `${20 * u}px ${24 * u}px`, borderRadius: 18 * u, background: C.cream, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 8 * u }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 * u, alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 28 * u, color: C.forestDeep }}>{item.question}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 28 * u, color: C.terracotta }}>+</span>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 21 * u, lineHeight: 1.4, color: C.inkSoft }}>{item.answer}</span>
            </div>
          ))}
        </div>
        {content.cta && <div><CTA label={content.cta.label} u={u} /></div>}
      </div>
    </Frame>
  );
}

// Bottom CTA strip: wide handoff asset used beneath referral campaign sequences.
function CtaStrip({ asset, format }: TemplateProps) {
  const u = unit(format);
  const { content, brandIds } = asset;
  const pad = 44 * u;
  return (
    <Frame style={{ background: C.forestDeep }}>
      <Photo src={content.imageRef} style={{ opacity: 0.6 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(31,47,32,.92), rgba(31,47,32,.48))" }} />
      <div style={{ position: "absolute", inset: 0, padding: pad, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 30 * u }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * u, maxWidth: "68%" }}>
          <BrandRow brandIds={brandIds} tone="dark" u={u} />
          <Headline u={u} color="#fff" size={54}>{content.headline}</Headline>
          <Body u={u} color="rgba(255,255,255,.86)" size={24}>{content.body}</Body>
        </div>
        {content.cta && <CTA label={content.cta.label} u={u} tone="cream" />}
      </div>
    </Frame>
  );
}

export const TEMPLATES: Record<Asset["family"], (p: TemplateProps) => ReactNode> = {
  EmailStage,
  TeaserOverlay,
  FeedPost,
  StoryReel,
  OfferCard,
  TestimonialCard,
  PromoBanner,
  HowItWorks,
  RewardTiers,
  ShareLinkCard,
  IconRow,
  ReferralOverview,
  FaqCard,
  CtaStrip,
};

export function AssetRender({ asset, format }: TemplateProps) {
  const T = TEMPLATES[asset.family];
  return <>{T({ asset, format })}</>;
}

export { TaglineBand };
