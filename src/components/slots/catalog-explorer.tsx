"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { mechanicInfo, signatureMechanic, volatilityLabel } from "@/lib/mechanics";
import { searchItems } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Mechanic, SlotArtwork, Volatility } from "@/types/slot";
import { SlotCover } from "./slot-cover";

export interface CatalogItem {
  slug: string;
  name: string;
  headline: string;
  providerId: string;
  providerName: string;
  shortDescription: string;
  mechanics: Mechanic[];
  /** Verified values only; null when unverified. */
  layout: string | null;
  volatility: Volatility | null;
  rtp: number | null;
  rtpText: string | null;
  maxWinText: string | null;
  updatedAt: string;
  artwork: SlotArtwork;
  pending: boolean;
}

type Sort = "updated" | "name" | "rtp";
type View = "covers" | "list";
const SORTS: { value: Sort; label: string }[] = [
  { value: "updated", label: "Actualizados recientemente" },
  { value: "name", label: "A–Z" },
  { value: "rtp", label: "RTP de mayor a menor" },
];

function Toggle({ active, onClick, children, testId }: { active: boolean; onClick: () => void; children: React.ReactNode; testId?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-testid={testId}
      className={cn(
        "h-8 shrink-0 rounded-lg px-3 text-sm transition-colors",
        active ? "bg-accent font-semibold text-accent-ink" : "bg-surface text-fg-2 ring-1 ring-inset ring-line hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function FilterRow({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-2 py-2 sm:grid-cols-[6rem_minmax(0,1fr)] sm:items-center sm:gap-3">
      <legend className="sr-only">{legend}</legend>
      <span aria-hidden className="text-xs font-medium text-fg-3">
        {legend}
      </span>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">{children}</div>
    </fieldset>
  );
}

export function CatalogExplorer({ items, providers }: { items: CatalogItem[]; providers: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const provider = params.get("provider");
  const mechanic = params.get("mechanic") as Mechanic | null;
  const volatility = params.get("volatility") as Volatility | null;
  const sort = (params.get("sort") as Sort | null) ?? "updated";
  const view = (params.get("view") as View | null) ?? "covers";

  const mechanicsInUse = useMemo(() => {
    const set = new Set<Mechanic>();
    items.forEach((i) => i.mechanics.forEach((m) => set.add(m)));
    return [...set].sort((a, b) => mechanicInfo[a].label.localeCompare(mechanicInfo[b].label));
  }, [items]);
  const volatilitiesInUse = useMemo(
    () => (Object.keys(volatilityLabel) as Volatility[]).filter((v) => items.some((i) => i.volatility === v)),
    [items],
  );

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function setFilter(key: "provider" | "mechanic" | "volatility" | "sort", value: string | null) {
    track("filter_use", { filter: key, value: value ?? "cleared" });
    update({ [key]: value });
  }

  // Debounce writing the search query to the URL.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      update({ q: q.trim() || null });
      if (q.trim()) track("search_use", { query: q.trim(), surface: "catalog" });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => {
    let list = items;
    if (q.trim()) {
      const matches = new Set(
        searchItems(
          items.map((i) => ({
            type: "slot" as const,
            title: i.name,
            subtitle: i.providerName,
            href: i.slug,
            keywords: `${i.shortDescription} ${i.headline} ${i.mechanics.map((m) => mechanicInfo[m].label).join(" ")}`,
          })),
          q,
          items.length,
        ).map((r) => r.href),
      );
      list = list.filter((i) => matches.has(i.slug));
    }
    if (provider) list = list.filter((i) => i.providerId === provider);
    if (mechanic) list = list.filter((i) => i.mechanics.includes(mechanic));
    if (volatility) list = list.filter((i) => i.volatility === volatility);
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "rtp") sorted.sort((a, b) => (b.rtp ?? -1) - (a.rtp ?? -1));
    else sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name));
    return sorted;
  }, [items, q, provider, mechanic, volatility, sort]);

  const activeCount = [q.trim(), provider, mechanic, volatility].filter(Boolean).length;

  function clearAll() {
    setQ("");
    track("filter_use", { filter: "all", value: "cleared" });
    router.replace(view === "list" ? `${pathname}?view=list` : pathname, { scroll: false });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-2xl bg-canvas-2 p-4 ring-1 ring-inset ring-line sm:p-5">
        <div className="mb-2 flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-center">
          <label className="relative flex h-11 flex-1 items-center md:max-w-md">
            <span className="sr-only">Buscar en el catálogo</span>
            <Search className="pointer-events-none absolute left-3 size-4 text-fg-3" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar juegos, estudios o mecánicas"
              className="h-11 w-full rounded-lg bg-surface pl-9 pr-3 text-base text-fg ring-1 ring-inset ring-line placeholder:text-fg-3 focus:outline-2 focus:outline-accent"
              data-testid="catalog-search"
            />
          </label>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:ml-auto">
            <label className="ui flex items-center gap-2 text-sm">
              <span className="text-xs font-medium text-fg-3">Ordenar</span>
              <select
                value={sort}
                onChange={(e) => setFilter("sort", e.target.value === "updated" ? null : e.target.value)}
                className="h-9 rounded-lg bg-surface px-2 text-sm text-fg ring-1 ring-inset ring-line"
                data-testid="catalog-sort"
              >
                {SORTS.filter((s) => s.value !== "rtp" || items.some((i) => i.rtp !== null)).map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3" role="group" aria-label="Vista">
              <span className="text-xs font-medium text-fg-3">Vista</span>
              <Toggle active={view === "covers"} onClick={() => update({ view: null })} testId="view-covers">
                Portadas
              </Toggle>
              <Toggle active={view === "list"} onClick={() => update({ view: "list" })} testId="view-list">
                Lista
              </Toggle>
            </div>
          </div>
        </div>

        <FilterRow legend="Estudio">
          {providers.map((p) => (
            <Toggle key={p.id} active={provider === p.id} onClick={() => setFilter("provider", provider === p.id ? null : p.id)} testId={`filter-provider-${p.id}`}>
              {p.name}
            </Toggle>
          ))}
        </FilterRow>
        <FilterRow legend="Mecánica">
          {mechanicsInUse.map((m) => (
            <Toggle key={m} active={mechanic === m} onClick={() => setFilter("mechanic", mechanic === m ? null : m)} testId={`filter-mechanic-${m}`}>
              {mechanicInfo[m].label}
            </Toggle>
          ))}
        </FilterRow>
        {volatilitiesInUse.length ? (
          <FilterRow legend="Volatilidad">
            {volatilitiesInUse.map((v) => (
              <Toggle key={v} active={volatility === v} onClick={() => setFilter("volatility", volatility === v ? null : v)} testId={`filter-volatility-${v}`}>
                {volatilityLabel[v]}
              </Toggle>
            ))}
          </FilterRow>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <p className="figure text-sm text-fg-2" aria-live="polite" data-testid="catalog-count">
          {results.length} {results.length === 1 ? "juego" : "juegos"}
          {" "}{activeCount ? "encontrados" : "en nuestro catálogo"}
        </p>
        {activeCount ? (
          <button type="button" onClick={clearAll} className="ui inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline" data-testid="catalog-clear">
            <X className="size-3.5" /> Borrar {activeCount} {activeCount === 1 ? "filtro" : "filtros"}
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-surface py-14 text-center ring-1 ring-inset ring-line" data-testid="catalog-empty">
          <p className="headline text-[1.8rem]">No hay coincidencias.</p>
          <p className="mx-auto mt-2 max-w-sm text-fg-2">Ningún juego coincide con estos filtros. Quita alguno o busca por estudio o mecánica.</p>
          <button type="button" onClick={clearAll} className="mt-5 h-10 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:bg-accent-strong">
            Borrar filtros
          </button>
        </div>
      ) : view === "covers" ? (
        <motion.ul layout className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="catalog-results">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((item) => (
              <motion.li key={item.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="min-w-0">
                <Link href={`/slots/${item.slug}`} className="group block" data-testid="slot-card">
                  <SlotCover artwork={item.artwork} name={item.name} provider={item.providerName} mechanic={signatureMechanic(item.mechanics)} aspect="4/3" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <div className={item.artwork.card ? "mt-3" : "sr-only"}>
                    <h2 className="font-semibold leading-tight group-hover:text-accent">{item.name}</h2>
                    <p className="mt-0.5 text-sm text-fg-3">{item.providerName}</p>
                  </div>
                  <Figures item={item} className="mt-2.5" />
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <motion.ol layout className="mt-4" data-testid="catalog-results">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((item, i) => (
              <motion.li key={item.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="border-b border-line last:border-b-0">
                <Link
                  href={`/slots/${item.slug}`}
                  className="group grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-4 rounded-lg px-1 py-3 transition-colors hover:bg-surface sm:grid-cols-[2rem_9rem_minmax(0,1fr)] md:grid-cols-[2rem_10rem_minmax(0,1.3fr)_minmax(0,1fr)]"
                  data-testid="slot-card"
                >
                  <span className="figure hidden pt-1 text-xs text-fg-3 sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <SlotCover artwork={item.artwork} name={item.name} aspect="16/9" size="sm" sizes="160px" className="rounded-lg" />
                  <div className="min-w-0">
                    <p className="text-sm text-fg-3">{item.providerName}</p>
                    <h2 className="mt-0.5 text-lg font-semibold leading-tight group-hover:text-accent">{item.name}</h2>
                    <p className="mt-1 text-sm leading-snug text-fg-2">{item.headline}</p>
                    <Figures item={item} className="mt-2 md:hidden" />
                  </div>
                  <div className="hidden md:block">
                    <Figures item={item} />
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>
      )}
      <p className="mt-8 text-xs text-fg-3">Las cifras aparecen aquí tras verificarlas con la documentación del proveedor. Cada ficha técnica incluye las referencias y sus fuentes.</p>
    </MotionConfig>
  );
}

function Figures({ item, className }: { item: CatalogItem; className?: string }) {
  const parts: [string, string | null][] = [
    ["", item.layout],
    ["RTP", item.rtpText],
    ["Vol", item.volatility ? volatilityLabel[item.volatility] : null],
    ["Max", item.maxWinText],
  ];
  const shown = parts.filter(([, v]) => v);
  return (
    <div className={className}>
      {shown.length ? (
        <p className="figure flex flex-wrap gap-x-3 text-xs text-fg-2">
          {shown.map(([k, v]) => (
            <span key={k || "layout"}>
              {k ? <span className="text-fg-3">{k} </span> : null}
              {v}
            </span>
          ))}
        </p>
      ) : null}
      <p className="mt-1 line-clamp-1 text-xs text-fg-3">{item.mechanics.map((m) => mechanicInfo[m].label).join(" · ")}</p>
    </div>
  );
}
