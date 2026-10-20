import type { Mechanic, Volatility } from "@/types/slot";

export const mechanicInfo: Record<Mechanic, { label: string; blurb: string }> = {
  "pay-anywhere": { label: "Pagos en cualquier posición", blurb: "Los premios cuentan los símbolos iguales en cualquier posición de la cuadrícula, sin líneas." },
  tumble: { label: "Cascadas", blurb: "Los símbolos premiados desaparecen y caen otros nuevos, encadenando resultados dentro del mismo giro." },
  "cluster-pays": { label: "Pagos por grupos", blurb: "Pagan los grupos de símbolos iguales adyacentes, sin depender del rodillo." },
  megaways: { label: "Megaways", blurb: "La altura de los rodillos cambia en cada giro, variando las formas de ganar." },
  paylines: { label: "Líneas de pago", blurb: "Líneas fijas clásicas evaluadas de izquierda a derecha." },
  "both-ways": { label: "Pagos en ambos sentidos", blurb: "Líneas evaluadas desde ambos extremos." },
  "expanding-symbols": { label: "Símbolos expansivos", blurb: "Un símbolo elegido se expande hasta llenar rodillos durante una función especial." },
  "expanding-wilds": { label: "Comodines expansivos", blurb: "Comodines que ocupan un rodillo completo." },
  "sticky-wilds": { label: "Comodines persistentes", blurb: "Comodines que permanecen en su posición durante giros posteriores o respins." },
  multipliers: { label: "Multiplicadores", blurb: "Símbolos o medidores que multiplican los premios." },
  "free-spins": { label: "Giros gratis", blurb: "Ronda de giros sin apuesta adicional." },
  "money-collect": { label: "Recogida de valores", blurb: "Un símbolo recolector recoge el valor monetario de otros símbolos." },
  "hold-and-respin": { label: "Retención y respins", blurb: "Los símbolos de bonus quedan fijados mientras las posiciones restantes vuelven a girar." },
  "bonus-buy": { label: "Compra de bonus", blurb: "Permite pagar un precio fijo para acceder al bonus. Restringido en algunos mercados." },
  respins: { label: "Respins", blurb: "Giros adicionales con algunos rodillos retenidos." },
  "feature-choice": { label: "Elección de bonus", blurb: "El jugador elige entre variantes del bonus con distintos perfiles de riesgo." },
};

export const volatilityLabel: Record<Volatility, string> = {
  low: "Baja",
  medium: "Media",
  "medium-high": "Media-alta",
  high: "Alta",
  "very-high": "Muy alta",
};

/** 1–5 scale for the small volatility meter. */
export const volatilityLevel: Record<Volatility, number> = {
  low: 1,
  medium: 2,
  "medium-high": 3,
  high: 4,
  "very-high": 5,
};

const GENERIC: Mechanic[] = ["paylines", "free-spins", "multipliers", "bonus-buy"];

/** The mechanic that best characterises a game (skips near-universal ones). */
export function signatureMechanic(mechanics: Mechanic[]): Mechanic | undefined {
  return mechanics.find((m) => !GENERIC.includes(m)) ?? mechanics[0];
}
