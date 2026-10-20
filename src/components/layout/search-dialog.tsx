"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { track } from "@/lib/analytics";
import { searchItems, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";

const typeLabel: Record<SearchItem["type"], string> = { slot: "Slot", provider: "Proveedor", page: "Página" };

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();
  const results = useMemo(() => searchItems(items, query), [items, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(href: string) {
    track("search_use", { query, results: results.length, destination: href });
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[active]) go(results[active].href);
    else if (query.trim()) go(`/slots?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex h-10 items-center gap-2 rounded-lg bg-surface px-3 text-sm text-fg-2 ring-1 ring-inset ring-line transition-colors hover:text-fg hover:ring-line-strong md:w-56"
        aria-label="Buscar slots y proveedores"
        data-testid="search-trigger"
      >
        <Search className="size-3.5" />
        <span className="hidden md:inline">Buscar juegos</span>
        <kbd className="figure ml-auto hidden rounded border border-line px-1.5 text-[0.625rem] text-fg-3 md:inline">/</kbd>
      </button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <DialogContent side="top" className="overflow-hidden p-0">
          <DialogTitle className="sr-only">Buscar</DialogTitle>
          <DialogDescription className="sr-only">Busca análisis por juego, proveedor o mecánica.</DialogDescription>
          <form onSubmit={onSubmit} className="flex items-center gap-3 border-b border-line px-4 py-3.5 pr-12">
            <Search className="size-4 text-accent" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                }
              }}
              placeholder="Juego, proveedor o mecánica…"
              className="w-full bg-transparent text-base text-fg placeholder:text-fg-3 focus:outline-none"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
              aria-label="Buscar"
              data-testid="search-input"
            />
          </form>
          <ul id={listId} role="listbox" className="max-h-[50vh] overflow-auto p-1.5">
            {results.map((r, i) => (
              <li key={r.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors",
                    i === active ? "bg-surface" : "hover:bg-surface/60",
                  )}
                >
                  <span>
                    <span className="ui block text-[0.95rem] font-semibold text-fg">{r.title}</span>
                    <span className="block text-sm text-fg-3">{r.subtitle}</span>
                  </span>
                  <span className="label shrink-0 text-fg-3">{typeLabel[r.type]}</span>
                </button>
              </li>
            ))}
            {query && results.length === 0 ? (
              <li className="px-4 py-6 text-fg-2">
                No hay resultados para «{query}». Pulsa Intro para buscar en todo el catálogo.
              </li>
            ) : null}
            {!query ? (
              <li className="px-4 py-5 text-sm italic text-fg-3">Prueba «cascadas», «Play’n GO» o «giros gratis».</li>
            ) : null}
          </ul>
          {query ? (
            <button
              type="button"
              onClick={() => go(`/slots?q=${encodeURIComponent(query.trim())}`)}
              className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-fg-2 hover:text-accent"
            >
              Ver todos los resultados <ArrowRight className="size-3.5" />
            </button>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
