import Link from "next/link";
import { site } from "@/config/site";
import { spanishHelp, responsibleMessage } from "@/config/editorial";
import { Wordmark } from "./wordmark";

const columns = [
  { title: "Estudio", links: [["/services", "Servicios para empresas"], ["/games", "Nuestros juegos"], ["/contact", "Cuéntanos tu proyecto"]] },
  { title: "Explorar", links: [["/slots", "Revista de slots"], ["/providers", "Proveedores de juegos"], ["/casinos", "Directorio de casinos"], ["/markets/es", "España"]] },
  { title: "Criterios editoriales", links: [["/methodology", "Cómo analizamos"], ["/affiliate-disclosure", "Información sobre afiliación"], ["/responsible-gambling", "Juego responsable"], ["/about", "El estudio"]] },
  { title: "Legal", links: [["/privacy", "Privacidad"], ["/terms", "Condiciones"]] },
] as const;

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="mt-28 border-t border-line bg-canvas-2">
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="flex items-center gap-3 text-sm text-fg">
            <span className="grid h-8 min-w-8 place-items-center rounded-md border border-pending/60 px-1.5 text-xs font-bold text-pending">+18</span>
            <span>| Juega con responsabilidad. {responsibleMessage}</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {spanishHelp.map((h) => (
              <li key={h.url}>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  {h.name}{h.phone ? ` · ${h.phone} (gratuito)` : ""}
                </a>
              </li>
            ))}
            <li>
              <Link href="/responsible-gambling" className="text-fg-2 hover:text-fg">
                Encuentra ayuda →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-8">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-fg-2">{site.tagline}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="label text-fg-3">{col.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-fg-2 transition-colors hover:text-fg">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[88rem] flex-col gap-2 border-t border-line px-4 py-5 text-xs text-fg-3 sm:px-6 md:flex-row md:justify-between lg:px-8">
        <p>© {year} {site.publisher}. Los nombres y marcas de los juegos pertenecen a sus titulares.</p>
        <p>Mostramos material gráfico con permiso de sus titulares. Los casinos y enlaces de afiliación solo se publican tras verificar el mercado y el programa.</p>
      </div>
    </footer>
  );
}
