import { providers } from "@/data/providers";
import { slots } from "@/data/slots";
import { offers } from "@/data/offers";
import { casinos } from "@/data/casinos";
import { destinationProblem } from "@/lib/eligibility";
import type { Fact } from "@/types/source";
import type { Slot } from "@/types/slot";

/** Fields that must be verified before a review can be published and indexed. */
const CORE_FACTS = ["rtp", "volatility", "maxWin"] as const;

function factProblems(slot: Slot, name: string, fact: Fact<unknown>): string[] {
  const problems: string[] = [];
  for (const id of fact.sourceIds) {
    if (!slot.sources.some((s) => s.id === id)) problems.push(`${slot.slug}.${name}: unknown source "${id}"`);
  }
  if (fact.status === "verified") {
    const confirmed = fact.sourceIds.some((id) => {
      const s = slot.sources.find((x) => x.id === id);
      return s && s.result === "confirmed" && (s.trust === "primary" || s.trust === "secondary") && s.consultedAt;
    });
    if (!confirmed) problems.push(`${slot.slug}.${name}: marked verified without a confirmed primary/secondary source`);
  }
  if (fact.status !== "unsourced" && fact.status !== "conflicting" && fact.value === null) {
    problems.push(`${slot.slug}.${name}: status ${fact.status} but no value`);
  }
  return problems;
}

export function validateSlot(slot: Slot): string[] {
  const problems: string[] = [];
  if (!providers.some((p) => p.id === slot.providerId)) problems.push(`${slot.slug}: unknown provider ${slot.providerId}`);

  const facts: [string, Fact<unknown>][] = [
    ["releaseDate", slot.releaseDate],
    ["rtp", slot.rtp],
    ["volatility", slot.volatility],
    ["maxWin", slot.maxWin],
    ["grid", slot.grid],
    ["payStructure", slot.payStructure],
    ["freeSpins", slot.freeSpins],
    ["jackpot", slot.jackpot],
  ];
  for (const [name, fact] of facts) problems.push(...factProblems(slot, name, fact));

  if (slot.demo.kind === "verified" || slot.demo.kind === "official_site_only") {
    if (!slot.demo.url.startsWith("https://")) problems.push(`${slot.slug}: demo URL must be HTTPS`);
    if (!slot.demo.checkedAt) problems.push(`${slot.slug}: demo needs a check date`);
  }

  if (slot.publicationStatus === "published") {
    for (const name of CORE_FACTS) {
      if (slot[name].status !== "verified") problems.push(`${slot.slug}: cannot publish — ${name} is ${slot[name].status}`);
    }
    if (!slot.reviewedAt) problems.push(`${slot.slug}: cannot publish without reviewedAt`);
  }
  return problems;
}

/** A review is indexable only when published and passing every check. */
export function isSlotIndexable(slot: Slot): boolean {
  return slot.publicationStatus === "published" && validateSlot(slot).length === 0;
}

export function validateCatalog(): string[] {
  const problems: string[] = [];
  const slugs = new Set<string>();
  for (const slot of slots) {
    if (slugs.has(slot.slug)) problems.push(`duplicate slug ${slot.slug}`);
    slugs.add(slot.slug);
    problems.push(...validateSlot(slot));
  }
  for (const offer of offers) {
    if (offer.isTestData) problems.push(`${offer.id}: test data in production offers`);
    if (offer.approvalStatus === "approved") {
      const dest = destinationProblem(offer);
      if (dest) problems.push(`${offer.id}: ${dest}`);
      if (!offer.verifiedAt) problems.push(`${offer.id}: approved without verifiedAt`);
      if (!casinos.some((c) => c.id === offer.casinoId)) problems.push(`${offer.id}: unknown casino`);
    }
  }
  for (const casino of casinos) {
    if (casino.isTestData) problems.push(`${casino.id}: test data in production casinos`);
  }
  return problems;
}
