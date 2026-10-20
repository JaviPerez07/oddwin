import { getProviderMap, getProviders, getSlots } from "@/lib/data";
import { mechanicInfo } from "@/lib/mechanics";
import type { SearchItem } from "@/lib/search";

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [slots, providers] = await Promise.all([getSlots(), getProviders()]);
  const providerMap = getProviderMap();
  return [
    ...slots.map((s) => ({
      type: "slot" as const,
      title: s.name,
      subtitle: providerMap[s.providerId]?.name ?? "",
      href: `/slots/${s.slug}`,
      keywords: [s.shortDescription, ...s.mechanics.map((m) => mechanicInfo[m].label)].join(" "),
    })),
    ...providers.map((p) => ({
      type: "provider" as const,
      title: p.name,
      subtitle: `${slots.filter((s) => s.providerId === p.id).length} juegos analizados`,
      href: `/providers/${p.slug}`,
      keywords: p.description,
    })),
    { type: "page" as const, title: "Metodología", subtitle: "Cómo investigamos y verificamos", href: "/methodology", keywords: "rtp fuentes verificación" },
    { type: "page" as const, title: "Juego responsable", subtitle: "Ayuda y apoyo", href: "/responsible-gambling", keywords: "ayuda autoexclusión apoyo" },
  ];
}
