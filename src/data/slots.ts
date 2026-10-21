import type { Fact, FactStatus, SourceRecord } from "@/types/source";
import type { RtpVersion, Slot } from "@/types/slot";

/*
 * Slot catalogue.
 *
 * IMPORTANT — verification state as of RESEARCH_DATE:
 * Our research environment could not load provider pages, so no figure below
 * is verified. Each value is a lead with its basis recorded:
 *   - "search_index": URL + snippet returned by a search restricted to the
 *     provider's official domain (page not opened);
 *   - "preliminary": the editor's pre-publication notes, not yet tied to a
 *     document.
 * The UI renders every such value with a visible "pending" marker, pages stay
 * noindex, and lib/validation.ts refuses to let a slot be "published" until
 * its core facts are backed by a confirmed source.
 */

const RESEARCH_DATE = "2026-10-20";

function officialPage(id: string, url: string, label: string, fields: string[], editorNote?: string): SourceRecord {
  return {
    id,
    url,
    label,
    fields,
    consultedAt: RESEARCH_DATE,
    result: "not_loaded",
    trust: "search_index",
    editorNote:
      editorNote ??
      "Página oficial localizada mediante un buscador limitado al dominio del proveedor. Pendiente de consulta y lectura editorial.",
  };
}

function editorNotes(id: string, fields: string[], editorNote: string): SourceRecord {
  return { id, url: null, label: "Notas preliminares del editor", fields, consultedAt: null, result: "not_loaded", trust: "preliminary", editorNote };
}

function lead<T>(value: T, sourceIds: string[], note?: string, status: FactStatus = "pending"): Fact<T> {
  return { value, status, sourceIds, note };
}

function unsourced<T>(note?: string): Fact<T> {
  return { value: null, status: "unsourced", sourceIds: [], note };
}

function rtp(...versions: [number, string][]): RtpVersion[] {
  return versions.map(([value, label]) => ({ value, label }));
}

const PENDING_DEMO = (lead: string | null) =>
  ({
    kind: "pending",
    lead,
    note: "La página del proveedor parece ofrecer una demo gratuita, pero aún no hemos confirmado el destino ni sus condiciones.",
  }) as const;

