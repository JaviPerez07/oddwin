import type { HelpResource, Market } from "@/types/market";
import type { SourceRecord } from "@/types/source";

const RESEARCH_DATE = "2026-10-20";
const NOTE =
  "Extracto localizado en un buscador limitado al dominio oficial. No se pudo consultar la página original; debe comprobarse antes de darlo por verificado.";

function lead(id: string, url: string, label: string, fields: string[]): SourceRecord {
  return { id, url, label, fields, consultedAt: RESEARCH_DATE, result: "not_loaded", trust: "search_index", editorNote: NOTE };
}

/** Non-commercial help available regardless of market. */
export const internationalHelp: HelpResource[] = [
  {
    name: "Gambling Therapy",
    url: "https://gamblingtherapy.org",
    description: "Apoyo gratuito en línea de la organización Gordon Moody, disponible en varios idiomas.",
    status: "pending",
  },
  {
    name: "Gamblers Anonymous",
    url: "https://gamblersanonymous.org",
    description: "Comunidad internacional con reuniones presenciales y telefónicas.",
    status: "pending",
  },
  {
    name: "GamCare",
    url: "https://www.gamcare.org.uk",
    description: "Organización británica que gestiona un servicio nacional de ayuda sobre el juego.",
    status: "pending",
  },
];

/**
 * Market records. Regulatory facts below are leads, not verified facts: every
 * one is marked "pending" and carries its official-domain URL so an editor can
 * confirm it. allowedOperators stays empty until a licence is checked against
 * the regulator's own register.
 */
