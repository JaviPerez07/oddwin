"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import type { DemoState } from "@/types/slot";

/**
 * Four-state demo block. Only "verified" and "official_site_only" render a
 * live CTA; the other states explain why there is no button.
 */
export function DemoPanel({ demo, slotName, slotSlug }: { demo: DemoState; slotName: string; slotSlug: string }) {
  const live = demo.kind === "verified" || demo.kind === "official_site_only";

  return (
    <section aria-labelledby="demo-heading" className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line" data-testid="demo-panel" data-demo-state={demo.kind}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="demo-heading" className="font-semibold text-fg">
          Demo gratuita
        </h2>
        <span className={live ? "text-xs font-semibold text-verified" : "text-xs font-semibold text-pending"}>{live ? "Disponible" : demo.kind === "pending" ? "Pendiente de verificación" : "Sin localizar"}</span>
      </div>
      {live ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">
            {demo.kind === "official_site_only"
              ? `Abre la demo de ${slotName} en la web oficial del proveedor, en otra pestaña. Sin dinero real.`
              : `Una versión gratuita verificada de ${slotName}. Sin dinero real.`}
          </p>
          <Button asChild size="lg" className="mt-3 w-full">
            <a href={demo.url} target="_blank" rel="noopener noreferrer" onClick={() => track("demo_click", { slot: slotSlug, state: demo.kind })} data-testid="demo-cta">
              Jugar a la demo {demo.kind === "official_site_only" ? <ArrowUpRight /> : null}
            </a>
          </Button>
          <p className="figure mt-2 text-[0.7rem] text-fg-3">
            Fuente: {demo.source} · comprobado {formatDate(demo.checkedAt)}
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{demo.note}</p>
          <p className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong text-sm text-fg-3">
            Sin enlace a demo hasta verificarlo
          </p>
        </>
      )}
    </section>
  );
}
