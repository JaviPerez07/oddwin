import Link from "next/link";
import { site } from "@/config/site";
import type { SearchItem } from "@/lib/search";
import { MarketSelector } from "./market-selector";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { SearchDialog } from "./search-dialog";
import { Wordmark } from "./wordmark";

export function SiteHeader({ searchIndex }: { searchIndex: SearchItem[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-accent-ink">
        Ir al contenido
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-[92rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Wordmark />
        <nav aria-label="Principal" className="ml-3 hidden md:block">
          <ul className="flex items-center gap-0.5">
            {site.nav.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchDialog items={searchIndex} />
          <MarketSelector className="hidden sm:inline-flex" />
          <Link href="/contact" className="hidden min-h-10 items-center gap-2 rounded-full bg-commercial px-4 text-xs font-bold text-[#17120a] transition-colors hover:bg-[#ffda8a] lg:inline-flex">Colabora con nosotros <span aria-hidden>↗</span></Link>
          <MobileNav links={site.nav} />
        </div>
      </div>
    </header>
  );
}
