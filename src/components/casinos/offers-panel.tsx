"use client";

import { ArrowUpRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMarket } from "@/components/layout/market-context";
import { MarketSelector } from "@/components/layout/market-selector";
import { track } from "@/lib/analytics";
import type { PublicOffer } from "@/lib/eligibility";
import { affiliateDisclosure, responsibleMessage } from "@/config/editorial";
import { formatDate } from "@/lib/utils";

/**
 * Commercial block, kept visually and structurally separate from editorial
 * content. Lists only offers that passed server-side eligibility for the
 * chosen market; /go re-checks every rule at click time.
 */
export function OffersPanel({ offersByMarket, context }: { offersByMarket: Record<string, PublicOffer[]>; context: string }) {
  const { market, options, ready } = useMarket();
  const [now, setNow] = useState<number | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- clock read must happen on the client
  useEffect(() => setNow(Date.now()), []);

  const current = options.find((o) => o.code === market);
  const offers = (market ? offersByMarket[market] ?? [] : []).filter(
    (o) => now === null || !o.expiresAt || new Date(o.expiresAt).getTime() > now,
  );

  return (
    <section
      aria-labelledby="offers-heading"
      className="rounded-xl border border-commercial/25 bg-[linear-gradient(160deg,rgb(244_199_106/0.06),transparent_60%)] p-5"
      data-testid="offers-panel"
    >
      <p className="mb-3 text-sm font-semibold text-fg">+18 | Juega con responsabilidad</p>
      <p className="mb-3 text-xs leading-relaxed text-fg-2">{responsibleMessage}</p>
      <p className="label inline-block rounded bg-commercial/15 px-1.5 py-1 text-commercial">Comercial</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <h2 id="offers-heading" className="font-semibold text-fg">
          Dónde jugar
        </h2>
        <MarketSelector />
      </div>

      {!ready ? (
        <div className="mt-3 h-12 animate-pulse rounded-lg bg-surface-2" />
      ) : !market ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-2" data-testid="offers-no-market">
          Elige tu mercado para ver los operadores cuya licencia hemos verificado. No deducimos tu ubicación.
        </p>
      ) : offers.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-2" data-testid="offers-empty">
          Aún no hay ofertas de operadores verificados para este mercado.{" "}
          <Link href={`/markets/${market}`} className="text-accent hover:underline">
            {current?.name} notas del mercado
          </Link>
        </p>
      ) : (
        <ul className="mt-3 space-y-2" data-testid="offers-list">
          {offers.map((o) => (
            <li key={o.id} className="rounded-lg bg-canvas/60 p-3 ring-1 ring-inset ring-line" data-testid="offer-item" data-offer-id={o.id}>
              {o.isTestData ? (
                <p className="label mb-2 inline-block rounded bg-conflict/15 px-1.5 py-0.5 text-conflict">
                  Datos de prueba — No es un operador real
                </p>
              ) : null}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/casinos/${o.casinoSlug}`} className="ui font-semibold hover:text-accent">
                    {o.casinoName}
                  </Link>
                  <p className="mt-0.5 text-sm text-fg-2">{o.headline}</p>
                </div>
                <a
                  href={`/go/${o.id}?market=${o.marketCode}`}
                  rel="sponsored noopener"
                  target="_blank"
                  onClick={() => track("affiliate_click", { offer: o.id, market: o.marketCode, context })}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-commercial px-3 text-xs font-semibold text-canvas hover:brightness-110"
                  data-testid="offer-cta"
                >
                  Enlace de afiliado <ArrowUpRight className="size-3.5" />
                </a>
              </div>
              <p className="figure mt-2 text-[0.7rem] leading-relaxed text-fg-3">
                {o.commercialRelationship} · válida para {o.marketCode.toUpperCase()} · verificada {formatDate(o.verifiedAt)} ·{" "}
                <a href={o.termsUrl} target="_blank" rel="sponsored noopener" className="underline">
                  Condiciones · Enlace de afiliado
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 flex gap-2 border-t border-line pt-3 text-xs leading-relaxed text-fg-3">
        <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>
          {affiliateDisclosure}{" "}
          <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-fg">
            Información de afiliación
          </Link>{" "}
          ·{" "}
          <Link href="/responsible-gambling" className="underline underline-offset-2 hover:text-fg">
            Obtener ayuda
          </Link>
        </span>
      </p>
    </section>
  );
}
