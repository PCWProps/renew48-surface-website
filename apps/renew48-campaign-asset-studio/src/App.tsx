import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Check, CircleHelp, KanbanSquare, Layers3, Library as LibraryIcon, LockKeyhole, LayoutDashboard, Package, PanelsTopLeft, RotateCcw, Sparkles } from "lucide-react";
import { StudioProvider, useStudio } from "@/store/studio";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/components/ui";
import { Dashboard } from "@/components/studio/Dashboard";
import { CampaignTree } from "@/components/studio/CampaignTree";
import { PreviewCanvas } from "@/components/studio/PreviewCanvas";
import { AssetEditor } from "@/components/studio/AssetEditor";
import { Library } from "@/components/studio/Library";
import { ExportCenter } from "@/components/studio/ExportCenter";
import { Workflow } from "@/components/studio/Workflow";
import { Guidance } from "@/components/studio/Guidance";

type View = "dashboard" | "workspace" | "library" | "export" | "workflow" | "guidance";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
const MARKETING_PATH = "/marketing-studio/";
const ADDON_PATH = "/marketing-studio/add-on/";
const EXAMPLES_PATH = "/marketing-studio/examples/";
const STUDIO_PATH = "/marketing-studio/studio/";
const STUDIO_ROUTE_PREFIX = "/marketing-studio/studio";

const LANDING_FEATURES = [
  {
    number: "01",
    title: "Start with the brief",
    copy: "Turn one campaign idea into a clear sequence of messages, channels, dates, and destinations before the first asset is made.",
    image: "/campaign-library/wellness-reset/wellness-reset-campaign-map.png",
    alt: "Wellness Reset fictional campaign planning board",
    icon: <Layers3 className="size-5" />,
  },
  {
    number: "02",
    title: "Build from one system",
    copy: "Keep each member’s approved wordmarks, badges, typography, palette, imagery, and visual language accurate across every format.",
    image: "/campaign-library/wellness-reset/wellness-reset-content-suite.png",
    alt: "Wellness Reset fictional campaign content suite",
    icon: <Sparkles className="size-5" />,
  },
  {
    number: "03",
    title: "Review, package, hand off",
    copy: "Edit structured content, preview the real platform shape, move assets through approval, and export a clean campaign package.",
    image: "/campaign-library/wellness-reset/wellness-reset-social-system.png",
    alt: "Wellness Reset fictional social campaign system",
    icon: <BadgeCheck className="size-5" />,
  },
];

const CAMPAIGN_EVOLUTION = [
  {
    phase: "Direction",
    title: "Find the shared promise",
    copy: "The first board sets the emotional center: a warm desert world, a clear rhythm, and one useful promise for people finding their way back to balance.",
    image: "/campaign-library/wellness-reset/wellness-reset-campaign-map.png",
    alt: "Wellness Reset fictional campaign evolution map",
  },
  {
    phase: "Refinement",
    title: "Shape the sequence",
    copy: "The next pass turns the idea into a calm email journey, giving every message a job while the visual language remains recognizably related.",
    image: "/campaign-library/wellness-reset/wellness-reset-email-sequence.png",
    alt: "Wellness Reset fictional email sequence board",
  },
  {
    phase: "Translation",
    title: "Carry it into social",
    copy: "The campaign becomes a family of feed posts, stories, and reels without losing its typography, photography cues, or restorative point of view.",
    image: "/campaign-library/wellness-reset/wellness-reset-social-system.png",
    alt: "Wellness Reset fictional social campaign system board",
  },
  {
    phase: "System",
    title: "Make every format feel related",
    copy: "The final system gives each platform its own shape while the campaign still reads as one considered body of work.",
    image: "/campaign-library/wellness-reset/wellness-reset-content-suite.png",
    alt: "Wellness Reset fictional web and content suite board",
  },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div data-reveal className={className}>{children}</div>;
}

function useMarketingMotion() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.14 });
    const nodes = document.querySelectorAll("[data-reveal]");
    nodes.forEach((node) => observer.observe(node));
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return scrollProgress;
}