export const slots: Slot[] = [
  {
    id: "gates-of-olympus",
    slug: "gates-of-olympus",
    name: "Gates of Olympus",
    providerId: "pragmatic-play",
    shortDescription:
      "Una cuadrícula de seis por cinco con pagos en cualquier posición. Las esferas multiplicadoras determinan el valor final de cada cascada.",
    featured: true,
    artwork: {
      licensed: null,
      schematic: { reels: 6, rows: 5, pattern: "scatter", dimsStatus: "pending" },
      palette: { base: "#5b3aa8", deep: "#1b1240", glow: "#9c7bff", accent: "#ffcf5a" },
    },
    releaseDate: lead("Febrero de 2021", ["goo-notes"]),
    rtp: lead(rtp([96.5, "Versión predeterminada"]), ["goo-page"], "Existen referencias a otras configuraciones elegibles por el operador; aún no se han enumerado."),
    volatility: lead("high", ["goo-notes"], "El extracto del buscador indica que la página oficial no especifica la volatilidad."),
    maxWin: lead("5.000× la apuesta", ["goo-notes"], "Según el extracto, no aparece en la página comercial. Requiere consultar la tabla de pagos del juego."),
    grid: lead("6 rodillos × 5 filas", ["goo-page"]),
    payStructure: lead("Pagos en cualquier posición — 8 o más símbolos iguales en la cuadrícula", ["goo-page"]),
    freeSpins: lead("4 o más scatters conceden 15 giros gratis", ["goo-page"]),
    jackpot: unsourced("Ninguna referencia describe un bote."),
    mechanics: ["pay-anywhere", "tumble", "multipliers", "free-spins", "bonus-buy"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.pragmaticplay.com/en/games/gates-of-olympus/"),
    sources: [
      officialPage("goo-page", "https://www.pragmaticplay.com/en/games/gates-of-olympus/", "Pragmatic Play — Gates of Olympus", ["rtp", "grid", "payStructure", "freeSpins", "demo"]),
      officialPage("goo-news", "https://www.pragmaticplay.com/en/news/pragmatic-play-aims-for-the-heavens-in-gates-of-olympus/", "Pragmatic Play — Anuncio de lanzamiento", ["releaseDate"]),
      editorNotes("goo-notes", ["releaseDate", "volatility", "maxWin"], "Cifras citadas habitualmente. Deben verificarse en la información del juego antes de publicar."),
    ],
    review: {
      headline: "Las esferas deciden el resultado",
      dek: "Sin líneas de pago: una cuadrícula que se renueva hasta agotar las coincidencias y unas esferas que determinan el valor final de la secuencia.",
      sections: [
        {
          id: "overview",
          heading: "Cómo funciona la cuadrícula",
          paragraphs: [
            "Gates of Olympus prescinde de las líneas. Cada giro cuenta símbolos iguales en una cuadrícula de seis por cinco. Si hay suficientes, pagan, desaparecen y dejan caer otros desde arriba. La cadena sigue mientras se formen nuevas coincidencias premiadas.",
            "Gran parte del resultado se decide en las siguientes caídas. Una pantalla inicial sin grandes coincidencias puede cambiar, y una prometedora puede detenerse si los símbolos nuevos no encajan.",
          ],
        },
        {
          id: "multipliers",
          heading: "Las esferas deciden el resultado",
          paragraphs: [
            "Los multiplicadores pueden aparecer en cualquier caída. No pagan por sí solos: sus valores se suman y se aplican al total de la secuencia cuando termina. Una cascada larga sin esfera no recibe ese multiplicador.",
            "Por eso los resultados del juego base están tan desequilibrados. Muchos giros devuelven pequeñas fracciones de la apuesta; los más relevantes suelen necesitar una cascada y una esfera a la vez. El máximo publicado es un límite del modelo matemático, no una expectativa para la sesión.",
          ],
          aside: "Una cadena de cascadas sin esfera multiplicadora suele devolver solo parte de la apuesta.",
        },
        {
          id: "free-spins",
          heading: "Giros gratis: el multiplicador se acumula",
          paragraphs: [
            "En el bonus, los multiplicadores de las secuencias premiadas se añaden a un total que persiste durante la función. Las esferas tempranas influyen más porque afectan a las siguientes secuencias que cumplan las condiciones.",
            "Los scatters pueden prolongar la función. El diseño concentra el potencial al final, pero muchas rondas terminan sin acumular un multiplicador relevante.",
          ],
        },
        {
          id: "who",
          heading: "Volatilidad y expectativas",
          paragraphs: [
            "El diseño apunta a una varianza alta: retornos pequeños frecuentes y resultados importantes concentrados en combinaciones raras de cascadas y multiplicadores. El RTP describe una media sobre un número enorme de giros, sin predecir una sesión corta.",
            "Una versión de RTP reducido cambia el retorno a largo plazo sin alterar lo que ves en pantalla. Comprueba la información del juego antes de jugar.",
          ],
        },
      ],
      strengths: [
        "Reglas claras: cantidades y multiplicadores fáciles de leer al conocer su ubicación.",
        "El multiplicador acumulado da progresión al bonus de giros gratis.",
        "Las cascadas encadenan resultados dentro del mismo giro.",
      ],
      limitations: [
        "Los giros del juego base sin multiplicador suelen tener poca relevancia.",
        "Los resultados se concentran en sucesos raros; son normales las rachas largas sin premios relevantes.",
        "Puede haber varias versiones de RTP según el operador.",
      ],
      verdict:
        "Una expresión clara de las cascadas con pagos en cualquier posición. Su diseño concentra los resultados más relevantes en sucesos poco frecuentes y en el bonus.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "sweet-bonanza",
    slug: "sweet-bonanza",
    name: "Sweet Bonanza",
    providerId: "pragmatic-play",
    shortDescription:
      "El predecesor de estética dulce de la fórmula de cascadas y multiplicadores, con bombas que solo aparecen durante los giros gratis.",
    artwork: {
      licensed: null,
      schematic: { reels: 6, rows: 5, pattern: "scatter", dimsStatus: "pending" },
      palette: { base: "#e2508f", deep: "#3a1446", glow: "#ff9fd0", accent: "#7fe0ff" },
    },
    releaseDate: lead("Junio de 2019", ["sb-notes"]),
    rtp: lead(rtp([96.48, "Versión predeterminada"]), ["sb-page"]),
    volatility: unsourced("No consta en las referencias disponibles."),
    maxWin: lead("21.100× la apuesta", ["sb-notes"]),
    grid: lead("6 rodillos × 5 filas", ["sb-notes"]),
    payStructure: lead("Pagos en cualquier posición — 8 o más símbolos iguales", ["sb-notes"]),
    freeSpins: lead("Giros gratis activados por scatters con bombas multiplicadoras", ["sb-page"]),
    jackpot: unsourced(),
    mechanics: ["pay-anywhere", "tumble", "multipliers", "free-spins", "bonus-buy"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/"),
    sources: [
      officialPage("sb-page", "https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/", "Pragmatic Play — Sweet Bonanza", ["rtp", "freeSpins", "demo"]),
      editorNotes("sb-notes", ["releaseDate", "maxWin", "grid", "payStructure"], "Cifras citadas habitualmente, pendientes de confirmar en la web del proveedor o la tabla de pagos."),
    ],
    review: {
      headline: "El origen de la fórmula de cascadas",
      dek: "Comparte cuadrícula y cascadas con su sucesor mitológico, pero reserva los multiplicadores al bonus. Esta diferencia cambia el ritmo más que su estética.",
      sections: [
        {
          id: "base-game",
          heading: "Un juego base sin grandes efectos",
          paragraphs: [
            "Sweet Bonanza cuenta símbolos en una cuadrícula de seis por cinco y elimina los premiados para dejar caer otros nuevos. El juego base se limita a ese sistema, sin multiplicadores, por lo que su ritmo es más contenido que el de sucesores con la misma mecánica.",
            "Esto también facilita la lectura del juego base: lo que ves es lo que paga.",
          ],
        },
        {
          id: "bombs",
          heading: "Giros gratis y bombas multiplicadoras",
          paragraphs: [
            "Durante los giros gratis pueden aparecer bombas que multiplican el resultado de la secuencia de cascadas. No pagan por sí solas. Nuestra referencia no describe un acumulador entre giros, a diferencia de Gates of Olympus. Lo confirmaremos antes de publicar porque cambia el funcionamiento del bonus.",
            "En la práctica, cada giro es una oportunidad independiente de juntar una cascada larga y una bomba. Esto genera resultados más irregulares que un sistema acumulativo.",
          ],
          aside: "La estética es dulce. Las matemáticas, no tanto.",
        },
        {
          id: "lineage",
          heading: "Por qué sigue siendo relevante",
          paragraphs: [
            "Gran parte del catálogo actual de pagos en cualquier posición parte de este diseño. Compararlo con sus sucesores ayuda a separar el efecto de las cascadas del multiplicador del juego base.",
          ],
        },
      ],
      strengths: [
        "Fácil de entender desde el primer giro.",
        "Los giros gratis se distinguen claramente del juego base.",
        "Una referencia útil para entender los pagos en cualquier posición.",
      ],
      limitations: [
        "El juego base puede resultar monótono sin multiplicadores.",
        "Volatilidad sin fuente verificada: no la caracterizamos hasta documentarla.",
      ],
      verdict:
        "Un diseño de referencia basado en la sencillez. Útil para entender cómo funcionan sus variaciones posteriores.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "big-bass-bonanza",
    slug: "big-bass-bonanza",
    name: "Big Bass Bonanza",
    providerId: "pragmatic-play",
    shortDescription:
      "Una slot de pesca de diez líneas donde los peces tienen valor monetario y el pescador comodín los recoge en los giros gratis.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 3, pattern: "collect", dimsStatus: "pending" },
      palette: { base: "#1d8aa0", deep: "#0a2a36", glow: "#5fd6e6", accent: "#ff9a3d" },
    },
    releaseDate: unsourced("Fecha de lanzamiento original sin documentar; varias secuelas comparten el nombre."),
    rtp: lead(rtp([96.71, "Versión predeterminada"]), ["bbb-page"]),
    volatility: lead("high", ["bbb-notes"], "Según el extracto del buscador, la página oficial no indica volatilidad."),
    maxWin: lead("2.100× la apuesta", ["bbb-notes"], "El extracto menciona peces de hasta 2.000×, un valor de símbolo que no equivale al premio máximo."),
    grid: lead("5 rodillos × 3 filas", ["bbb-notes"]),
    payStructure: lead("10 líneas de pago fijas", ["bbb-notes"]),
    freeSpins: lead("Giros gratis activados por scatters con pescadores que recogen el valor de los peces", ["bbb-notes"]),
    jackpot: unsourced(),
    mechanics: ["paylines", "money-collect", "free-spins", "multipliers"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.pragmaticplay.com/en/games/big-bass-bonanza/"),
    sources: [
      officialPage("bbb-page", "https://www.pragmaticplay.com/en/games/big-bass-bonanza/", "Pragmatic Play — Big Bass Bonanza", ["rtp", "demo"], "Varias secuelas comparten el nombre; esta URL corresponde al original."),
      editorNotes("bbb-notes", ["volatility", "maxWin", "grid", "payStructure", "freeSpins"], "Commonly reported figures pending confirmation."),
    ],
    review: {
      headline: "Peces, un pescador y mucha espera",
      dek: "La fórmula que inició una saga: peces con valor monetario, un pescador que los recoge y un bonus cuyo resultado depende de que aparezcan juntos.",
      sections: [
        {
          id: "collect",
          heading: "Dinero en los rodillos, todavía no en tu saldo",
          paragraphs: [
            "Los peces muestran valores monetarios. En el juego base actúan como símbolos normales; en los giros gratis, un pescador comodín recoge el valor de todos los peces presentes en ese giro.",
            "El bonus depende de la coincidencia: necesitas peces y pescadores juntos, varias veces. Una ronda llena de peces valiosos sin pescador no cobra esos valores.",
          ],
        },
        {
          id: "progression",
          heading: "Reactivaciones y progresión",
          paragraphs: [
            "Las referencias indican que los pescadores recogidos permiten avanzar, añadir giros y aumentar el multiplicador de las siguientes recogidas. Si se confirma, esa progresión concentraría el valor al final del bonus.",
            "Documentaremos la progresión exacta tras consultar la tabla de pagos. Hasta entonces, los detalles son provisionales.",
          ],
          aside: "Una pantalla llena de peces sin pescador es una imagen, no un premio.",
        },
        {
          id: "lines",
          heading: "Diez líneas fáciles de seguir",
          paragraphs: [
            "En una cuadrícula de cinco por tres y diez líneas, los premios del juego base son fáciles de seguir y suelen ser modestos. El diseño concentra la mayor parte de la volatilidad en el bonus.",
          ],
        },
      ],
      strengths: [
        "El valor visible de los peces facilita seguir el bonus.",
        "Juego base sencillo y sin reglas ocultas.",
        "La progresión da una estructura creciente a los giros gratis.",
      ],
      limitations: [
        "El bonus depende mucho de cuándo aparecen los pescadores.",
        "Varias secuelas comparten el nombre. Comprueba que consultas el juego correcto.",
      ],
      verdict: "Una mecánica de recogida clara que ayuda a entender el éxito de la saga. Conviene ajustar las expectativas a la frecuencia real de resultados relevantes.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "book-of-dead",
    slug: "book-of-dead",
    name: "Book of Dead",
    providerId: "playngo",
    shortDescription:
      "El clásico de diez líneas con un símbolo elegido al azar que se expande hasta ocupar rodillos enteros en los giros gratis.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 3, pattern: "expand", focus: [1, 2, 4], dimsStatus: "pending" },
      palette: { base: "#a8742a", deep: "#2a1a0c", glow: "#f2c46b", accent: "#5ad1c0" },
    },
    releaseDate: lead("Enero de 2016", ["bod-notes"]),
    rtp: lead(rtp([96.21, "Versión más alta"]), ["bod-notes"], "Play'n GO suele ofrecer varias configuraciones de RTP. Aún no enumeramos las versiones inferiores."),
    volatility: lead("high", ["bod-notes"]),
    maxWin: lead("5.000× la apuesta", ["bod-blog"]),
    grid: lead("5 rodillos × 3 filas", ["bod-notes"]),
    payStructure: lead("10 líneas de pago", ["bod-notes"]),
    freeSpins: lead("Los libros activan giros gratis con un símbolo expansivo elegido al azar", ["bod-notes"]),
    jackpot: unsourced(),
    mechanics: ["paylines", "expanding-symbols", "free-spins"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.playngo.com/games/rich-wilde-and-the-book-of-dead"),
    sources: [
      officialPage("bod-page", "https://www.playngo.com/games/rich-wilde-and-the-book-of-dead", "Play'n GO — Book of Dead", ["demo"]),
      officialPage("bod-blog", "https://www.playngo.com", "Play'n GO — Artículo sobre el premio máximo", ["maxWin"], "Localizado mediante búsqueda. Se registrará la URL exacta al consultar la página."),
      editorNotes("bod-notes", ["releaseDate", "rtp", "volatility", "grid", "payStructure", "freeSpins"], "Widely reported figures pending confirmation."),
    ],
    review: {
      headline: "Un símbolo elegido al azar marca la diferencia",
      dek: "Diez años después, el símbolo expansivo sigue explicando con claridad cómo se distribuyen los resultados de alta volatilidad.",
      sections: [
        {
          id: "book",
          heading: "Un símbolo con dos funciones",
          paragraphs: [
            "El libro actúa como comodín y scatter. Sustituye símbolos en el juego base y, al aparecer en cantidad suficiente, activa los giros gratis. Esta doble función mantiene las reglas sencillas.",
          ],
        },
        {
          id: "expanding",
          heading: "El símbolo expansivo, explicado",
          paragraphs: [
            "Antes de los giros gratis se elige un símbolo normal al azar. Si aparece en suficientes rodillos para formar un premio, se expande y paga en todas las líneas, aunque los rodillos no sean adyacentes.",
            "La elección aleatoria tiene mucho peso. Los símbolos de mayor valor permiten alcanzar resultados superiores; los de menor valor limitan la ronda aunque se expandan varias veces. El jugador no decide cuál aparece.",
          ],
          aside: "El bonus depende de dos sorteos: qué símbolo se elige y cuántas veces aparece.",
        },
        {
          id: "variance",
          heading: "Varianza en estado puro",
          paragraphs: [
            "Con diez líneas y un juego base poco activo, Book of Dead concentra el retorno en los giros gratis. Son normales las rachas largas de pérdidas. El RTP es una media a largo plazo; los operadores pueden ofrecer configuraciones inferiores. Confirma la versión en la información del juego.",
          ],
        },
        {
          id: "gamble",
          heading: "Apuesta opcional de doble o nada",
          paragraphs: [
            "Muchas versiones incluyen doble o nada tras un premio. No mejora el retorno a largo plazo: añade varianza. Su disponibilidad depende de la jurisdicción.",
          ],
        },
      ],
      strengths: [
        "Reglas que caben en una frase.",
        "El símbolo expansivo produce una diferencia muy visible cuando coincide.",
        "Una referencia para comparar todo el subgénero de slots de libros.",
      ],
      limitations: [
        "Juego base poco activo; la mayor parte del valor está en el bonus.",
        "Existen varias configuraciones de RTP según el operador.",
        "Su presentación visual acusa los años frente a juegos más recientes.",
      ],
      verdict: "Sigue siendo una referencia de las slots de libros. Su estructura combina un juego base contenido con un bonus de resultados muy variables.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "reactoonz",
    slug: "reactoonz",
    name: "Reactoonz",
    providerId: "playngo",
    shortDescription:
      "Un tablero de siete por siete con premios por grupos y cascadas que cargan medidores para activar funciones especiales.",
    artwork: {
      licensed: null,
      schematic: { reels: 7, rows: 7, pattern: "cluster", dimsStatus: "pending" },
      palette: { base: "#6a3fd1", deep: "#1a1040", glow: "#a984ff", accent: "#7af0b0" },
    },
    releaseDate: lead("23 de octubre de 2017", ["rz-notes"]),
    rtp: lead(rtp([96.51, "Versión más alta"]), ["rz-notes"]),
    volatility: unsourced(),
    maxWin: lead("4.570× la apuesta", ["rz-notes"]),
    grid: lead("7 × 7 grid", ["rz-page"]),
    payStructure: lead("Pagos por grupos — 5 o más símbolos iguales adyacentes", ["rz-page"]),
    freeSpins: unsourced("Las referencias no describen una ronda tradicional de giros gratis."),
    jackpot: unsourced(),
    mechanics: ["cluster-pays", "tumble", "expanding-wilds"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.playngo.com/games/reactoonz"),
    sources: [
      officialPage("rz-page", "https://www.playngo.com/games/reactoonz", "Play'n GO — Reactoonz", ["grid", "payStructure", "demo"]),
      editorNotes("rz-notes", ["releaseDate", "rtp", "maxWin"], "Commonly reported figures pending confirmation."),
    ],
    review: {
      headline: "Una slot que funciona como un tablero de puzle",
      dek: "Una slot cercana a un puzle: los grupos desaparecen, los medidores se cargan y las funciones transforman el tablero.",
      sections: [
        {
          id: "clusters",
          heading: "Grupos en lugar de líneas",
          paragraphs: [
            "Los premios se forman con símbolos iguales conectados horizontal o verticalmente. Desaparecen y caen nuevos símbolos, lo que permite otros grupos. En sus 49 casillas, las cadenas alimentan los medidores del juego.",
          ],
        },
        {
          id: "meters",
          heading: "Dos medidores superpuestos",
          paragraphs: [
            "Los símbolos premiados cargan un medidor que activa comodines u otros modificadores. Según las referencias, al completarlo aparece un gran personaje comodín que cambia la cuadrícula. Otro medidor registra el progreso entre esos sucesos.",
            "El diseño da valor a la longitud de la cadena: una cascada prolongada aporta premios y avance en los medidores.",
          ],
          aside: "Los medidores añaden progreso al premio de cada cascada.",
        },
        {
          id: "no-free-spins",
          heading: "Sin bonus convencional",
          paragraphs: [
            "Reactoonz no concentra su acción en giros gratis activados por scatters. Todo ocurre en el juego principal, con un ritmo propio y sin un único momento que concentre el potencial.",
          ],
        },
      ],
      strengths: [
        "Ritmo distintivo, cercano al de un juego de tablero.",
        "Los medidores dan sentido adicional a las cascadas largas.",
        "No depende de esperar una única activación del bonus.",
      ],
      limitations: [
        "La pantalla recargada puede dificultar la lectura inicial.",
        "Las reglas de los medidores requieren aprendizaje.",
        "Volatilidad pendiente de documentar.",
      ],
      verdict: "Un tablero especialmente inventivo para su época, centrado en sistemas que interactúan y reacciones en cadena.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "starburst",
    slug: "starburst",
    name: "Starburst",
    providerId: "netent",
    shortDescription:
      "Diez líneas que pagan en ambos sentidos y un comodín expansivo que permanece durante un respin: un diseño clásico de baja varianza.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 3, pattern: "expand", focus: [1, 3], dimsStatus: "pending" },
      palette: { base: "#3b2a9e", deep: "#0d0b2e", glow: "#9a7cff", accent: "#ffd36a" },
    },
    releaseDate: lead("2012", ["sb2-notes"]),
    rtp: lead(rtp([96.08, "Referencia A"], [96.09, "Referencia B"]), ["sb2-page", "sb2-notes"], "Las referencias difieren en 0,01 puntos. Dato omitido hasta consultar la cifra oficial.", "conflicting"),
    volatility: lead("low", ["sb2-notes"]),
    maxWin: { value: null, status: "conflicting", sourceIds: ["sb2-page", "sb2-notes"], note: "Un extracto indica 800× la apuesta y las notas editoriales 500×. Dato omitido hasta confirmarlo." },
    grid: lead("5 rodillos × 3 filas", ["sb2-page"]),
    payStructure: lead("10 líneas de pago en ambos sentidos", ["sb2-notes"]),
    freeSpins: lead("Sin giros gratis; los comodines expansivos activan respins", ["sb2-notes"]),
    jackpot: unsourced(),
    mechanics: ["paylines", "both-ways", "expanding-wilds", "respins"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://netent.com/games/starburst"),
    sources: [
      officialPage("sb2-page", "https://netent.com/games/starburst", "NetEnt — Starburst", ["grid", "rtp", "maxWin", "demo"]),
      officialPage("sb2-promo", "https://clientarea.netent.com/promotionpacks/starburst/", "NetEnt — Paquete promocional (posibles recursos gráficos)", ["artwork"], "Posible fuente de material autorizado. Condiciones de acceso sin confirmar; puede requerir cuenta de cliente."),
      editorNotes("sb2-notes", ["releaseDate", "rtp", "volatility", "maxWin", "payStructure", "freeSpins"], "Widely reported figures pending confirmation."),
    ],
    review: {
      headline: "El valor de la sencillez",
      dek: "El juego que ayudó a popularizar el concepto de baja volatilidad. La contención sigue siendo su rasgo más interesante.",
      sections: [
        {
          id: "both-ways",
          heading: "Diez líneas, dos sentidos",
          paragraphs: [
            "Las líneas pagan en ambos sentidos. En una cuadrícula de cinco por tres, esto aumenta las posibilidades de que una pantalla forme una coincidencia premiada y contribuye a la frecuencia de premios pequeños.",
          ],
        },
        {
          id: "wild",
          heading: "El comodín expansivo y el respin",
          paragraphs: [
            "Los comodines aparecen en los tres rodillos centrales. Al caer, ocupan todo el rodillo y permanecen mientras los demás vuelven a girar. Otro comodín en el respin repite el proceso. Es la función que define el juego.",
            "Los comodines centrales completan líneas en ambos sentidos. Los resultados más grandes requieren que varios rodillos se vuelvan comodines en respins consecutivos.",
          ],
          aside: "No hay una ronda de bonus que esperar. El primer giro ya muestra toda la estructura del juego.",
        },
        {
          id: "low-variance",
          heading: "Qué significa la baja volatilidad",
          paragraphs: [
            "La baja volatilidad describe la distribución de resultados, no su media. Los premios son más pequeños y frecuentes, sin aumentar el retorno a largo plazo. El RTP teórico y la ventaja de la casa siguen aplicándose.",
            "Omitimos el premio máximo y el RTP exacto hasta resolver las discrepancias con la fuente oficial.",
          ],
        },
      ],
      strengths: [
        "Muy fácil de entender.",
        "Los premios pequeños frecuentes facilitan seguir los resultados.",
        "La función especial es visible desde el principio.",
      ],
      limitations: [
        "Límite máximo bajo frente a diseños actuales.",
        "Sin giros gratis ni estructura progresiva.",
        "Key figures currently disputed between leads.",
      ],
      verdict: "Un diseño sencillo de premios frecuentes que sirve de referencia para comparar otros juegos del catálogo.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "dead-or-alive-2",
    slug: "dead-or-alive-2",
    name: "Dead or Alive 2",
    providerId: "netent",
    shortDescription:
      "Un western de nueve líneas con tres modos de giros gratis, desde comodines persistentes hasta un atraco de resultados muy extremos.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 3, pattern: "sticky", dimsStatus: "pending" },
      palette: { base: "#c2532a", deep: "#2e120c", glow: "#ff9a5c", accent: "#ffd9a0" },
    },
    releaseDate: lead("Abril de 2019", ["doa-notes"]),
    rtp: lead(rtp([96.8, "Versión predeterminada"]), ["doa-notes"]),
    volatility: lead("very-high", ["doa-notes"]),
    maxWin: { value: null, status: "conflicting", sourceIds: ["doa-page", "doa-notes"], note: "Las referencias discrepan entre 100.000× y 111.111×. Dato omitido hasta confirmarlo." },
    grid: lead("5 rodillos × 3 filas", ["doa-notes"]),
    payStructure: lead("9 líneas de pago", ["doa-notes"]),
    freeSpins: lead("3 o más scatters conceden giros gratis en uno de tres modos: Old Saloon, Train Heist o High Noon Saloon", ["doa-page"]),
    jackpot: unsourced(),
    mechanics: ["paylines", "sticky-wilds", "multipliers", "free-spins", "feature-choice"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://netent.com/games/dead-or-alive-2"),
    sources: [
      officialPage("doa-page", "https://netent.com/games/dead-or-alive-2", "NetEnt — Dead or Alive 2", ["freeSpins", "maxWin", "demo"]),
      officialPage("doa-promo", "https://clientarea.netent.com/promotionpacks/dead-or-alive-2/", "NetEnt — Paquete promocional (posibles recursos gráficos)", ["artwork"], "Posible fuente de material autorizado; condiciones de acceso desconocidas."),
      editorNotes("doa-notes", ["releaseDate", "rtp", "volatility", "maxWin", "grid", "payStructure"], "Widely reported figures pending confirmation."),
    ],
    review: {
      headline: "Elegir el perfil de varianza",
      dek: "Tres bonus y una elección que permite ver con claridad cómo cambia la distribución de resultados.",
      sections: [
        {
          id: "choice",
          heading: "Elige el perfil del bonus",
          paragraphs: [
            "Antes de los giros gratis se elige un modo. Cada uno usa comodines persistentes de forma distinta, desde multiplicadores fijos hasta un modo de atraco donde aumentan con cada comodín recogido.",
            "La elección redistribuye resultados sin mejorar el retorno general. El modo más extremo cambia muchos premios modestos por una posibilidad pequeña de uno grande.",
          ],
          aside: "Elegir el bonus define el riesgo, sin crear una estrategia ganadora.",
        },
        {
          id: "modes",
          heading: "Los tres modos",
          paragraphs: [
            "Según las referencias, Old Saloon combina comodines persistentes con un multiplicador fijo. High Noon Saloon convierte los apilados en multiplicadores. En Train Heist, el multiplicador aumenta al recoger comodines. Documentaremos las cifras al consultar la tabla de pagos.",
          ],
        },
        {
          id: "base",
          heading: "El juego base como sala de espera",
          paragraphs: [
            "Las nueve líneas y los comodines retenidos pueden producir algún premio relevante en el juego base, pero el diseño gira en torno al bonus. La volatilidad extrema implica periodos prolongados sin retornos importantes.",
          ],
        },
      ],
      strengths: [
        "Bonus elegibles con perfiles muy diferentes.",
        "Comodines persistentes fáciles de seguir.",
        "Una forma clara de entender distintos perfiles de varianza.",
      ],
      limitations: [
        "Volatilidad muy alta; son normales las rachas largas sin premios relevantes.",
        "Maximum-win figure currently disputed between leads.",
        "Juego base poco activo.",
      ],
      verdict: "Un diseño útil para entender la volatilidad como elección de perfil. Requiere conocer las implicaciones de cada modo.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "bonanza-megaways",
    slug: "bonanza-megaways",
    name: "Bonanza Megaways",
    providerId: "big-time-gaming",
    shortDescription:
      "La slot Megaways original: alturas variables en cada giro, cascadas tras los premios y un multiplicador persistente en los giros gratis.",
    artwork: {
      licensed: null,
      schematic: { reels: 6, rows: [5, 7, 3, 6, 4, 7], topReel: true, pattern: "megaways", dimsStatus: "pending" },
      palette: { base: "#8a6230", deep: "#1e150c", glow: "#e0a85a", accent: "#5ad1c0" },
    },
    releaseDate: lead("7 de diciembre de 2016", ["bz-news"]),
    rtp: lead(rtp([96.0, "Web principal"], [96.11, "Web beta"]), ["bz-page", "bz-beta"], "Two official BTG pages report different figures; withheld until resolved.", "conflicting"),
    volatility: lead("high", ["bz-notes"]),
    maxWin: lead("26.000× la apuesta", ["bz-page"]),
    grid: lead("6 rodillos de altura variable y uno horizontal sobre los rodillos 2 a 5", ["bz-notes"]),
    payStructure: lead("Megaways — Hasta 117.649 formas de ganar", ["bz-page"]),
    freeSpins: lead("4 scatters conceden giros gratis con multiplicador sin límite que aumenta con cada cascada", ["bz-page"]),
    jackpot: unsourced(),
    mechanics: ["megaways", "tumble", "multipliers", "free-spins"],
    mechanicsStatus: "pending",
    demo: PENDING_DEMO("https://www.bigtimegaming.com/games/bonanza"),
    sources: [
      officialPage("bz-page", "https://www.bigtimegaming.com/games/bonanza", "Big Time Gaming — Bonanza", ["rtp", "maxWin", "payStructure", "freeSpins", "demo"]),
      officialPage("bz-beta", "https://beta.bigtimegaming.com/games/bonanza", "Big Time Gaming — Bonanza (web beta)", ["rtp"]),
      officialPage("bz-news", "https://www.bigtimegaming.com/news/bonanza-megaways-launching-december", "Big Time Gaming — Anuncio de lanzamiento", ["releaseDate"]),
      editorNotes("bz-notes", ["volatility", "grid"], "Widely reported figures pending confirmation."),
    ],
    review: {
      headline: "Cuando el propio tablero es aleatorio",
      dek: "El juego que hizo variable la altura de los rodillos, con un multiplicador del bonus que se acumula.",
      sections: [
        {
          id: "megaways",
          heading: "Formas de ganar que cambian en cada giro",
          paragraphs: [
            "Cada rodillo muestra una cantidad variable de símbolos. El producto de sus alturas determina las combinaciones posibles de cada giro, desde cientos hasta el máximo publicado cuando todos alcanzan su altura completa.",
            "Un rodillo horizontal añade símbolos sobre los centrales y aumenta las combinaciones. Por eso un giro con rodillos altos puede producir muchas más coincidencias que uno corto.",
          ],
        },
        {
          id: "reactions",
          heading: "Cascadas sucesivas",
          paragraphs: [
            "Los símbolos premiados desaparecen y se sustituyen desde arriba. BTG llama a esto reacción. Cada reacción vuelve a evaluar las combinaciones dentro del mismo giro.",
          ],
        },
        {
          id: "free-spins",
          heading: "El multiplicador sin límite",
          paragraphs: [
            "En los giros gratis, el multiplicador aumenta con cada reacción y no se reinicia entre giros. Las rondas con muchas cascadas acumulan valor; las de giros cortos mantienen un multiplicador bajo.",
          ],
          aside: "El multiplicador conserva lo ocurrido antes durante la ronda.",
        },
        {
          id: "rtp-note",
          heading: "Sobre la cifra de RTP",
          paragraphs: [
            "Dos páginas oficiales de Big Time Gaming parecen indicar RTP distintos. Omitimos la cifra hasta confirmar cuál corresponde a la versión actual.",
          ],
        },
      ],
      strengths: [
        "Una referencia original y clara del formato Megaways.",
        "El multiplicador persistente estructura la progresión del bonus.",
        "Las cascadas añaden varias evaluaciones en un giro.",
      ],
      limitations: [
        "Resultados muy variables; los giros sin premio son frecuentes.",
        "Official RTP figure currently disputed.",
      ],
      verdict: "Una referencia para entender todo un género y cómo la distribución aleatoria de los rodillos influye en su volatilidad.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "wanted-dead-or-a-wild",
    slug: "wanted-dead-or-a-wild",
    name: "Wanted Dead or a Wild",
    providerId: "hacksaw-gaming",
    shortDescription:
      "Tres bonus diferenciados y rodillos de duelo en un tablero de cinco por cinco, con RTP que varían mucho según el operador.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 5, pattern: "expand", focus: [1, 3], dimsStatus: "pending" },
      palette: { base: "#b0262a", deep: "#250a0c", glow: "#ff6a55", accent: "#f2e6cf" },
    },
    releaseDate: unsourced("Ya estaba disponible en abril de 2023 según noticias del proveedor. Fecha exacta sin documentar."),
    rtp: lead(
      rtp([96.38, "Versión 1"], [94.55, "Versión 2"], [92.33, "Versión 3"], [88.42, "Versión 4"]),
      ["wd-page"],
      "Hay referencias a cuatro configuraciones, pero faltan sus denominaciones oficiales.",
    ),
    volatility: lead("high", ["wd-page"], "Según las referencias, el proveedor lo puntúa con 4 sobre 5."),
    maxWin: lead("12.500× la apuesta", ["wd-page"]),
    grid: lead("5 rodillos × 5 filas", ["wd-page"]),
    payStructure: unsourced(),
    freeSpins: lead("Dos bonus de giros gratis: The Great Train Robbery y Dead Man's Hand", ["wd-page"]),
    jackpot: unsourced(),
    mechanics: ["sticky-wilds", "multipliers", "free-spins", "bonus-buy"],
    mechanicsStatus: "pending",
    demo: { kind: "not_found", note: "Aún no hemos localizado una demo oficial de este juego." },
    sources: [
      officialPage("wd-page", "https://www.hacksawgaming.com/games/wanted-dead-or-a-wild", "Hacksaw Gaming — Wanted Dead or a Wild", ["rtp", "volatility", "maxWin", "grid", "freeSpins"]),
    ],
    review: {
      headline: "Lo primero: comprobar la versión de RTP",
      dek: "El western de Hacksaw reúne varias funciones, pero el dato esencial es la versión de RTP elegida por el operador.",
      sections: [
        {
          id: "rtp-range",
          heading: "Empieza por las versiones de RTP",
          paragraphs: [
            "Las referencias enumeran cuatro RTP con casi ocho puntos porcentuales de diferencia. A largo plazo, la versión inferior devuelve bastante menos que la superior, sin diferencias visibles en el juego.",
            "Consulta la pantalla de información para saber qué versión está disponible. Publicaremos las denominaciones oficiales cuando las confirmemos.",
          ],
          aside: "Mismo arte y mismas reglas, con un retorno a largo plazo muy distinto.",
        },
        {
          id: "duel",
          heading: "Rodillos de duelo",
          paragraphs: [
            "Según las referencias, ciertos símbolos activan duelos que se resuelven en rodillos comodín con multiplicadores. Son una de las funciones principales del juego base.",
          ],
        },
        {
          id: "bonuses",
          heading: "Dos bonus muy distintos",
          paragraphs: [
            "The Great Train Robbery y Dead Man's Hand combinan de forma distinta los comodines persistentes y los multiplicadores. Comprar acceso al bonus acelera considerablemente el gasto y está restringido en algunos mercados.",
          ],
        },
      ],
      strengths: [
        "Las distintas funciones mantienen activo el juego base.",
        "Rondas de bonus con perfiles diferenciados.",
        "Identidad visual sólida y coherente.",
      ],
      limitations: [
        "Gran diferencia entre las configuraciones de RTP.",
        "La compra de bonus acelera el gasto donde está disponible.",
        "Demo oficial todavía sin confirmar.",
      ],
      verdict: "Un diseño intenso e inventivo. Cualquier análisis debe empezar por confirmar la versión de RTP que ofrece el operador.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
  {
    id: "money-train-2",
    slug: "money-train-2",
    name: "Money Train 2",
    providerId: "relax-gaming",
    shortDescription:
      "Un bonus de respins donde los personajes recogen, multiplican y modifican valores, con un tablero que puede crecer hasta seis rodillos.",
    artwork: {
      licensed: null,
      schematic: { reels: 5, rows: 4, pattern: "respin", dimsStatus: "unsourced" },
      palette: { base: "#4a5566", deep: "#12161d", glow: "#ffb45a", accent: "#8fd3ff" },
    },
    releaseDate: lead("2 de septiembre de 2020", ["mt-news"]),
    rtp: lead(rtp([96.4, "Versión predeterminada"]), ["mt-notes"], "Hay referencias a una versión del 90 % en al menos una jurisdicción."),
    volatility: lead("high", ["mt-notes"], "La única referencia es un análisis de un tercero republicado por el proveedor."),
    maxWin: lead("50.000× la apuesta", ["mt-page"]),
    grid: unsourced("Según las referencias, el bonus desbloquea rodillos adicionales. La cuadrícula base está pendiente de documentar."),
    payStructure: unsourced(),
    freeSpins: lead("3 o más scatters activan el bonus Money Cart de respins", ["mt-page"]),
    jackpot: unsourced(),
    mechanics: ["hold-and-respin", "money-collect", "multipliers", "bonus-buy"],
    mechanicsStatus: "pending",
    demo: { kind: "not_found", note: "Sin demo oficial localizada." },
    sources: [
      officialPage("mt-page", "https://www.relax-gaming.com/products/casino/moneytrain2", "Relax Gaming — Money Train 2", ["maxWin", "freeSpins"]),
      officialPage("mt-news", "https://www.relax-gaming.com/news/2020/08/relax-gaming-to-roll-out-biggest-release-of-the-year-with-money-train-2", "Relax Gaming — Anuncio de lanzamiento", ["releaseDate"]),
      editorNotes("mt-notes", ["rtp", "volatility"], "Cifras citadas habitualmente, pendientes de confirmar. No deben confundirse con Money Train original o Money Cart."),
    ],
    review: {
      headline: "El orden de llegada lo cambia todo",
      dek: "Un bonus de respins en el que cada símbolo especial modifica a otros. El orden en que aparecen influye en el resultado.",
      sections: [
        {
          id: "respins",
          heading: "El bonus Money Cart",
          paragraphs: [
            "Los símbolos de bonus quedan fijados y cada uno nuevo reinicia el contador de respins. La ronda termina cuando se agota el contador y se pagan los valores fijados.",
          ],
        },
        {
          id: "characters",
          heading: "Personajes que interactúan",
          paragraphs: [
            "Algunos símbolos recogen valores, otros multiplican y otros suman a toda la pantalla. Actúan al aparecer, por lo que la secuencia importa: un recolector después de un multiplicador produce un resultado distinto al orden inverso.",
            "El bonus también puede desbloquear rodillos adicionales y ampliar las posiciones donde se fijan los símbolos.",
          ],
          aside: "El orden de llegada es una variable aleatoria fuera de tu control.",
        },
        {
          id: "context",
          heading: "Un diseño de alta varianza",
          paragraphs: [
            "El máximo publicado es un límite, sin constituir una expectativa. El valor se concentra en secuencias raras de símbolos concretos. Hay referencias a varios RTP, incluido uno específico de una jurisdicción.",
          ],
        },
      ],
      strengths: [
        "La interacción de símbolos genera rondas variadas.",
        "El contador de respins facilita seguir la ronda.",
        "Expanding grid adds a late-round twist.",
      ],
      limitations: [
        "El resultado depende mucho del orden de los símbolos.",
        "Se mencionan varias versiones de RTP.",
        "Cuadrícula base y estructura de pagos pendientes de documentar.",
      ],
      verdict: "Un referente del bonus de respins. Permite estudiar sus sistemas teniendo presente que muchas rondas darán resultados modestos.",
    },
    publishedAt: "2026-10-20",
    updatedAt: "2026-10-20",
    reviewedAt: null,
    publicationStatus: "pending_review",
  },
];
