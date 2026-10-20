import type { Provider } from "@/types/provider";
import type { SourceRecord } from "@/types/source";

const RESEARCH_DATE = "2026-10-20";

function siteLead(id: string, url: string, label: string): SourceRecord {
  return {
    id,
    url,
    label,
    fields: ["officialWebsite"],
    consultedAt: RESEARCH_DATE,
    result: "not_loaded",
    trust: "search_index",
    editorNote:
      "Dominio localizado en un buscador limitado a la web del proveedor. No se pudo consultar la página original desde nuestro entorno de investigación.",
  };
}

/**
 * Provider records. Descriptions are written by us and limited to what the
 * catalogue shows; corporate facts (founding year, HQ, licences) are left out
 * until they are sourced from the provider's own pages.
 */
export const providers: Provider[] = [
  {
    id: "pragmatic-play",
    slug: "pragmatic-play",
    name: "Pragmatic Play",
    officialWebsite: { value: "https://www.pragmaticplay.com/en/", status: "pending", sourceIds: ["pp-site"] },
    logo: null,
    description:
      "Un estudio de gran producción que desarrolla sagas a partir de fórmulas reconocibles, como las cascadas de seis por cinco y la recogida de valores con pescadores.",
    sources: [siteLead("pp-site", "https://www.pragmaticplay.com/en/", "Pragmatic Play — Web oficial")],
    status: "pending_review",
  },
  {
    id: "playngo",
    slug: "playngo",
    name: "Play'n GO",
    officialWebsite: { value: "https://www.playngo.com", status: "pending", sourceIds: ["png-site"] },
    logo: null,
    description:
      "Conocido por sus sagas de personajes y la variedad de tableros, desde la aventura egipcia de diez líneas hasta los grupos de siete por siete.",
    sources: [siteLead("png-site", "https://www.playngo.com", "Play'n GO — Web oficial")],
    status: "pending_review",
  },
  {
    id: "netent",
    slug: "netent",
    name: "NetEnt",
    officialWebsite: { value: "https://netent.com", status: "pending", sourceIds: ["netent-site"] },
    logo: null,
    description:
      "Uno de los estudios que definieron la slot moderna, con juegos que abarcan desde premios pequeños frecuentes hasta bonus de giros gratis de gran volatilidad.",
    sources: [siteLead("netent-site", "https://netent.com", "NetEnt — Web oficial")],
    status: "pending_review",
  },
  {
    id: "big-time-gaming",
    slug: "big-time-gaming",
    name: "Big Time Gaming",
    officialWebsite: { value: "https://www.bigtimegaming.com", status: "pending", sourceIds: ["btg-site"] },
    logo: null,
    description:
      "El estudio creador de Megaways, donde la cantidad de símbolos por rodillo y las formas de ganar cambian en cada giro.",
    sources: [siteLead("btg-site", "https://www.bigtimegaming.com", "Big Time Gaming — Web oficial")],
    status: "pending_review",
  },
  {
    id: "hacksaw-gaming",
    slug: "hacksaw-gaming",
    name: "Hacksaw Gaming",
    officialWebsite: { value: "https://www.hacksawgaming.com", status: "pending", sourceIds: ["hacksaw-site"] },
    logo: null,
    description:
      "Un estudio con un estilo ilustrado reconocible y varios bonus de perfiles muy distintos dentro de cada juego.",
    sources: [siteLead("hacksaw-site", "https://www.hacksawgaming.com", "Hacksaw Gaming — Web oficial")],
    status: "pending_review",
  },
  {
    id: "relax-gaming",
    slug: "relax-gaming",
    name: "Relax Gaming",
    officialWebsite: { value: "https://www.relax-gaming.com", status: "pending", sourceIds: ["relax-site"] },
    logo: null,
    description:
      "Proveedor y agregador cuyos juegos popularizaron los bonus de recogida y respins con personajes que modifican otros símbolos.",
    sources: [siteLead("relax-site", "https://www.relax-gaming.com", "Relax Gaming — Web oficial")],
    status: "pending_review",
  },
];
