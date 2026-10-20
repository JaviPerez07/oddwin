import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OffersPanel } from "@/components/casinos/offers-panel";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { JsonLd } from "@/components/editorial/json-ld";
import { MechanicGlyph } from "@/components/editorial/mechanic-glyph";
import { SectionHeading } from "@/components/editorial/section-heading";
import { Mark, MarkKey } from "@/components/editorial/status";
import { AmbientArt } from "@/components/slots/ambient-art";
import { CoverCard } from "@/components/slots/cover-card";
import { DemoPanel } from "@/components/slots/demo-panel";
import { FactSheet } from "@/components/slots/fact-sheet";
import { SectionNav } from "@/components/slots/section-nav";
import { SlotCover } from "@/components/slots/slot-cover";
import { SlotPlate } from "@/components/slots/slot-plate";
import { SlotViewTracker } from "@/components/slots/slot-view-tracker";
import { SourcesTable } from "@/components/slots/sources-table";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { getProviderById, getProviderMap, getRelatedSlots, getSlotBySlug, getSlots } from "@/lib/data";
import { layoutText, paysText, rtpText, shortMaxWin, simpleText, volatilityText } from "@/lib/facts";
import { mechanicInfo, volatilityLevel } from "@/lib/mechanics";
import { getEligibleOffersByMarket } from "@/lib/offers";
import { articleJsonLd, pageMetadata } from "@/lib/seo";
import { cn, formatDate } from "@/lib/utils";
import { isSlotIndexable } from "@/lib/validation";
import type { FactStatus } from "@/types/source";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getSlots()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/slots/[slug]">) {
  const { slug } = await params;
  const slot = await getSlotBySlug(slug);
  if (!slot) return {};
  const provider = await getProviderById(slot.providerId);
  return pageMetadata({
    title: `${slot.name} — Análisis, mecánicas, versiones de RTP y demo`,
    description: `${slot.name} de ${provider?.name ?? "proveedor desconocido"}: ${slot.shortDescription}`,
    path: `/slots/${slot.slug}`,
    type: "article",
    noindex: !isSlotIndexable(slot),
    publishedTime: slot.publishedAt,
    modifiedTime: slot.updatedAt,
  });
}

