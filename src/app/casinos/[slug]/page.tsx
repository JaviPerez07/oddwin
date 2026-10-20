import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { SectionHeading } from "@/components/editorial/section-heading";
import { getCasinoBySlug, getCasinos } from "@/lib/data";
import { getEligibleOffersByMarket } from "@/lib/offers";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCasinos()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/casinos/[slug]">) {
  const { slug } = await params;
  const casino = await getCasinoBySlug(slug);
  if (!casino) return {};
  return pageMetadata({
    title: `${casino.name} — Licencias y ficha del operador`,
    description: `Comprobaciones de licencia y estado de publicación de ${casino.name}.`,
    path: `/casinos/${casino.slug}`,
    noindex: Boolean(casino.isTestData) || casino.status !== "verified",
  });
}

export default async function CasinoPage({ params }: PageProps<"/casinos/[slug]">) {
  const { slug } = await params;
  const casino = await getCasinoBySlug(slug);
  if (!casino) notFound();
  const offersByMarket = await getEligibleOffersByMarket();
  const offers = Object.values(offersByMarket).flat().filter((o) => o.casinoSlug === casino.slug);

  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Directorio de casinos", path: "/casinos" }, { name: casino.name, path: `/casinos/${casino.slug}` }]} />
      {casino.isTestData ? (
        <p className="label mt-6 inline-block rounded-md bg-conflict/15 px-2 py-1 text-conflict" data-testid="test-data-banner">
          Datos de prueba — Operador ficticio para desarrollo
        </p>
      ) : null}
      <header className="mt-4 max-w-3xl">
        <p className="label text-accent">Ficha del operador</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">{casino.name}</h1>
        <p className="mt-3 text-[1.2rem] leading-snug text-fg-2">{casino.editorialSummary}</p>
      </header>
      <section className="mt-10" aria-labelledby="lic-h">
        <SectionHeading label="Licencias" title={<span id="lic-h">Verificado por mercado</span>} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="label border-b border-line-strong text-fg-3">
                <th scope="col" className="py-2">Mercado</th>
                <th scope="col" className="py-2">Autoridad</th>
                <th scope="col" className="py-2">Licencia</th>
                <th scope="col" className="py-2">Comprobación</th>
              </tr>
            </thead>
            <tbody>
              {casino.licences.map((l) => (
                <tr key={l.marketCode} className="border-b border-line">
                  <td className="figure py-2">{l.marketCode.toUpperCase()}</td>
                  <td className="py-2">{l.authority}</td>
                  <td className="figure py-2">{l.licenceNumber}</td>
                  <td className="figure py-2">{formatDate(l.lastVerifiedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ui mt-3 text-sm text-fg-3">
          Entidad jurídica: {casino.legalEntity} · Ofertas disponibles: {offers.length}
        </p>
      </section>
    </Container>
  );
}
