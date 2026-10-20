import { Mark, StatusChip } from "@/components/editorial/status";
import { mechanicInfo } from "@/lib/mechanics";
import { simpleText, volatilityText } from "@/lib/facts";
import { formatDate, formatPercent } from "@/lib/utils";
import type { Provider } from "@/types/provider";
import type { Slot } from "@/types/slot";
import type { Fact, FactStatus } from "@/types/source";

interface Row {
  label: string;
  value: React.ReactNode;
  status: FactStatus;
  note?: string;
}

function textRow(label: string, fact: Fact<string>): Row {
  return { label, value: simpleText(fact), status: fact.status, note: fact.note };
}

/** The technical file: every field, its value, its status and the editor's note. */
export function FactSheet({ slot, provider }: { slot: Slot; provider: Provider | null }) {
  const rows: Row[] = [
    { label: "Proveedor", value: provider?.name, status: provider?.status === "published" ? "verified" : "pending" },
    textRow("Lanzamiento", slot.releaseDate),
    {
      label: "RTP",
      status: slot.rtp.status,
      note: slot.rtp.note,
      value:
        slot.rtp.status === "conflicting" ? (
          <span>
            omitido <span className="text-fg-3">(referencias: {slot.rtp.value?.map((v) => formatPercent(v.value)).join(" / ")})</span>
          </span>
        ) : slot.rtp.value?.length ? (
          <span className="block space-y-0.5">
            {slot.rtp.value.map((v, i) => (
              <span key={v.label} className="block">
                {formatPercent(v.value)}
                {i === 0 ? <Mark status={slot.rtp.status} /> : null} <span className="text-fg-3">{v.label}</span>
              </span>
            ))}
          </span>
        ) : null,
    },
    { label: "Volatilidad", value: volatilityText(slot.volatility), status: slot.volatility.status, note: slot.volatility.note },
    textRow("Premio máximo", slot.maxWin),
    textRow("Cuadrícula", slot.grid),
    textRow("Pays", slot.payStructure),
    textRow("Giros gratis", slot.freeSpins),
    ...(slot.jackpot.value ? [textRow("Bote", slot.jackpot)] : []),
    { label: "Mecánicas", value: slot.mechanics.map((m) => mechanicInfo[m].label).join(", "), status: slot.mechanicsStatus },
    { label: "Verificado el", value: slot.reviewedAt ? formatDate(slot.reviewedAt) : null, status: slot.reviewedAt ? "verified" : "unsourced", note: slot.reviewedAt ? undefined : "No figure on this page has been confirmed against a primary source yet." },
  ];

  return (
    <section aria-labelledby="facts-heading" id="technical-file">
      <div className="flex items-baseline justify-between">
        <h3 id="facts-heading" className="text-sm font-semibold text-fg">
          Cada dato, con su estado
        </h3>
        <span className="figure text-xs text-fg-3">investigación {formatDate(slot.updatedAt)}</span>
      </div>
      <dl className="mt-3 overflow-hidden rounded-xl bg-surface px-4 ring-1 ring-inset ring-line">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-b border-line py-3 last:border-b-0 sm:grid-cols-[7.5rem_minmax(0,1fr)_11rem]">
            <dt className="pt-0.5 text-sm text-fg-3">{r.label}</dt>
            <dd className="figure min-w-0 text-sm text-fg">
              {r.value && r.status !== "verified" ? <span className="mr-1.5 font-sans text-xs text-fg-3">Referencia</span> : null}
              {r.value ?? <span className="text-fg-3">—</span>}
              {r.value && r.label !== "RTP" ? <Mark status={r.status} /> : null}
              {r.note ? <span className="mt-1 block font-sans text-xs leading-snug text-fg-3">{r.note}</span> : null}
            </dd>
            <dd className="col-start-2 mt-1 sm:col-start-3 sm:mt-0 sm:text-right">
              <StatusChip status={r.status} />
            </dd>
          </div>
        ))}
      </dl>
            <p className="mt-2 text-sm leading-relaxed text-fg-3">
        El RTP es una media teórica sobre millones de giros, sin predecir una sesión. El premio máximo es el límite del modelo matemático, sin indicar un resultado probable.
      </p>
    </section>
  );
}
