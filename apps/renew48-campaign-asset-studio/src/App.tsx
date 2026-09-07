import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, CircleHelp, KanbanSquare, Layers3, Library as LibraryIcon, LockKeyhole, LayoutDashboard, Package, PanelsTopLeft, RotateCcw, Sparkles } from "lucide-react";
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
const STUDIO_PATH = "/marketing-studio/studio/";
const STUDIO_ROUTE_PREFIX = "/marketing-studio/studio";

const LANDING_FEATURES = [
  {
    number: "01",
    title: "Start with the brief",
    copy: "Turn one campaign idea into a clear sequence of messages, channels, dates, and destinations before the first asset is made.",
    image: "/campaign-library/Marketing-Campaign.png",
    alt: "Renew48 campaign planning reference board",
    icon: <Layers3 className="size-5" />,
  },
  {
    number: "02",
    title: "Build from one system",
    copy: "Keep each member’s approved wordmarks, badges, typography, palette, imagery, and visual language accurate across every format.",
    image: "/campaign-library/marketing-assets-1.png",
    alt: "Renew48 campaign asset reference board",
    icon: <Sparkles className="size-5" />,
  },
  {
    number: "03",
    title: "Review, package, hand off",
    copy: "Edit structured content, preview the real platform shape, move assets through approval, and export a clean campaign package.",
    image: "/campaign-library/emailcampaign.png",
    alt: "Renew48 email campaign reference board",
    icon: <BadgeCheck className="size-5" />,
  },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div data-reveal className={className}>{children}</div>;
}

function MarketingHome() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.14 });
    const nodes = document.querySelectorAll("[data-reveal]");
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="marketing-site">
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

        <section id="workflow" className="marketing-feature-stack marketing-section">
          {LANDING_FEATURES.map((feature, index) => (
            <Reveal key={feature.number} className={`marketing-feature-row ${index % 2 ? "reverse" : ""}`}>
              <div className="feature-copy"><div className="feature-icon">{feature.icon}</div><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.copy}</p><a className="marketing-text-link" href={ADDON_PATH}>Get the Studio <ArrowUpRight className="size-4" /></a></div>
              <div className="feature-shot"><div className="shot-rail"><span>RENEW48 / STUDIO</span><span>{feature.number} / 03</span></div><img src={assetPath(feature.image)} alt={feature.alt} /><div className="shot-glass" /></div>
            </Reveal>
          ))}
        </section>

        <section className="marketing-system-band marketing-section"><Reveal className="system-band-copy"><div className="marketing-kicker">The same care, in every format</div><h2>From the first board<br /><em>to the final handoff.</em></h2><p>Campaign references stay references. Approved logos, badges, photos, and type stay selectable sources. The studio keeps those boundaries clear while you build.</p><a className="marketing-button light" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a></Reveal><Reveal className="system-collage"><div className="collage-card collage-large"><img src={assetPath("/campaign-library/marketing-assets-2.png")} alt="Renew48 marketing asset examples" /></div><div className="collage-card collage-small"><img src={assetPath("/assets/renew48-logo.png")} alt="Renew48 logo source" /></div><div className="collage-note"><Check className="size-4" /> Source-aware by design</div></Reveal></section>

        <section id="access" className="marketing-final-cta marketing-section"><Reveal><LockKeyhole className="mx-auto mb-5 size-7 text-terracotta" /><div className="marketing-kicker">Private by design</div><h2>The public story stays open.<br /><em>The working studio stays yours.</em></h2><p>Campaign work is served behind the existing PCWProps Cloudflare Access policy for the protected `/marketing-studio/studio/` route.</p><a className="marketing-button primary" href={ADDON_PATH}>Get the Studio <ArrowRight className="size-4" /></a></Reveal></section>
      </main>
      <footer className="marketing-footer"><div><BrandLogo brandId="renew48" context="wordmark" surfaceTone="light" height={34} /><span>Campaign Asset Studio</span></div><div>© 2026 Renew48 Wellness Collective</div></footer>
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
  return <StudioProvider>{protectedRoute ? <StudioEntry /> : addonRoute ? <SubscriptionAddonPage /> : <MarketingHome />}</StudioProvider>;
}
