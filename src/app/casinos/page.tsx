import Link from "next/link";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Mark } from "@/components/editorial/status";
import { getCasinos, getMarkets } from "@/lib/data";
import { getEligibleOffersByMarket } from "@/lib/offers";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Casinos — Criterios de publicación",
  description:
    "Criterios para publicar un casino: licencia confirmada en el registro del regulador para cada mercado y aprobación escrita del programa de afiliación.",
  path: "/casinos",
});

const CRITERIA = [
  ["Licencia por mercado", "Confirmamos la licencia en el registro público del regulador de cada mercado e indicamos la fecha de comprobación."],
  ["Entidad jurídica", "Registramos la empresa titular de la licencia, además de su marca comercial."],
  ["Aprobación escrita del programa", "El programa de afiliación debe aprobar por escrito esta web como fuente de tráfico. Registrarse en una red no equivale a tener aprobadas todas sus ofertas."],
  ["Enlace de seguimiento exacto", "Solo utilizamos la URL de seguimiento facilitada por el programa, en un dominio HTTPS autorizado. No la construimos por nuestra cuenta."],
  ["Condiciones de la oferta verificadas", "Solo mostramos bonos verificados para ese mercado y esa fecha. En mercados como Ontario pueden existir restricciones a su publicación."],
  ["Orden editorial", "Las comisiones no deciden el orden. Si hay listados, publicamos sus criterios de ordenación junto a ellos."],
] as const;

export default async function CasinosPage() {
  const [casinos, markets, offersByMarket] = await Promise.all([getCasinos(), getMarkets(), getEligibleOffersByMarket()]);
  const real = casinos.filter((c) => !c.isTestData);
  const test = casinos.filter((c) => c.isTestData);

  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Directorio de casinos", path: "/casinos" }]} />
      <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-0">
        <div className="lg:pr-10">
          <p className="label text-accent">Directorio de casinos</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Operadores verificados, antes de aparecer aquí</h1>
          <p className="mt-3 max-w-2xl text-[1.2rem] leading-snug text-fg-2">
            Este directorio está vacío hasta completar las comprobaciones. Solo publicamos un operador cuando confirmamos su licencia para el mercado correspondiente y el programa aprueba la web por escrito.
          </p>
        </div>
        <aside className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line">
          <p className="label text-fg-3">Estado actual</p>
          <dl className="figure mt-2 divide-y divide-line text-sm">
            <div className="flex justify-between py-1.5">
              <dt className="text-fg-3">Operadores verificados</dt>
              <dd>{real.length}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-fg-3">Ofertas aprobadas</dt>
              <dd>{Object.values(offersByMarket).reduce((n, l) => n + l.filter((o) => !o.isTestData).length, 0)}</dd>
            </div>
            <div className="flex justify-between py-1.5">
              <dt className="text-fg-3">Mercados en seguimiento</dt>
              <dd>{markets.length}</dd>
            </div>
          </dl>
        </aside>
      </header>

      <section className="mt-12" aria-labelledby="dir-h">
        <SectionHeading label="Directorio" title={<span id="dir-h">Operadores verificados</span>} />
        {real.length === 0 ? (
          <p className="mt-4 max-w-2xl border-y border-line py-6 text-[1.1rem] italic text-fg-2" data-testid="casinos-empty">
            Ningún operador ha completado todavía la verificación. Cuando lo haga, aparecerá aquí con sus mercados autorizados y la fecha de cada comprobación.
          </p>
        ) : (
          <CasinoList casinos={real} />
        )}
        {test.length ? (
          <div className="mt-8 rounded-xl border border-dashed border-conflict/60 p-5" data-testid="test-casinos">
            <p className="label text-conflict">Datos ficticios de prueba · Solo visibles en desarrollo</p>
            <CasinoList casinos={test} />
          </div>
        ) : null}
      </section>

      <section className="mt-12" aria-labelledby="crit-h">
        <SectionHeading label="Criterios" title={<span id="crit-h">Qué verificamos antes de publicar un operador</span>} />
        <ol className="mt-4 grid gap-x-10 md:grid-cols-2">
          {CRITERIA.map(([t, b], i) => (
            <li key={t} className="grid grid-cols-[2rem_minmax(0,1fr)] border-t border-line py-4">
              <span className="figure text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="headline text-[1.4rem]">{t}</h3>
                <p className="mt-1 leading-snug text-fg-2">{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="mk-h">
        <SectionHeading label="Mercados" title={<span id="mk-h">Reguladores que consultamos</span>} />
        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((m) => (
            <li key={m.code} className="border-t border-line py-3">
              <Link href={`/markets/${m.code}`} className="group block">
                <span className="headline text-[1.5rem] group-hover:text-accent">{m.countryName}</span>
                <span className="mt-0.5 block text-fg-2">
                  {m.regulatoryAuthority.value?.englishName ?? m.regulatoryAuthority.value?.name}
                  <Mark status={m.regulatoryAuthority.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}

function CasinoList({ casinos }: { casinos: Awaited<ReturnType<typeof getCasinos>> }) {
  return (
    <ul className="mt-3 divide-y divide-line">
      {casinos.map((c) => (
        <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
          <Link href={`/casinos/${c.slug}`} className="headline text-[1.5rem] hover:text-accent">
            {c.name}
          </Link>
          <span className="figure text-sm text-fg-2">
            {c.licences.map((l) => l.marketCode.toUpperCase()).join(" · ")} · comprobado {formatDate(c.lastVerifiedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