function CampaignEvolution() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = CAMPAIGN_EVOLUTION[activeIndex];

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % CAMPAIGN_EVOLUTION.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const selectSlide = (index: number) => setActiveIndex((index + CAMPAIGN_EVOLUTION.length) % CAMPAIGN_EVOLUTION.length);

  return (
    <section
      className="marketing-evolution marketing-section"
      id="campaign-evolution"
      aria-labelledby="campaign-evolution-title"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="evolution-heading">
        <Reveal><div className="marketing-kicker">A campaign, in progress</div><h2 id="campaign-evolution-title">See the idea<br /><em>take shape.</em></h2></Reveal>
        <Reveal className="evolution-heading-copy"><p>Good campaign work is iterative. This fictional Wellness Reset example moves from the first direction through email, social, and web, so members can see how one source of truth becomes a complete month of communication.</p><span className="evolution-meta">04 passes · one connected visual language</span></Reveal>
      </div>

      <Reveal className="evolution-stage">
        <div className="evolution-rail"><span>WELLNESS RESET · FICTIONAL CAMPAIGN EXAMPLE</span><span>{String(activeIndex + 1).padStart(2, "0")} / {String(CAMPAIGN_EVOLUTION.length).padStart(2, "0")}</span></div>
        <div className="evolution-image-frame"><img key={active.image} className="evolution-image" src={assetPath(active.image)} alt={active.alt} /></div>
        <div className="evolution-caption">
          <div><span className="evolution-phase">{active.phase}</span><h3>{active.title}</h3><p>{active.copy}</p></div>
          <div className="evolution-controls" aria-label="Campaign example controls">
            <button type="button" aria-label="Previous campaign example" onClick={() => selectSlide(activeIndex - 1)}><ArrowLeft className="size-4" /></button>
            <button type="button" aria-label="Next campaign example" onClick={() => selectSlide(activeIndex + 1)}><ArrowRight className="size-4" /></button>
          </div>
        </div>
        <div className="evolution-thumbs" role="tablist" aria-label="Campaign evolution examples">
          {CAMPAIGN_EVOLUTION.map((slide, index) => (
            <button key={slide.phase} type="button" role="tab" aria-selected={activeIndex === index} className={cn("evolution-thumb", activeIndex === index && "is-active")} onClick={() => selectSlide(index)}>
              <span className="evolution-thumb-image"><img src={assetPath(slide.image)} alt="" /></span><span className="evolution-thumb-copy"><small>0{index + 1}</small><strong>{slide.phase}</strong></span>
            </button>
          ))}
        </div>
        <div className="evolution-note"><Sparkles className="size-4" /> Fictional example · the studio keeps the campaign source visible while each format becomes editable.</div>
        <a className="evolution-detail-link" href={EXAMPLES_PATH}>View the full campaign example <ArrowUpRight className="size-4" /></a>
      </Reveal>
    </section>
  );
}

