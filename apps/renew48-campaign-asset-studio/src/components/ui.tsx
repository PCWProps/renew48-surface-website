import type { ReactNode } from "react";
import type { WorkflowStatus } from "@/types";

export function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

const STATUS_STYLE: Record<WorkflowStatus, string> = {
  Draft: "bg-surface-2 text-ink/70 border-ink/10",
  Review: "bg-gold/15 text-[#8a6410] border-gold/40",
  "Changes Requested": "bg-terracotta/15 text-clay border-terracotta/40",
  Approved: "bg-forest/12 text-forest border-forest/30",
  Ready: "bg-forest text-canvas border-forest",
  Published: "bg-[#1f2f20] text-gold border-[#1f2f20]",
};

export function StatusBadge({ status, className }: { status: WorkflowStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        STATUS_STYLE[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink/55">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-ink/45">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-ink/12 bg-surface px-3 py-2 text-sm text-ink outline-none transition",
        "focus:border-forest/50 focus:ring-2 focus:ring-forest/15 placeholder:text-ink/30",
        props.className,
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full resize-none rounded-lg border border-ink/12 bg-surface px-3 py-2 text-sm leading-relaxed text-ink outline-none transition",
        "focus:border-forest/50 focus:ring-2 focus:ring-forest/15 placeholder:text-ink/30",
        props.className,
      )}
    />
  );
}

export function Button({
  children,
  variant = "solid",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "outline" | "accent" }) {
  const styles = {
    solid: "bg-forest text-canvas hover:bg-[#26391f]",
    accent: "bg-terracotta text-canvas hover:bg-clay",
    outline: "border border-ink/15 text-ink hover:bg-surface-2",
    ghost: "text-ink/70 hover:bg-surface-2 hover:text-ink",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-40 disabled:pointer-events-none",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-ink/10 bg-surface", className)}>{children}</div>;
}
