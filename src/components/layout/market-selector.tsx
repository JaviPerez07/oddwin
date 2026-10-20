"use client";

import { Check, Globe2 } from "lucide-react";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMarket } from "./market-context";

export function MarketSelector({ className }: { className?: string }) {
  const { market, setMarket, options } = useMarket();
  const current = options.find((o) => o.code === market);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "group inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-fg-2 ring-1 ring-inset ring-line transition-colors hover:text-fg hover:ring-line-strong",
          className,
        )}
        aria-label={`Mercado: ${current ? current.name : "sin elegir"}. Cambiar mercado`}
        data-testid="market-trigger"
      >
        <Globe2 className="size-3.5" />
        <span className="sr-only sm:not-sr-only">Mercado</span>
        <span className="figure rounded bg-surface-2 px-1.5 text-[0.75rem] text-fg">{current ? current.code.toUpperCase() : "—"}</span>
      </PopoverTrigger>
      <PopoverContent className="w-[19rem]">
        <div className="px-3 pb-2 pt-3">
          <p className="label text-accent">Tu mercado</p>
          <p className="mt-2 text-sm leading-snug text-fg-2">
            Elige dónde estás para ver los operadores verificados para tu mercado. No deducimos tu ubicación.
          </p>
        </div>
        <ul role="listbox" aria-label="Mercados" className="mt-1 max-h-80 overflow-auto">
          {[{ code: "", name: "Sin elegir", minimumAge: null }, ...options].map((o) => {
            const selected = (market ?? "") === o.code;
            return (
              <li key={o.code || "none"}>
                <PopoverClose asChild>
                  <button
                    role="option"
                    aria-selected={selected}
                    onClick={() => setMarket(o.code || null)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2",
                      selected ? "text-fg" : "text-fg-2",
                    )}
                    data-testid={`market-option-${o.code || "none"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="figure w-12 text-xs text-fg-3">{o.code ? o.code.toUpperCase() : "··"}</span>
                      {o.name}
                    </span>
                    {selected ? <Check className="size-4 text-accent" /> : null}
                  </button>
                </PopoverClose>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