function MarketingHome() {
  const scrollProgress = useMarketingMotion();

  return (
    <div className="marketing-site">
      <div className="marketing-scroll-progress" style={{ width: `${scrollProgress * 100}%` }} aria-hidden="true" />
      <div className="marketing-top-rail"><span>RENEW48 WELLNESS COLLECTIVE</span><span>CAMPAIGN ASSET STUDIO · PRIVATE WORKSPACE</span></div>
      <header className="marketing-nav">
        <a href={MARKETING_PATH} className="marketing-brand" aria-label="Renew48 Campaign Asset Studio home"><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={44} /></a>
        <nav aria-label="Marketing navigation"><a href="#why">Why the studio</a><a href="#workflow">How it works</a><a className="marketing-nav-cta" href={ADDON_PATH}>Get the Studio <ArrowUpRight className="size-4" /></a></nav>
      </header>

      <main>
        <section className="marketing-hero">
          <div className="marketing-hero-copy">
            <Reveal><div className="marketing-kicker">For Renew48 collective members</div><h1>One visual system.<br /><em>Everywhere it matters.</em></h1><p>Build your campaigns in one considered workspace. Keep your branding accurate with approved wordmarks, badges, typography, imagery, and brand details carried correctly into every format.</p><div className="marketing-actions"><a className="marketing-button primary" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a><a className="marketing-text-link" href="#why">See how it works <ArrowRight className="size-4" /></a></div></Reveal>
          </div>
          <Reveal className="marketing-hero-art">
            <div className="hero-glow" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-board-frame"><img src={assetPath("/assets/desert-sunrise-source.png")} alt="Desert sunrise visual reference" /><div className="hero-board-sheen" /></div>
            <div className="hero-logo-card"><img src={assetPath("/assets/renew48-logo.png")} alt="Renew48" /></div>
            <div className="hero-badge-card"><img src={assetPath("/assets/3db6b.png")} alt="Renew48 Wellness Collective badge" /></div>
            <div className="hero-caption"><span className="hero-caption-dot" /> Rooted in the desert · elevated by care</div>
          </Reveal>
        </section>

        <section id="why" className="marketing-intro marketing-section">
          <Reveal className="section-heading"><div className="marketing-kicker">The working surface</div><h2>Less hunting.<br /><em>More making.</em></h2></Reveal>
          <Reveal className="section-heading-copy"><p>The studio is designed for the moment a member campaign moves from an idea to a coordinated month of work. Keep the source of truth visible, make the content editable, and make the handoff easy to trust.</p><div className="stat-line"><span>01</span><span>Brief to launch</span><span>One connected flow</span></div></Reveal>
        </section>

        <CampaignEvolution />

        <section id="workflow" className="marketing-feature-stack marketing-section">
          {LANDING_FEATURES.map((feature, index) => (
            <Reveal key={feature.number} className={`marketing-feature-row ${index % 2 ? "reverse" : ""}`}>
              <div className="feature-copy"><div className="feature-icon">{feature.icon}</div><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.copy}</p><a className="marketing-text-link" href={ADDON_PATH}>Get the Studio <ArrowUpRight className="size-4" /></a></div>
              <div className="feature-shot"><div className="shot-rail"><span>RENEW48 / STUDIO</span><span>{feature.number} / 03</span></div><img src={assetPath(feature.image)} alt={feature.alt} /><div className="shot-glass" /></div>
            </Reveal>
          ))}
        </section>

        <section className="marketing-system-band marketing-section"><Reveal className="system-band-copy"><div className="marketing-kicker">The same care, in every format</div><h2>From the first board<br /><em>to the final handoff.</em></h2><p>Campaign references stay references. Approved logos, badges, photos, and type stay selectable sources. The studio keeps those boundaries clear while you build.</p><div className="system-band-actions"><a className="marketing-button light" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a><a className="marketing-text-link light-link" href={EXAMPLES_PATH}>See the example set <ArrowUpRight className="size-4" /></a></div></Reveal><Reveal className="system-collage"><div className="collage-card collage-large"><img src={assetPath("/campaign-library/wellness-reset/wellness-reset-content-suite.png")} alt="Wellness Reset fictional campaign content suite" /></div><div className="collage-card collage-small"><img src={assetPath("/assets/renew48-logo.png")} alt="Renew48 logo source" /></div><div className="collage-note"><Check className="size-4" /> Fictional reference set</div></Reveal></section>

        <section id="access" className="marketing-final-cta marketing-section"><Reveal><LockKeyhole className="mx-auto mb-5 size-7 text-terracotta" /><div className="marketing-kicker">Private by design</div><h2>The public story stays open.<br /><em>The working studio stays yours.</em></h2><p>Campaign work is served behind the existing PCWProps Cloudflare Access policy for the protected `/marketing-studio/studio/` route.</p><a className="marketing-button primary" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a></Reveal></section>
      </main>
      <footer className="marketing-footer"><div><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={34} /><span>Campaign Asset Studio</span></div><div>© 2026 Renew48 Wellness Collective</div></footer>
    </div>
  );
}

