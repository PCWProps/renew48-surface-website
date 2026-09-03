import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Asset, Campaign, Phase, WorkflowEvent, WorkflowStatus } from "@/types";
import { ASSETS, CAMPAIGNS, PHASES } from "@/data/campaigns";

// Bump the seed namespace when campaign structure changes so returning users
// receive the expanded email sequence instead of an older persisted snapshot.
const KEY = "cas.state.v2";

interface StudioState {
  campaigns: Campaign[];
  phases: Phase[];
  assets: Asset[];
  events: WorkflowEvent[];
}

interface StudioCtx extends StudioState {
  updateAsset: (id: string, patch: Partial<Asset>) => void;
  updateAssetContent: (id: string, patch: Partial<Asset["content"]>) => void;
  setStatus: (id: string, to: WorkflowStatus, note?: string) => void;
  resetSeed: () => void;
}

const Ctx = createContext<StudioCtx | null>(null);

function load(): StudioState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StudioState;
  } catch {
    /* ignore */
  }
  return { campaigns: CAMPAIGNS, phases: PHASES, assets: ASSETS, events: [] };
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudioState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const api = useMemo<StudioCtx>(
    () => ({
      ...state,
      updateAsset: (id, patch) =>
        setState((s) => ({ ...s, assets: s.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      updateAssetContent: (id, patch) =>
        setState((s) => ({
          ...s,
          assets: s.assets.map((a) => (a.id === id ? { ...a, content: { ...a.content, ...patch } } : a)),
        })),
      setStatus: (id, to, note) =>
        setState((s) => {
          const asset = s.assets.find((a) => a.id === id);
          if (!asset) return s;
          const ev: WorkflowEvent = {
            id: `ev-${Date.now()}`,
            assetId: id,
            from: asset.status,
            to,
            note,
            at: Date.now(),
          };
          return {
            ...s,
            assets: s.assets.map((a) => (a.id === id ? { ...a, status: to } : a)),
            events: [ev, ...s.events],
          };
        }),
      resetSeed: () => setState({ campaigns: CAMPAIGNS, phases: PHASES, assets: ASSETS, events: [] }),
    }),
    [state],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStudio(): StudioCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStudio must be used within StudioProvider");
  return v;
}
