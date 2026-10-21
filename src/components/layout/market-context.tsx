"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface MarketOption {
  code: string;
  name: string;
  minimumAge: number | null;
}

interface MarketContextValue {
  market: string | null;
  setMarket: (code: string | null) => void;
  options: MarketOption[];
  ready: boolean;
}

const MarketContext = createContext<MarketContextValue | null>(null);
const STORAGE_KEY = "paytable.market";

/**
 * The visitor picks their market manually. We never infer it from IP, and the
 * choice only controls which (already verified) offers are listed — it is not
 * a legal eligibility check. Stored locally on the device; no cookie.
 */
export function MarketProvider({ options, children }: { options: MarketOption[]; children: React.ReactNode }) {
  const [market, setMarketState] = useState<string | null>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (saved && options.some((o) => o.code === saved)) setMarketState(saved);
    } catch {
      /* storage blocked: stay unset */
    }
    setReady(true);
  }, [options]);

  const setMarket = useCallback((code: string | null) => {
    if (code !== null && !options.some((option) => option.code === code)) return;
    setMarketState(code);
    try {
      if (code) window.localStorage.setItem(STORAGE_KEY, code);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [options]);

  const value = useMemo(() => ({ market, setMarket, options, ready }), [market, setMarket, options, ready]);
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used inside MarketProvider");
  return ctx;
}