function ExampleCampaignPage() {
  const scrollProgress = useMarketingMotion();

  return (
    <div className="marketing-site marketing-examples-page">
      <div className="marketing-scroll-progress" style={{ width: `${scrollProgress * 100}%` }} aria-hidden="true" />
      <div className="marketing-top-rail"><span>RENEW48 WELLNESS COLLECTIVE</span><span>FICTIONAL CAMPAIGN EXAMPLE · WELLNESS RESET</span></div>
      <header className="marketing-nav">
        <a href={MARKETING_PATH} className="marketing-brand" aria-label="Renew48 Campaign Asset Studio home"><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={44} /></a>
        <nav aria-label="Example campaign navigation"><a className="marketing-text-link" href={MARKETING_PATH}><ArrowLeft className="size-4" /> Back to studio overview</a><a className="marketing-nav-cta" href={ADDON_PATH}>Get the Studio <ArrowUpRight className="size-4" /></a></nav>
      </header>

      <main>
        <section className="examples-hero marketing-section">
          <Reveal><div className="marketing-kicker">Fictional campaign example</div><h1>One idea.<br /><em>Many useful moments.</em></h1><p>Wellness Reset is a made-for-demo campaign showing how the studio takes a single health and wellness idea through planning, message design, email, social, web, and handoff.</p><a className="marketing-text-link" href="#example-journey">Follow the journey <ArrowRight className="size-4" /></a></Reveal>
          <Reveal className="examples-hero-art"><img src={assetPath("/campaign-library/wellness-reset/wellness-reset-campaign-map.png")} alt="Wellness Reset fictional campaign evolution map" /><div className="examples-hero-stamp">REFERENCE ONLY<br /><strong>NOT A LIVE CAMPAIGN</strong></div></Reveal>
        </section>

        <section id="example-journey" className="example-journey marketing-section">
          <div className="example-journey-intro"><Reveal><div className="marketing-kicker">The working sequence</div><h2>Watch it<br /><em>become a system.</em></h2></Reveal><Reveal><p>Each pass adds clarity without losing the original point of view. The side-to-side rhythm mirrors the way a member can move between the brief, the source library, and the final formats.</p></Reveal></div>
          {CAMPAIGN_EVOLUTION.map((slide, index) => (
            <Reveal key={slide.phase} className={cn("example-story-row", index % 2 === 1 && "reverse")}>
              <div className="example-story-copy"><span className="feature-number">0{index + 1} · {slide.phase}</span><h3>{slide.title}</h3><p>{slide.copy}</p><a className="marketing-text-link" href={ADDON_PATH}>Get the Studio <ArrowUpRight className="size-4" /></a></div>
              <div className="example-story-image"><div className="shot-rail"><span>WELLNESS RESET / EXAMPLE</span><span>0{index + 1} / 04</span></div><img src={assetPath(slide.image)} alt={slide.alt} /></div>
            </Reveal>
          ))}
        </section>

        <section className="marketing-final-cta marketing-section"><Reveal><Sparkles className="mx-auto mb-5 size-7 text-terracotta" /><div className="marketing-kicker">Your brand stays yours</div><h2>Bring your own story<br /><em>into the system.</em></h2><p>Wellness Reset is only an example. Your wordmarks, palette, type, photography, and campaign idea become the source of truth for the work you actually want to make.</p><a className="marketing-button primary" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a></Reveal></section>
      </main>
      <footer className="marketing-footer"><div><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={34} /><span>Campaign Asset Studio</span></div><div>Fictional example · © 2026 Renew48 Wellness Collective</div></footer>
    </div>
  );
}

function StudioEntry() {
  const [unlocked, setUnlocked] = useState(false);
  if (unlocked) return <Shell />;
  return <div className="studio-entry"><div className="studio-entry-rail">PCWPROPS AUTH · CLOUDFLARE ACCESS VERIFIED ROUTE</div><div className="studio-entry-card"><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={52} /><div className="marketing-kicker">Private campaign workspace</div><h1>Welcome back<br /><em>to the studio.</em></h1><p>This workspace is behind the PCWProps Cloudflare Access policy. Continue to open the campaign dashboard, library, workflow, and export tools.</p><div className="entry-status"><LockKeyhole className="size-4" /><span>Protected route · `/marketing-studio/studio/`</span></div><button className="marketing-button primary" type="button" onClick={() => setUnlocked(true)}>Continue to Campaign Studio <ArrowRight className="size-4" /></button><a className="marketing-text-link" href={MARKETING_PATH}>Back to the public overview</a></div><div className="studio-entry-foot"><span>Renew48 Wellness Collective</span><span>Authorized collaborators only</span></div></div>;
}

