import type { Market } from "@/types/market";
import type { SourceRecord } from "@/types/source";
const RESEARCH_DATE = "2026-10-20";
const NOTE = "Referencia pendiente de comprobación editorial en la fuente original.";
function lead(id: string, url: string, label: string, fields: string[]): SourceRecord {
  return { id, url, label, fields, consultedAt: RESEARCH_DATE, result: "not_loaded", trust: "search_index", editorNote: NOTE };
}
/** La actividad editorial y comercial se dirige exclusivamente a España. */
export const markets: Market[] = [
  {
    code: "es",
    countryCode: "ES",
    countryName: "España",
    minimumLegalAge: { value: 18, status: "pending", sourceIds: ["es-law"] },
    regulatoryAuthority: {
      value: {
        name: "Dirección General de Ordenación del Juego (DGOJ)",
        englishName: "Dirección General de Ordenación del Juego",
        url: "https://www.ordenacionjuego.es",
      },
      status: "pending",
      sourceIds: ["es-reg"],
    },
    licenceRegisterUrl: {
      value: "https://www.ordenacionjuego.es/operadores-juego/operadores-licencia/operadores",
      status: "pending",
      sourceIds: ["es-register"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "El Real Decreto 958/2020 regula las comunicaciones comerciales del juego, con franjas para publicidad audiovisual y restricciones para dirigirse a personas autoexcluidas.",
      ],
      status: "pending",
      sourceIds: ["es-rd958"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: {
      name: "RGIAJ",
      url: "https://www.ordenacionjuego.es/participantes-juego/juego-seguro/rgiaj",
      description: "Registro General de Interdicciones de Acceso al Juego (autoexclusión).",
      status: "pending",
    },
    helpResources: [
      { name: "Jugar Bien (DGOJ)", url: "https://www.jugarbien.es", description: "Portal de juego seguro del regulador.", status: "pending" },
    ],
    regulatorySources: [
      lead("es-reg", "https://www.ordenacionjuego.es", "DGOJ — Inicio", ["regulatoryAuthority"]),
      lead("es-law", "https://www.boe.es/buscar/act.php?id=BOE-A-2011-9280", "Ley 13/2011, art. 6", ["minimumLegalAge"]),
      lead("es-register", "https://www.ordenacionjuego.es/operadores-juego/operadores-licencia/operadores", "Buscador de operadores con licencia", ["licenceRegisterUrl"]),
      lead("es-rd958", "https://www.boe.es/buscar/act.php?id=BOE-A-2020-13495", "Real Decreto 958/2020", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  }
];
