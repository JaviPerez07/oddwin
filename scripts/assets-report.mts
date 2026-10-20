/**
 * Asset registry report.
 *   npm run assets:report            → summary table in the terminal
 *   npm run assets:report -- --md    → (re)write docs/asset-permissions/REGISTER.md
 *   npm run assets:report -- --check → exit 1 if REGISTER.md is out of date
 * Generated from src/data/assets.ts, the single source of truth.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assets, CHECKED, NEXT_REVIEW, PROVIDER_ACCESS } from "../src/data/assets.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "asset-permissions", "REGISTER.md");

type A = (typeof assets)[number];
const subject = (a: A) => `${a.subject.type === "slot" ? "" : "studio: "}${a.subject.id}`;
const link = (u: string | null) => (u ? `<${u}>` : "—");
const count = (pred: (a: A) => boolean) => assets.filter(pred).length;

function table(rows: A[], cols: [string, (a: A) => string][]) {
  if (!rows.length) return "_None._\n";
  const head = `| ${cols.map(([h]) => h).join(" | ")} |\n| ${cols.map(() => "---").join(" | ")} |\n`;
  return head + rows.map((r) => `| ${cols.map(([, f]) => f(r).replace(/\|/g, "\\|")).join(" | ")} |`).join("\n") + "\n";
}

const COLS: [string, (a: A) => string][] = [
  ["Resource", (a) => `\`${a.id}\``],
  ["Subject", subject],
  ["Kind", (a) => a.kind],
  ["Source", (a) => link(a.sourceUrl)],
  ["Availability", (a) => a.availability],
  ["Evidence", (a) => a.sourceEvidence ?? "—"],
];

function markdown() {
  const statuses = ["approved", "permission_pending", "restricted", "unknown", "not_found"] as const;
  let md = `# Asset permission register\n\n`;
  md += `Generated from \`src/data/assets.ts\` by \`npm run assets:report -- --md\`. Do not edit by hand.\n\n`;
  md += `- Last check: **${CHECKED}** · next review: **${NEXT_REVIEW}**\n`;
  md += `- Evidence base: web-search results restricted to official domains. Provider websites could not be opened from the build environment (network policy, HTTP 403), so no page was inspected directly and **no file has been downloaded**.\n`;
  md += `- Requests: drafted in \`docs/asset-permissions/requests/\` — **none has been sent**; **no permission has been granted**.\n\n`;
  md += `## Summary\n\n| Status | Records |\n| --- | --- |\n${statuses.map((s) => `| \`${s}\` | ${count((a) => a.permission.status === s)} |`).join("\n")}\n| **Total** | ${assets.length} |\n\n`;
  md += `| Availability | Records |\n| --- | --- |\n${["public_download", "login_required", "access_blocked", "not_located"].map((v) => `| \`${v}\` | ${count((a) => a.availability === v)} |`).join("\n")}\n\n`;
  md += `## Approved (displayable once a local file is present)\n\n${table(assets.filter((a) => a.permission.status === "approved"), [...COLS, ["Uses", (a) => a.permission.authorisedUses.join(", ")], ["Attribution", (a) => a.permission.attribution ?? "—"]])}\n`;
  md += `## Located resources\n\nSpecific files or packs identified (not just the game page).\n\n${table(assets.filter((a) => a.permission.status !== "not_found"), [...COLS, ["Status", (a) => `\`${a.permission.status}\``]])}\n`;
  md += `## Downloadable without an account\n\n${table(assets.filter((a) => a.availability === "public_download"), COLS)}\n_Public availability does not imply permission to reuse._\n\n`;
  for (const [s, title] of [["permission_pending", "Pending permission"], ["restricted", "Restricted by the terms consulted"], ["unknown", "Unknown — terms not found"]] as const) {
    md += `## ${title}\n\n${table(assets.filter((a) => a.permission.status === s), [...COLS, ["Notes", (a) => a.notes]])}\n`;
  }
  md += `## Not found\n\n${table(assets.filter((a) => a.permission.status === "not_found"), [["Resource", (a) => `\`${a.id}\``], ["Reference page", (a) => link(a.sourceUrl)], ["Availability", (a) => a.availability]])}\n`;
  md += `## Providers to contact\n\n| Provider | Terms | Media / asset area | Access | Default status | Request draft |\n| --- | --- | --- | --- | --- | --- |\n`;
  md += Object.values(PROVIDER_ACCESS)
    .map((p) => `| ${p.holder} | ${link(p.termsUrl)} | ${link(p.mediaAreaUrl)} | ${p.mediaAccess.replace(/\|/g, "\\|")} | \`${p.defaultStatus}\` | \`${p.requestDraft}\` (not sent) |`)
    .join("\n");
  md += `\n\n### Contact points and routes\n\nRole-based addresses seen on official domains in search results (no personal addresses stored). Confirm each on the live page before sending.\n\n`;
  for (const p of Object.values(PROVIDER_ACCESS)) {
    md += `**${p.holder}** — ${p.route}\n\n${p.contacts.map((c) => `- ${c.channel}: ${c.value} (seen at <${c.foundAt}>)`).join("\n")}\n\n`;
  }
  return md;
}

const args = process.argv.slice(2);
if (args.includes("--md")) {
  writeFileSync(OUT, markdown());
  console.log(`wrote ${OUT}`);
} else if (args.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {}
  if (current !== markdown()) {
    console.error("docs/asset-permissions/REGISTER.md is out of date — run: npm run assets:report -- --md");
    process.exit(1);
  }
  console.log("REGISTER.md is up to date");
} else {
  console.table(assets.map((a) => ({ id: a.id, status: a.permission.status, availability: a.availability, file: a.localPath ?? "—" })));
  console.log(["approved", "permission_pending", "restricted", "unknown", "not_found"].map((s) => `${s}: ${count((a) => a.permission.status === s)}`).join(" · "));
}
