import { ArrowRight, CheckCircle2, Download, Image, MessageSquareText, Workflow } from "lucide-react";

const STEPS = [
  { icon: <Image className="size-4" />, title: "Start in Dashboard", detail: "Choose a campaign and open an asset from its phase row. Day offsets show the intended launch rhythm." },
  { icon: <MessageSquareText className="size-4" />, title: "Edit the message", detail: "Workspace is the source of truth for headline, body, CTA, offer, image, hashtags, and review notes. Changes save locally." },
  { icon: <CheckCircle2 className="size-4" />, title: "Review before publishing", detail: "Move each asset through Draft → Review → Approved → Ready. Use Request changes when the creative or offer needs a correction." },
  { icon: <Download className="size-4" />, title: "Export the delivery", detail: "Use HTML on email assets for MailPoet. Use PNG/JPG/PDF/SVG for social and print. Export Center can package a full campaign." },
  { icon: <Workflow className="size-4" />, title: "Hand off social", detail: "Workflow shows suggested copy, platform targets, hashtags, and brand tagging guidance before a human publishes." },
];

export function Guidance() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8">
        <div className="font-script text-2xl text-terracotta">A clear path from idea to handoff</div>
        <h1 className="font-serif text-3xl font-semibold text-forest">User Guidance</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">Use the studio as a controlled campaign workspace: reference assets stay visible, structured content stays editable, and publishing remains a human approval step.</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex gap-4 rounded-2xl border border-ink/10 bg-surface p-5">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest text-canvas">{step.icon}</div>
            <div>
              <div className="mb-1 flex items-center gap-2 font-serif text-lg font-semibold text-forest"><span className="font-mono text-[10px] text-terracotta">0{index + 1}</span>{step.title}</div>
              <p className="text-sm leading-relaxed text-ink/60">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[#7a5a10]">MailPoet checklist</div>
          <p className="text-sm leading-relaxed text-[#6e571d]">Open an Email asset → select the email format → export HTML. Import the downloaded file into MailPoet, confirm the absolute image URLs resolve from the deployed studio host, then add MailPoet’s native unsubscribe/preferences block before sending.</p>
        </div>
        <div className="rounded-2xl border border-forest/20 bg-forest/5 p-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-forest">Social handoff <ArrowRight className="size-3" /></div>
          <p className="text-sm leading-relaxed text-ink/60">Open a social asset in Workspace or Workflow. Copy the suggested caption, review the suggested hashtags and @tags, check the platform target, then publish manually after approval.</p>
        </div>
      </div>
    </div>
  );
}