function SubscriptionAddonPage() {
  return <div className="studio-entry"><div className="studio-entry-rail">RENEW48 COLLECTIVE · SUBSCRIPTION ADD-ON</div><div className="studio-entry-card"><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={52} /><div className="marketing-kicker">Campaign Asset Studio</div><h1>Get the <em>Studio.</em></h1><p>The Campaign Asset Studio is a subscription add-on for Renew48 collective members. We’re finishing the member setup and billing flow now.</p><div className="entry-status"><Sparkles className="size-4" /><span>Member campaign tools · coming soon</span></div><a className="marketing-button primary" href={MARKETING_PATH}>Back to the overview <ArrowRight className="size-4" /></a></div><div className="studio-entry-foot"><span>Renew48 Wellness Collective</span><span>Built for collective members</span></div></div>;
}

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-4" /> },
  { id: "workspace", label: "Workspace", icon: <PanelsTopLeft className="size-4" /> },
  { id: "library", label: "Library", icon: <LibraryIcon className="size-4" /> },
  { id: "export", label: "Export", icon: <Package className="size-4" /> },
  { id: "workflow", label: "Workflow", icon: <KanbanSquare className="size-4" /> },
  { id: "guidance", label: "User Guidance", icon: <CircleHelp className="size-4" /> },
];

function Shell() {
  const { assets, resetSeed } = useStudio();
  const [view, setView] = useState<View>("dashboard");
  const [selectedId, setSelectedId] = useState<string>(assets[0]?.id ?? "");

  const open = (id: string) => {
    setSelectedId(id);
    setView("workspace");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-ink">
      {/* sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-ink/10 bg-surface">
        <div className="border-b border-ink/10 px-4 py-5">
          <BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={34} />
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">Campaign Asset Studio</div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                view === n.id ? "bg-forest text-canvas" : "text-ink/65 hover:bg-surface-2",
              )}
            >
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>
        <button
          onClick={resetSeed}
          className="m-3 inline-flex items-center gap-2 rounded-lg border border-ink/12 px-3 py-2 text-[11px] text-ink/50 transition hover:bg-surface-2"
        >
          <RotateCcw className="size-3.5" /> Reset to seed
        </button>
      </aside>

      {/* main */}
      <main className="flex-1 overflow-hidden">
        {view === "dashboard" && (
          <div className="h-full overflow-y-auto">
            <Dashboard onOpen={open} />
          </div>
        )}
        {view === "workspace" && <Workspace selectedId={selectedId} onSelect={setSelectedId} />}
        {view === "library" && (
          <div className="h-full overflow-y-auto">
            <Library />
          </div>
        )}
        {view === "export" && (
          <div className="h-full overflow-y-auto">
            <ExportCenter />
          </div>
        )}
        {view === "workflow" && <Workflow />}
        {view === "guidance" && (
          <div className="h-full overflow-y-auto">
            <Guidance />
          </div>
        )}
      </main>
    </div>
  );
}

function Workspace({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const { assets } = useStudio();
  const asset = assets.find((a) => a.id === selectedId) ?? assets[0];

  return (
    <div className="grid h-full grid-cols-[minmax(240px,300px)_1fr_minmax(300px,360px)] overflow-hidden">
      <div className="overflow-y-auto border-r border-ink/10 bg-surface/50">
        <CampaignTree selectedId={asset?.id ?? ""} onSelect={onSelect} />
      </div>
      <div className="overflow-hidden bg-canvas">
        {asset ? <PreviewCanvas asset={asset} /> : <div className="grid h-full place-items-center text-ink/40">Select an asset</div>}
      </div>
      <div className="overflow-y-auto border-l border-ink/10 bg-surface/50 px-5 py-5">
        {asset && (
          <>
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta">{asset.family}</div>
              <h2 className="font-serif text-xl font-semibold text-forest">{asset.name}</h2>
              <p className="mt-1 text-[12px] text-ink/55">{asset.purpose}</p>
            </div>
            <AssetEditor asset={asset} />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const protectedRoute = path.startsWith(STUDIO_ROUTE_PREFIX) || path.startsWith("/marketing-suite");
  const addonRoute = path.startsWith(ADDON_PATH.replace(/\/$/, ""));
  const examplesRoute = path.startsWith(EXAMPLES_PATH.replace(/\/$/, ""));
  return <StudioProvider>{protectedRoute ? <StudioEntry /> : addonRoute ? <SubscriptionAddonPage /> : examplesRoute ? <ExampleCampaignPage /> : <MarketingHome />}</StudioProvider>;
}
