"use client";

import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SpecPart } from "@/lib/facts";
import { cn } from "@/lib/utils";
import type { SlotArtwork } from "@/types/slot";
import { AmbientArt } from "./ambient-art";
import { SlotCover } from "./slot-cover";

export interface SpotlightItem {
  slug: string;
  name: string;
  provider: string;
  headline: string;
  dek: string;
  artwork: SlotArtwork;
  /** Verified figures only. */
  facts: SpecPart[];
  pendingCount: number;
  mechanics: string[];
  demoUrl: string | null;
}

/**
 * Homepage feature. With licensed artwork the image leads and the details sit
 * beside it (never on top of it). Without artwork the — Análisis itself leads —
 * no stand-in picture. A shelf lets readers switch the feature manually.
 */
export function Spotlight({ items }: { items: SpotlightItem[] }) {
  const [index, setIndex] = useState(0);
  const active = items[index];
  const art = active.artwork.licensed;

  return (
    <section aria-label="Análisis destacados" className="relative isolate overflow-hidden border-b border-line">
      {art ? (
        // Ambient light taken from the artwork itself.
        <AmbientArt src={art.src} className="-z-10 scale-110 object-cover opacity-25 blur-3xl" />
      ) : null}
      <div className="mx-auto grid max-w-[88rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 lg:px-8 lg:py-10">
        <div className={cn("grid min-w-0 gap-6", art && "xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:items-center")}>
          {art ? (
            <Link href={`/slots/${active.slug}`} className="group block" aria-label={`Leer el análisis de ${active.name}`}>
              <SlotCover artwork={active.artwork} name={active.name} provider={active.provider} surface="hero" aspect="16/9" size="lg" priority sizes="(min-width: 1280px) 45vw, 100vw" className="rounded-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]" />
            </Link>
          ) : null}

          <div className={cn("min-w-0", !art && "rounded-2xl bg-surface p-6 ring-1 ring-inset ring-line sm:p-8")}>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-semibold text-accent">{active.provider}</span>
              <span className="text-fg-3">·</span>
              <span className="text-fg-3">Análisis destacado</span>
            </p>
            <h1 className="headline mt-3 text-[2.1rem] sm:text-[2.75rem]">
              <Link href={`/slots/${active.slug}`} className="hover:text-accent">
                {active.name}
              </Link>
            </h1>
            <p className="mt-2 text-lg text-fg">{active.headline}.</p>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-2">{active.dek}</p>

            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Mecánicas">
              {active.mechanics.map((m) => (
                <li key={m} className="rounded-md bg-surface-2 px-2 py-1 text-xs text-fg-2 ring-1 ring-inset ring-line">
                  {m}
                </li>
              ))}
            </ul>

            {active.facts.length ? (
              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {active.facts.map((f) => (
                  <div key={f.key}>
                    <dt className="text-xs text-fg-3">{f.label}</dt>
                    <dd className="figure mt-0.5 text-fg">{f.text}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {active.pendingCount ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-fg-3">
                <span aria-hidden className="size-1.5 rounded-full bg-pending" />
                Estamos verificando el RTP, la volatilidad y el premio máximo con la documentación del proveedor.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={`/slots/${active.slug}`}>
                  Leer el análisis <ArrowRight />
                </Link>
              </Button>
              {active.demoUrl ? (
                <Button asChild size="lg" variant="secondary">
                  <a href={active.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Play /> Jugar a la demo
                  </a>
                </Button>
              ) : (
                <span className="text-sm text-fg-3">Enlace de demo pendiente de verificación</span>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-3">En análisis</p>
          <ul className="scroll-shelf -mx-4 mt-3 flex gap-2 overflow-x-auto scroll-px-4 px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {items.map((item, i) => (
              <li key={item.slug} className="w-[14rem] shrink-0 snap-start lg:w-auto">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  aria-label={`Destacado ${item.name}`}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors",
                    i === index ? "bg-surface-2 ring-1 ring-inset ring-line-strong" : "hover:bg-surface",
                  )}
                  data-testid="spotlight-item"
                >
                  {item.artwork.card ? (
                    <SlotCover artwork={item.artwork} name={item.name} aspect="16/9" size="sm" zoomOnHover={false} className="w-20 shrink-0 rounded-md" sizes="80px" />
                  ) : (
                    <span aria-hidden className="h-9 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: i === index ? "var(--color-accent)" : item.artwork.palette.base }} />
                  )}
                  <span className="min-w-0">
                    <span className={cn("block truncate text-sm font-semibold", i === index ? "text-fg" : "text-fg-2 group-hover:text-fg")}>{item.name}</span>
                    <span className="block truncate text-xs text-fg-3">{item.provider}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