export default async function SlotPage({ params }: PageProps<"/slots/[slug]">) {
  const { slug } = await params;
  const slot = await getSlotBySlug(slug);
  if (!slot) notFound();

  const [provider, related, offersByMarket] = await Promise.all([getProviderById(slot.providerId), getRelatedSlots(slot, 4), getEligibleOffersByMarket()]);
  const providerMap = getProviderMap();
  const indexable = isSlotIndexable(slot);
  const words = [slot.review.dek, ...slot.review.sections.flatMap((s) => s.paragraphs), slot.review.verdict].join(" ").split(/\s+/).length;
  const minutes = Math.max(2, Math.round(words / 220));
  const demoLive = slot.demo.kind === "verified" || slot.demo.kind === "official_site_only";
  const art = slot.artwork.licensed;

  const stats: [string, string | null, FactStatus][] = [
    ["RTP", rtpText(slot.rtp), slot.rtp.status],
    ["Volatilidad", volatilityText(slot.volatility), slot.volatility.status],
    ["Premio máximo", shortMaxWin(slot), slot.maxWin.status],
    ["Cuadrícula", layoutText(slot), slot.artwork.schematic.dimsStatus],
    ["Pagos", paysText(slot), slot.payStructure.status],
    ["Lanzamiento", simpleText(slot.releaseDate), slot.releaseDate.status],
  ];

  const nav = [
    { id: "analysis", label: "Análisis" },
    { id: "verdict", label: "Valoración" },
    { id: "specs", label: "Ficha técnica" },
    { id: "sources", label: "Fuentes" },
    ...(related.length ? [{ id: "similar", label: "Juegos similares" }] : []),
  ];

  return (
    <>
      <SlotViewTracker slug={slot.slug} />
      {indexable ? (
        <JsonLd data={articleJsonLd({ headline: `${slot.name} — Análisis`, description: slot.shortDescription, path: `/slots/${slot.slug}`, datePublished: slot.publishedAt, dateModified: slot.updatedAt })} />
      ) : null}

      {/* ── Hero ─────────────────────────────────────────────
           With licensed art: image leads, details beside it, ambient light
           from the image. Without it: the — Análisis leads, beside a functional
           "how it plays" panel — no stand-in picture. */}
      <section className="relative isolate overflow-hidden border-b border-line">
        {art ? <AmbientArt src={art.src} className="-z-10 scale-110 object-cover opacity-20 blur-3xl" /> : null}
        <Container className="pb-10 pt-5">
          <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Slots", path: "/slots" }, { name: slot.name, path: `/slots/${slot.slug}` }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
            <div className="min-w-0">
              {art ? (
                <figure className="mb-7">
                  <SlotCover artwork={slot.artwork} name={slot.name} provider={provider?.name} surface="hero" aspect="16/9" size="lg" priority zoomOnHover={false} sizes="(min-width: 1024px) 55vw, 100vw" className="rounded-2xl shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]" />
                  <figcaption className="mt-2 text-xs text-fg-3" data-testid="hero-credit">
                    {art.attribution ?? `© ${art.credit}`} · {art.isTestData ? "Datos ficticios — Solo para desarrollo." : "Material oficial utilizado con permiso."}
                  </figcaption>
                </figure>
              ) : null}
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {provider ? (
                  <Link href={`/providers/${provider.slug}`} className="font-semibold text-accent hover:underline">
                    {provider.name}
                  </Link>
                ) : null}
                <span className="text-fg-3">·</span>
                <span className="text-fg-3">Análisis de slot</span>
                <span className="text-fg-3">·</span>
                <span className="text-fg-3">{minutes} min de lectura</span>
              </p>
              <h1 className="headline mt-3 text-[2.4rem] sm:text-[3rem]">{slot.name}</h1>
              <p className="mt-2 text-xl text-fg">{slot.review.headline}.</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-fg-2">{slot.review.dek}</p>

              <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-3" data-testid="key-figures">
                {stats.map(([k, v, st]) => (
                  <div key={k} className="bg-surface px-3.5 py-3" data-status={st}>
                    <dt className="text-xs text-fg-3">{k}</dt>
                    <dd className="mt-1 text-[0.95rem]">
                      {st === "verified" && v ? (
                        <span className="figure text-fg">{v}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm text-fg-3">
                          <span aria-hidden className={cn("size-1.5 rounded-full", st === "conflicting" ? "border border-conflict" : st === "unsourced" ? "border border-fg-3" : "bg-pending")} />
                          {st === "conflicting" ? "Fuentes contradictorias" : st === "unsourced" ? "Sin fuente" : "Pendiente"}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {slot.volatility.status === "verified" && slot.volatility.value ? (
                <div className="mt-3 flex max-w-2xl items-center gap-3 text-xs text-fg-3">
                  <span>Volatilidad</span>
                  <span className="flex flex-1 gap-1" aria-hidden>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={cn("h-1.5 flex-1 rounded-full", n <= volatilityLevel[slot.volatility.value!] ? "bg-accent" : "bg-surface-3")} />
                    ))}
                  </span>
                  <span>{volatilityText(slot.volatility)}</span>
                </div>
              ) : null}
              {slot.publicationStatus !== "published" ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-3" data-testid="verification-banner">
                  Estamos contrastando las cifras principales con la documentación de {provider?.name ?? "el proveedor"}. Mientras tanto, las referencias y sus fuentes aparecen en la{" "}
                  <a href="#specs" className="text-accent hover:underline">
                    ficha técnica
                  </a>
                  y esta página permanece fuera de los resultados de búsqueda.
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {demoLive && "url" in slot.demo ? (
                  <Button asChild size="lg">
                    <a href={slot.demo.url} target="_blank" rel="noopener noreferrer">
                      <Play /> Jugar a la demo
                    </a>
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline">
                    <a href="#demo">
                      <Play /> Estado de la demo
                    </a>
                  </Button>
                )}
                <Button asChild size="lg" variant="secondary">
                  <a href="#analysis">
                    Leer el análisis <ArrowRight />
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-fg-3">
                Por el equipo de {site.name} · Actualizado {formatDate(slot.updatedAt)}
              </p>
            </div>

            <aside aria-labelledby="how-h" className="min-w-0 rounded-2xl bg-surface p-5 ring-1 ring-inset ring-line sm:p-6">
              <h2 id="how-h" className="text-sm font-semibold text-fg">
                Cómo se juega
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-fg-3">{slot.shortDescription}</p>
              <p className="mt-2 text-[11px] text-fg-3">Diagramas de {site.name} — explicativos, sin reproducir el arte del juego.</p>
              <ul className="mt-4 space-y-3">
                {slot.mechanics.map((m) => (
                  <li key={m}>
                    <Link href={`/slots?mechanic=${m}`} className="group flex items-start gap-3">
                      <MechanicGlyph mechanic={m} className="size-9 text-fg-2 transition-colors group-hover:text-accent" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold group-hover:text-accent">{mechanicInfo[m].label}</span>
                        <span className="block text-xs leading-snug text-fg-3">{mechanicInfo[m].blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </section>

      <SectionNav items={nav} />

      {/* ── Body ───────────────────────────────────────────── */}
      <Container className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <div className="min-w-0">
          <article id="analysis" className="max-w-[44rem] scroll-mt-32">
            {slot.review.sections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="mt-10 scroll-mt-32 first:mt-0">
                <h2 id={`${section.id}-h`} className="headline text-[1.6rem]">
                  {section.heading}
                </h2>
                <div className="prose-review mt-3">
                  {section.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                {section.aside ? (
                  <blockquote className="my-8 rounded-r-xl border-l-[3px] border-accent bg-surface py-4 pl-5 pr-4 text-lg font-medium leading-snug text-fg">
                    {section.aside}
                  </blockquote>
                ) : null}
              </section>
            ))}
          </article>

          <section id="verdict" aria-labelledby="verdict-h" className="mt-14 max-w-[44rem] scroll-mt-32">
            <h2 id="verdict-h" className="headline text-[1.6rem]">
              Valoración
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line">
                <p className="text-sm font-semibold text-verified">Puntos fuertes</p>
                <ul className="mt-2 space-y-2 text-[0.95rem] leading-snug text-fg-2">
                  {slot.review.strengths.map((s) => (
                    <li key={s} className="grid grid-cols-[1.1rem_minmax(0,1fr)]">
                      <span aria-hidden className="text-verified">+</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line">
                <p className="text-sm font-semibold text-conflict">Limitaciones</p>
                <ul className="mt-2 space-y-2 text-[0.95rem] leading-snug text-fg-2">
                  {slot.review.limitations.map((s) => (
                    <li key={s} className="grid grid-cols-[1.1rem_minmax(0,1fr)]">
                      <span aria-hidden className="text-conflict">−</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-fg">{slot.review.verdict}</p>
            <p className="mt-3 text-sm text-fg-3">
              Sin puntuación: no valoramos juegos hasta verificar sus cifras ni publicamos valoraciones de usuarios que no hemos recopilado.{" "}
              <Link href="/methodology" className="text-accent hover:underline">
                Cómo analizamos
              </Link>
            </p>
          </section>

          <section id="specs" aria-labelledby="specs-h" className="mt-16 scroll-mt-32">
            <SectionHeading label="Ficha técnica" title={<span id="specs-h">Datos y mecánicas</span>} />
            <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_17rem]">
              <FactSheet slot={slot} provider={provider} />
              <div>
                <figure className="max-w-[17rem] overflow-hidden rounded-xl ring-1 ring-line">
                  <SlotPlate artwork={slot.artwork} name={slot.name} aspect="square" detail="thumb" />
                  <figcaption className="bg-surface px-3 py-2 text-xs text-fg-3">
                    Diagrama explicativo de los rodillos (no es arte del juego): {layoutText(slot)}
                    <Mark status={slot.artwork.schematic.dimsStatus} />. Elaborado a partir de nuestras notas de investigación.
                  </figcaption>
                </figure>

              </div>
            </div>
          </section>

          <section id="sources" aria-labelledby="sources-h" className="mt-16 scroll-mt-32">
            <SectionHeading label="Fuentes" title={<span id="sources-h">De dónde procede cada cifra</span>} description="Cada referencia, para qué se utiliza y si un editor la ha confirmado en la página original." />
            <div className="mt-5">
              <SourcesTable sources={slot.sources} />
            </div>
            <MarkKey className="mt-4" />
          </section>
        </div>

        <aside aria-label="Demo y opciones de juego" className="min-w-0">
          <div className="space-y-4 lg:sticky lg:top-32">
            <div id="demo" className="scroll-mt-32">
              <DemoPanel demo={slot.demo} slotName={slot.name} slotSlug={slot.slug} />
            </div>
            <OffersPanel offersByMarket={offersByMarket} context={`slot:${slot.slug}`} />
          </div>
        </aside>
      </Container>

      {related.length ? (
        <Container as="section" className="mt-20">
          <div id="similar" className="scroll-mt-32">
            <SectionHeading label="Juegos similares" title="Mecánicas en común" href="/slots" hrefLabel="Todas las slots" />
          </div>
          <div className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <CoverCard key={s.id} slot={s} providerName={providerMap[s.providerId]?.name} />
            ))}
          </div>
        </Container>
      ) : null}
    </>
  );
}