export const markets: Market[] = [
  {
    code: "gb",
    countryCode: "GB",
    countryName: "Gran Bretaña",
    minimumLegalAge: { value: 18, status: "pending", sourceIds: ["gb-age"] },
    regulatoryAuthority: {
      value: { name: "Gambling Commission", url: "https://www.gamblingcommission.gov.uk" },
      status: "pending",
      sourceIds: ["gb-reg"],
    },
    licenceRegisterUrl: {
      value: "https://www.gamblingcommission.gov.uk/public-register/businesses",
      status: "pending",
      sourceIds: ["gb-register"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "Los titulares de licencias deben cumplir los códigos publicitarios CAP y BCAP y responden por las actuaciones de sus afiliados.",
        "Existen límites de apuesta por giro en slots en línea, con un límite inferior para adultos más jóvenes.",
      ],
      status: "pending",
      sourceIds: ["gb-ads", "gb-affiliates", "gb-stakes"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: {
      name: "GAMSTOP",
      url: "https://www.gamstop.co.uk",
      description: "Sistema nacional gratuito de autoexclusión del juego en línea.",
      status: "pending",
    },
    helpResources: [
      { name: "GamCare — National Gambling Helpline", url: "https://www.gamcare.org.uk", description: "Apoyo gratuito y confidencial.", status: "pending" },
    ],
    regulatorySources: [
      lead("gb-reg", "https://www.gamblingcommission.gov.uk", "Gambling Commission — Inicio", ["regulatoryAuthority"]),
      lead("gb-age", "https://www.gamblingcommission.gov.uk/public-and-players/guide/gambling-and-young-people", "Juego y menores", ["minimumLegalAge"]),
      lead("gb-register", "https://www.gamblingcommission.gov.uk/public-register/businesses", "Registro público de empresas", ["licenceRegisterUrl"]),
      lead("gb-ads", "https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/5-1-6-compliance-with-advertising-codes", "LCCP 5.1.6 — Cumplimiento de códigos publicitarios", ["promotionalRules"]),
      lead("gb-affiliates", "https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/affiliates-or-third-parties", "Afiliados o terceros", ["promotionalRules"]),
      lead("gb-stakes", "https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/online-slots-stake-limit-guidance", "Guía de límites de apuesta en slots en línea", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
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
      value: "https://www.ordenacionjuego.es/en/operadores-juego/operadores-licencia/operadores",
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
      url: "https://www.ordenacionjuego.es/en/participantes-juego/juego-seguro/rgiaj",
      description: "Registro General de Interdicciones de Acceso al Juego (autoexclusión).",
      status: "pending",
    },
    helpResources: [
      { name: "JugarBIEN", url: "https://www.jugarbien.es", description: "Portal de juego seguro del regulador.", status: "pending" },
    ],
    regulatorySources: [
      lead("es-reg", "https://www.ordenacionjuego.es", "DGOJ — Inicio", ["regulatoryAuthority"]),
      lead("es-law", "https://www.boe.es/buscar/act.php?id=BOE-A-2011-9280", "Ley 13/2011, art. 6", ["minimumLegalAge"]),
      lead("es-register", "https://www.ordenacionjuego.es/en/operadores-juego/operadores-licencia/operadores", "Buscador de operadores con licencia", ["licenceRegisterUrl"]),
      lead("es-rd958", "https://www.boe.es/buscar/act.php?id=BOE-A-2020-13495", "Real Decreto 958/2020", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
  {
    code: "se",
    countryCode: "SE",
    countryName: "Suecia",
    minimumLegalAge: { value: 18, status: "pending", sourceIds: ["se-age"] },
    regulatoryAuthority: {
      value: { name: "Spelinspektionen", englishName: "Autoridad Sueca del Juego", url: "https://www.spelinspektionen.se" },
      status: "pending",
      sourceIds: ["se-reg"],
    },
    licenceRegisterUrl: {
      value: "https://www.spelinspektionen.se/licens-o-tillstand/licensregister/",
      status: "pending",
      sourceIds: ["se-register"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "La publicidad debe ser moderada y no puede dirigirse a menores ni a personas autoexcluidas.",
        "Los bonos solo pueden ofrecerse en la primera sesión del jugador con el titular de la licencia.",
      ],
      status: "pending",
      sourceIds: ["se-bonus"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: {
      name: "Spelpaus",
      url: "https://www.spelpaus.se/en",
      description: "Registro nacional de autoexclusión gestionado por el regulador.",
      status: "pending",
    },
    helpResources: [
      { name: "Stödlinjen", url: "https://stodlinjen.se/en", description: "Servicio nacional de apoyo ante problemas con el juego.", status: "pending" },
    ],
    regulatorySources: [
      lead("se-reg", "https://www.spelinspektionen.se", "Spelinspektionen — Inicio", ["regulatoryAuthority"]),
      lead("se-age", "https://www.spelinspektionen.se/spelare/spelform/onlinekasino/", "Casino en línea — Información para jugadores", ["minimumLegalAge"]),
      lead("se-register", "https://www.spelinspektionen.se/licens-o-tillstand/licensregister/", "Registro de licencias", ["licenceRegisterUrl"]),
      lead("se-bonus", "https://www.spelinspektionen.se/nyhetsarkiv/polar-limited-far-anmarkning-for-otillatna-bonuserbjudanden/", "Resolución sobre ofertas de bonos", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
  {
    code: "de",
    countryCode: "DE",
    countryName: "Alemania",
    minimumLegalAge: {
      value: 18,
      status: "pending",
      sourceIds: ["de-treaty"],
      note: "El tratado excluye a los menores; el texto legal exacto está pendiente de comprobación.",
    },
    regulatoryAuthority: {
      value: {
        name: "Gemeinsame Glücksspielbehörde der Länder (GGL)",
        englishName: "Autoridad Conjunta del Juego de los Estados Federados Alemanes",
        url: "https://www.gluecksspiel-behoerde.de",
      },
      status: "pending",
      sourceIds: ["de-reg"],
    },
    licenceRegisterUrl: {
      value: "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist",
      status: "pending",
      sourceIds: ["de-whitelist"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "La GGL licencia slots virtuales y póquer en línea. Los juegos de mesa en línea corresponden a cada estado federado.",
        "El tratado estatal restringe la publicidad de slots virtuales en línea y radiodifusión durante el día y prohíbe dirigirla a menores.",
      ],
      status: "pending",
      sourceIds: ["de-faq", "de-treaty"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: {
      name: "OASIS",
      url: "https://rp-darmstadt.hessen.de/sicherheit-und-kommunales/gluecksspiel/spielersperrsystem-oasis/spielerinnen-und-spieler",
      description: "Sistema nacional de exclusión de jugadores.",
      status: "pending",
    },
    helpResources: [
      { name: "Check dein Spiel", url: "https://www.check-dein-spiel.de", description: "Información y servicio federal de ayuda.", status: "pending" },
    ],
    regulatorySources: [
      lead("de-reg", "https://www.gluecksspiel-behoerde.de", "GGL — Inicio", ["regulatoryAuthority"]),
      lead("de-treaty", "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/die-spielerschutzmassnahmen-des-gluestv21-im-ueberblick", "Protección del jugador según GlüStV 2021", ["minimumLegalAge", "promotionalRules"]),
      lead("de-faq", "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/informationen-fuer-spielende-faqs/faq-was-sind-legale-online-casinos-in-deutschland", "Preguntas frecuentes — Casinos legales en línea en Alemania", ["promotionalRules"]),
      lead("de-whitelist", "https://www.gluecksspiel-behoerde.de/de/fuer-spielende/uebersicht-erlaubter-anbieter-whitelist", "Lista de proveedores autorizados", ["licenceRegisterUrl"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
  {
    code: "nl",
    countryCode: "NL",
    countryName: "Países Bajos",
    minimumLegalAge: { value: 18, status: "pending", sourceIds: ["nl-age"] },
    regulatoryAuthority: {
      value: { name: "Kansspelautoriteit (Ksa)", englishName: "Autoridad del Juego de los Países Bajos", url: "https://kansspelautoriteit.nl" },
      status: "pending",
      sourceIds: ["nl-reg"],
    },
    licenceRegisterUrl: {
      value: "https://kansspelautoriteit.nl/register-licensees",
      status: "pending",
      sourceIds: ["nl-register"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "La publicidad no segmentada del juego en línea está prohibida desde julio de 2023. Los canales restantes están sujetos a condiciones.",
        "La publicidad no puede dirigirse a personas de entre 18 y 24 años.",
      ],
      status: "pending",
      sourceIds: ["nl-ads", "nl-rules"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: {
      name: "Cruks",
      url: "https://kansspelautoriteit.nl/voor-spelers",
      description: "Registro central de exclusión (página informativa del regulador).",
      status: "pending",
    },
    helpResources: [],
    regulatorySources: [
      lead("nl-reg", "https://kansspelautoriteit.nl", "Ksa — Inicio", ["regulatoryAuthority"]),
      lead("nl-age", "https://kansspelautoriteit.nl/extra-eisen-verslavingspreventie", "Requisitos de prevención de adicciones", ["minimumLegalAge"]),
      lead("nl-register", "https://kansspelautoriteit.nl/register-licensees", "Registro de titulares de licencia", ["licenceRegisterUrl"]),
      lead("nl-ads", "https://kansspelautoriteit.nl/nieuws/2023/juli/verbod-ongerichte-reclame-kansspelen/", "Prohibición de publicidad no segmentada", ["promotionalRules"]),
      lead("nl-rules", "https://kansspelautoriteit.nl/belangrijkste-regels-voor-kansspelreclame", "Normas principales de publicidad del juego", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
  {
    code: "ca-on",
    countryCode: "CA-ON",
    countryName: "Ontario, Canadá",
    minimumLegalAge: { value: 19, status: "pending", sourceIds: ["on-age"] },
    regulatoryAuthority: {
      value: { name: "Alcohol and Gaming Commission of Ontario (AGCO)", url: "https://www.agco.ca" },
      status: "pending",
      sourceIds: ["on-reg"],
    },
    licenceRegisterUrl: {
      value: "https://www.agco.ca/en/lottery-and-gaming/list-registered-internet-gaming-operators",
      status: "pending",
      sourceIds: ["on-register"],
    },
    allowedOperators: [],
    promotionalRules: {
      value: [
        "La publicidad de incentivos, bonos o créditos está prohibida fuera de la web del operador y del marketing directo consentido, lo que limita el contenido de los afiliados.",
      ],
      status: "pending",
      sourceIds: ["on-standard"],
    },
    allowedPromotionalMethods: [],
    selfExclusion: null,
    helpResources: [
      { name: "ConnexOntario", url: "https://www.connexontario.ca", description: "Servicio de ayuda disponible las 24 horas.", status: "pending" },
      { name: "PlaySmart", url: "https://www.playsmart.ca", description: "Información sobre juego responsable.", status: "pending" },
    ],
    regulatorySources: [
      lead("on-reg", "https://www.agco.ca", "AGCO — Inicio", ["regulatoryAuthority"]),
      lead("on-age", "https://igamingontario.ca/en/player/player-faqs", "iGaming Ontario — Preguntas de los jugadores", ["minimumLegalAge"]),
      lead("on-register", "https://www.agco.ca/en/lottery-and-gaming/list-registered-internet-gaming-operators", "Operadores de juego en línea registrados", ["licenceRegisterUrl"]),
      lead("on-standard", "https://www.agco.ca/en/book/export/html/245361", "Normas del registro para el juego en línea", ["promotionalRules"]),
    ],
    lastVerifiedAt: null,
    status: "pending_review",
  },
];
