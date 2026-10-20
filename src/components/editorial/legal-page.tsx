import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./container";
import { formatDate } from "@/lib/utils";

/**
 * Shared layout for trust/legal pages. `draft` adds a visible notice that the
 * text has not had legal — Análisis — we never claim compliance we haven't checked.
 */
export function LegalPage({
  title,
  label,
  intro,
  path,
  updated,
  draft,
  children,
}: {
  title: string;
  label: string;
  intro: string;
  path: string;
  updated: string;
  draft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: title, path }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-0">
        <article className="min-w-0 max-w-[42rem] lg:pr-10">
          <p className="label text-accent">{label}</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">{title}</h1>
          <p className="mt-4 text-[1.3rem] leading-[1.38] text-fg-2">{intro}</p>
          {draft ? (
            <div role="note" className="mt-6 border-l-[3px] border-pending bg-surface py-3 pl-4 pr-3">
              <p className="label text-pending">Borrador · Pendiente de revisión jurídica</p>
              <p className="mt-1 leading-snug text-fg-2">
                Este texto describe el funcionamiento actual de la web. No ha sido revisado por un abogado para ninguna jurisdicción y no acredita cumplimiento normativo.
              </p>
            </div>
          ) : null}
          <div className="prose-review mt-8 space-y-8 [&_h2]:headline [&_h2]:mb-2 [&_h2]:border-t [&_h2]:border-line-strong [&_h2]:pt-3 [&_h2]:text-[1.7rem] [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </div>
        </article>
        <aside className="lg:border-l lg:border-line lg:pl-6">
          <dl className="ui space-y-4 text-sm">
            <div>
              <dt className="label text-fg-3">Última actualización</dt>
              <dd className="figure mt-1">{formatDate(updated)}</dd>
            </div>
            <div>
              <dt className="label text-fg-3">Estado</dt>
              <dd className="mt-1">{draft ? "Borrador — Pendiente de revisión jurídica" : "Política editorial"}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
