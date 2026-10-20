import { Suspense } from "react";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { CatalogExplorer, type CatalogItem } from "@/components/slots/catalog-explorer";
import { getProviderMap, getProviders, getSlots } from "@/lib/data";
import { layoutText, rtpText, shortMaxWin } from "@/lib/facts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "El catálogo — Todas las slots analizadas",
  description:
    "La revista de slots de Oddwin: juegos organizados por estudio, mecánica y volatilidad verificada. Cada cifra indica su estado de comprobación.",
  path: "/slots",
});

export default async function SlotsPage() {
  const [slots, providers] = await Promise.all([getSlots(), getProviders()]);
  const providerMap = getProviderMap();

  const items: CatalogItem[] = slots.map((s) => ({
    slug: s.slug,
    name: s.name,
    headline: s.review.headline,
    providerId: s.providerId,
    providerName: providerMap[s.providerId]?.name ?? "",
    shortDescription: s.shortDescription,
    mechanics: s.mechanics,
    // Only verified figures reach the catalogue (cards, sort, filters).
    layout: s.artwork.schematic.dimsStatus === "verified" ? layoutText(s) : null,
    volatility: s.volatility.status === "verified" ? s.volatility.value : null,
    rtp: s.rtp.status === "verified" ? (s.rtp.value?.[0]?.value ?? null) : null,
    rtpText: s.rtp.status === "verified" ? rtpText(s.rtp) : null,
    maxWinText: s.maxWin.status === "verified" ? shortMaxWin(s) : null,
    updatedAt: s.updatedAt,
    artwork: s.artwork,
    pending: s.publicationStatus !== "published",
  }));

  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Slots", path: "/slots" }]} />
      <header className="mb-6 mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
        <div>
          <p className="label text-accent">Catálogo</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Todas las slots</h1>
        </div>
        <p className="text-fg-2">
          {slots.length} juegos analizados por su diseño y funcionamiento. Filtra por estudio, mecánica o perfil de riesgo.
        </p>
      </header>
      <Suspense fallback={<div className="h-40 animate-pulse bg-surface" />}>
        <CatalogExplorer items={items} providers={providers.map((p) => ({ id: p.id, name: p.name }))} />
      </Suspense>
    </Container>
  );
}
