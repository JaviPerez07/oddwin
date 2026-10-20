"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { analyticsConfigured, getConsent, setConsent, track } from "@/lib/analytics";

/** Fires page_view on route change. Transmission itself is consent-gated in track(). */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname]);
  return null;
}

/**
 * Shown only when an analytics endpoint is configured. Until the visitor
 * accepts, nothing is sent. No cookies are used either way.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state after mount
    if (analyticsConfigured() && getConsent() === null) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Consentimiento de analítica" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl border border-line-strong bg-surface-2 p-4 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]">
      <p className="ui font-semibold">¿Nos permites medir el uso anónimo?</p>
      <p className="mt-1 text-sm leading-snug text-fg-2">
        El recuento de visitas y clics nos ayuda a decidir qué analizar. No usamos cookies ni perfiles publicitarios. Si lo rechazas, la web funciona igual.
      </p>
      <div className="mt-4 flex gap-2">
        <button className="ui h-9 bg-fg px-4 text-sm font-semibold text-canvas" onClick={() => { setConsent("granted"); setVisible(false); }}>
          Permitir
        </button>
        <button className="ui h-9 border border-line-strong px-4 text-sm font-semibold" onClick={() => { setConsent("denied"); setVisible(false); }}>
          Rechazar
        </button>
      </div>
    </div>
  );
}
