import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Mark } from "@/components/editorial/status";
import { SlotCover } from "@/components/slots/slot-cover";
import { SourcesTable } from "@/components/slots/sources-table";
import { getProviderBySlug, getProviders, getSlotsByProvider } from "@/lib/data";
import { mechanicInfo } from "@/lib/mechanics";
import { pageMetadata } from "@/lib/seo";
import type { Mechanic } from "@/types/slot";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProviders()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/providers/[slug]">) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};
  const games = await getSlotsByProvider(provider.id);
  return pageMetadata({
    title: `${provider.name} — Slots y ficha del estudio`,
    description: `${provider.name}: ${provider.description}`,
    path: `/providers/${provider.slug}`,
    // A studio page is only worth indexing once at least one of its — Análisiss is published.
    noindex: provider.status !== "published" || !games.some((g) => g.publicationStatus === "published"),
  });
}

export default async function ProviderPage({ params }: PageProps<"/providers/[slug]">) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();
  const games = await getSlotsByProvider(provider.id);

  const engineCounts = new Map<Mechanic, number>();
  games.forEach((g) => g.mechanics.forEach((m) => engineCounts.set(m, (engineCounts.get(m) ?? 0) + 1)));
  const engines = [...engineCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Estudios", path: "/providers" }, { name: provider.name, path: `/providers/${provider.slug}` }]} />
      <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-0">
        <div className="lg:pr-10">
          <p className="label text-accent">Ficha del estudio</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">{provider.name}</h1>
          <p className="mt-3 max-w-2xl text-[1.25rem] leading-snug text-fg-2">{provider.description}</p>
        </div>
        <aside className="border-t border-line-strong pt-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <dl className="ui space-y-3 text-sm">
            <div>
              <dt className="label text-fg-3">Web oficial</dt>
              <dd className="mt-1">
                {provider.officialWebsite.value ? (
                  <a href={provider.officialWebsite.value} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-line-strong underline-offset-4 hover:text-accent">
                    {new URL(provider.officialWebsite.value).hostname}
                  </a>
                ) : (
                  "—"
                )}
                <Mark status={provider.officialWebsite.status} />
              </dd>
            </div>
            <div>
              <dt className="label text-fg-3">Análisis disponibles</dt>
              <dd className="figure mt-1">{games.length}</dd>
            </div>
            <div>
              <dt className="label text-fg-3">Mecánicas más utilizadas</dt>
              <dd className="mt-1">{engines.slice(0, 4).map(([m, n]) => `${mechanicInfo[m].label} (${n})`).join(", ")}</dd>
            </div>
          </dl>
        </aside>
      </header>

      <section className="mt-12" aria-labelledby="games-h">
        <SectionHeading label="Juegos analizados" title={<span id="games-h">{provider.name} en nuestro catálogo</span>} />
        <ol className="mt-4">
          {games.map((s) => (
            <li key={s.id} className="border-b border-line">
              <Link href={`/slots/${s.slug}`} className="group grid grid-cols-[6rem_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <SlotCover artwork={s.artwork} name={s.name} aspect="4/3" size="sm" sizes="200px" />
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-accent">{s.name}</h2>
                  <p className="mt-0.5 leading-snug text-fg-2">{s.review.headline}</p>
                  <p className="mt-2 text-xs text-fg-3">{s.mechanics.map((m) => mechanicInfo[m].label).join(" · ")}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="psources-h">
        <SectionHeading label="Fuentes" />
        <h2 id="psources-h" className="sr-only">
          Fuentes
        </h2>
        <p className="mt-2 max-w-2xl leading-snug text-fg-2">
          Omitimos datos como el año de fundación, la sede y las licencias hasta documentarlos con fuentes del propio estudio.
        </p>
        <div className="mt-4">
          <SourcesTable sources={provider.sources} />
        </div>
      </section>
    </Container>
  );
}
