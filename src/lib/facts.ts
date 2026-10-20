import { volatilityLabel } from "@/lib/mechanics";
import { formatPercent } from "@/lib/utils";
import type { RtpVersion, Slot, Volatility } from "@/types/slot";
import type { Fact, FactStatus } from "@/types/source";

export function rtpText(fact: Fact<RtpVersion[]>): string | null {
  if (fact.status === "conflicting") return "omitido";
  if (!fact.value?.length) return null;
  const [first, ...rest] = fact.value;
  return rest.length ? `${formatPercent(first.value)} +${rest.length}v` : formatPercent(first.value);
}

export function volatilityText(fact: Fact<Volatility>): string | null {
  return fact.value ? volatilityLabel[fact.value] : null;
}

export function simpleText(fact: Fact<string>): string | null {
  if (fact.status === "conflicting") return "omitido";
  return fact.value;
}

export function shortMaxWin(slot: Slot): string | null {
  return simpleText(slot.maxWin)?.replace(/( stake| la apuesta)$/, "") ?? null;
}

export function layoutText(slot: Slot): string {
  const s = slot.artwork.schematic;
  if (Array.isArray(s.rows)) return "Megaways";
  return `${s.reels}×${s.rows}`;
}

export function paysText(slot: Slot): string | null {
  const v = slot.payStructure.value;
  if (!v) return null;
  return v.split(/ — |,/)[0];
}

export interface SpecPart {
  key: string;
  label: string;
  text: string | null;
  status: FactStatus;
}

/** The one-line "form guide" used under headlines and in index rows. */
export function specParts(slot: Slot): SpecPart[] {
  return [
    { key: "layout", label: "Cuadrícula", text: layoutText(slot), status: slot.artwork.schematic.dimsStatus },
    { key: "rtp", label: "RTP", text: rtpText(slot.rtp), status: slot.rtp.status },
    { key: "vol", label: "Vol", text: volatilityText(slot.volatility), status: slot.volatility.status },
    { key: "max", label: "Max", text: shortMaxWin(slot), status: slot.maxWin.status },
  ];
}

/** Back-compat helper for headline facts (RTP, volatility, max win). */
export function headlineFacts(slot: Slot) {
  return specParts(slot).filter((p) => p.key !== "layout");
}

/**
 * Headline figures for prominent surfaces (spotlight, cards, hero stats).
 * Only verified figures are returned: unverified leads would read as facts
 * there, so they stay in the technical file with their status and source.
 */
export function confirmedFacts(slot: Slot): SpecPart[] {
  return specParts(slot).filter((p) => p.key !== "layout" && p.status === "verified" && p.text);
}

/** How many headline figures are still awaiting verification. */
export function pendingHeadlineCount(slot: Slot): number {
  return [slot.rtp, slot.volatility, slot.maxWin].filter((f) => f.status !== "verified").length;
}
