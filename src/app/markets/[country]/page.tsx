import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Mark, MarkKey } from "@/components/editorial/status";
import { SourcesTable } from "@/components/slots/sources-table";
import { spanishHelp } from "@/config/editorial";
import { getMarket, getMarkets } from "@/lib/data";
import { getEligibleOffersByMarket } from "@/lib/offers";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getMarkets()).map((m) => ({ country: m.code }));
}

export async function generateMetadata({ params }: PageProps<"/markets/[country]">) {
  const { country } = await params;
  const market = await getMarket(country);
  if (!market) return {};
  return pageMetadata({
    title: `Slots en línea en ${market.countryName} — Regulación, edad mínima y operadores`,
    description: `Quién regula los casinos en línea en ${market.countryName}, edad mínima y operadores verificados disponibles.`,
    path: `/markets/${market.code}`,
    noindex: market.status !== "verified",
  });
}

export default async function MarketPage({ params }: PageProps<"/markets/[country]">) {
  const { country } = await params;
  const market = await getMarket(country);
  if (!market) notFound();
  const offers = (await getEligibleOffersByMarket())[market.code] ?? [];
  const reg = market.regulatoryAuthority;

  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Directorio de casinos", path: "/casinos" }, { name: market.countryName, path: `/markets/${market.code}` }]} />
      <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-0">
        <div className="lg:pr-10">
          <p className="label text-accent">Notas del mercado · {market.countryCode}</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">{market.countryName}</h1>
          <p className="mt-3 max-w-2xl text-[1.2rem] leading-snug text-fg-2">
            Lo que sabemos sobre la regulación del casino en línea en este mercado y cómo afecta a nuestros listados. Cada dato indica su estado de verificación.
          </p>
        </div>
        <aside className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line">
          <dl className="ui space-y-3 text-sm">
            <div>
              <dt className="label text-fg-3">Regulador</dt>
              <dd className="mt-1">
                {reg.value ? (
                  <a href={reg.value.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
                    {reg.value.name}
                  </a>
                ) : (
                  "—"
                )}
                <Mark status={reg.status} />
                {reg.value?.englishName ? <span className="block text-fg-3">{reg.value.englishName}</span> : null}
              </dd>
            </div>
            <div>
              <dt className="label text-fg-3">Edad mínima</dt>
              <dd className="figure mt-1">
                {market.minimumLegalAge.value ? `${market.minimumLegalAge.value}+` : "—"}
                <Mark status={market.minimumLegalAge.status} />
              </dd>
            </div>
            <div>
              <dt className="label text-fg-3">Registro de licencias</dt>
              <dd className="mt-1">
                {market.licenceRegisterUrl.value ? (
                  <a href={market.licenceRegisterUrl.value} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
                    Registro público
                  </a>
                ) : (
                  "—"
                )}
                <Mark status={market.licenceRegisterUrl.status} />
              </dd>
            </div>
            <div>
              <dt className="label text-fg-3">Última verificación</dt>
              <dd className="figure mt-1">{market.lastVerifiedAt ? formatDate(market.lastVerifiedAt) : "Aún no verificado"}</dd>
            </div>
          </dl>
        </aside>
      </header>
      <MarkKey className="mt-4" />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-0">
        <section aria-labelledby="rules-h" className="lg:pr-10">
          <SectionHeading label="Publicidad y afiliación" title={<span id="rules-h">Normas que determinan qué mostramos</span>} />
          <ul className="mt-4 space-y-3">
            {(market.promotionalRules.value ?? []).map((r) => (
              <li key={r} className="grid grid-cols-[1rem_minmax(0,1fr)] leading-snug">
                <span aria-hidden className="text-accent">—</span>
                <span>
                  {r}
                  <Mark status={market.promotionalRules.status} />
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="listings-h" className="lg:border-l lg:border-line lg:pl-10">
          <SectionHeading label="Listados" title={<span id="listings-h">Operadores publicados para {market.countryName}</span>} />
          {offers.length === 0 ? (
            <p className="mt-4 border-y border-line py-5 text-[1.1rem] italic text-fg-2" data-testid="market-offers-empty">
              Aún no hay ofertas de operadores verificados para este mercado.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line" data-testid="market-offers">
              {offers.map((o) => (
                <li key={o.id} className="py-3">
                  {o.isTestData ? <p className="label text-conflict">Datos de prueba — No es un operador real</p> : null}
                  <Link href={`/casinos/${o.casinoSlug}`} className="headline text-[1.4rem] hover:text-accent">
                    {o.casinoName}
                  </Link>
                  <p className="text-fg-2">{o.headline}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-12" aria-labelledby="help-h">
        <SectionHeading label="Ayuda" title={<span id="help-h">Ayuda en {market.countryName}</span>} />
        <ul className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {spanishHelp.map((h) => (
            <li key={h.url + h.name} className="border-t border-line py-3">
              <a href={h.url} target="_blank" rel="noopener noreferrer" className="ui font-semibold underline decoration-line-strong underline-offset-4 hover:text-accent">
                {h.name} ↗
              </a>
              <p className="mt-0.5 leading-snug text-fg-2">
                {h.description}

              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="msrc-h">
        <SectionHeading label="Fuentes normativas" />
        <h2 id="msrc-h" className="sr-only">
          Fuentes
        </h2>
        <div className="mt-4">
          <SourcesTable sources={market.regulatorySources} />
        </div>
      </section>
    </Container>
  );
}
