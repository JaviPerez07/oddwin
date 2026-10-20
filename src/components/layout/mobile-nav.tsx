"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MarketSelector } from "./market-selector";

export function MobileNav({ links }: { links: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="grid size-10 place-items-center rounded-lg text-fg hover:bg-surface-2 md:hidden"
        aria-label="Abrir menú"
        data-testid="mobile-menu-trigger"
      >
        <Menu className="size-4" />
      </DialogTrigger>
      <DialogContent side="right" className="flex flex-col bg-canvas-2 p-5 pt-14">
        <DialogTitle className="label text-accent">Secciones</DialogTitle>
        <DialogDescription className="sr-only">Navegación de la web</DialogDescription>
        <nav aria-label="Móvil" className="mt-4">
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="headline block py-3 text-3xl text-fg transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto space-y-4 border-t border-line pt-5">
          <MarketSelector />
          <ul className="ui grid grid-cols-2 gap-2 text-sm text-fg-2">
            {[
              ["/responsible-gambling", "Juego responsable"],
              ["/affiliate-disclosure", "Información sobre afiliación"],
              ["/about", "El estudio"],
              ["/contact", "Contacto"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)} className="hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
