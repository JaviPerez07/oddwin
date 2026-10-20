import type { FactStatus } from "@/types/source";
import { cn } from "@/lib/utils";

/*
 * Verification marks. Pending figures get a small amber dot; conflicting ones
 * a red ring and are withheld; unsourced ones a hollow grey dot. Verified
 * figures carry no mark. The key (MarkKey) is shown wherever marks appear.
 */
const label: Record<FactStatus, string> = {
  verified: "Verificado",
  pending: "Pendiente de verificación",
  conflicting: "Fuentes contradictorias — Dato omitido",
  unsourced: "Sin fuente documentada",
};

const dot: Record<FactStatus, string> = {
  verified: "bg-verified",
  pending: "bg-pending",
  conflicting: "border border-conflict bg-transparent",
  unsourced: "border border-fg-3 bg-transparent",
};

export function Mark({ status, className }: { status: FactStatus; className?: string }) {
  if (status === "verified") return null;
  return (
    <span className={cn("relative -top-[0.45em] ml-[3px] inline-block size-[6px] rounded-full align-middle", dot[status], className)} title={label[status]}>
      <span className="sr-only"> ({label[status]})</span>
    </span>
  );
}

export function StatusChip({ status, className }: { status: FactStatus; className?: string }) {
  const tone = { verified: "text-verified", pending: "text-pending", conflicting: "text-conflict", unsourced: "text-fg-3" }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium", tone, className)}>
      <span aria-hidden className={cn("size-[6px] rounded-full", dot[status])} />
      {label[status]}
    </span>
  );
}

export function MarkKey({ className }: { className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-3", className)}>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-[6px] rounded-full bg-pending" /> pendiente de verificación
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-[6px] rounded-full border border-conflict" /> contradictorio, omitido
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-[6px] rounded-full border border-fg-3" /> sin fuente
      </span>
      <span>sin marca = verificado</span>
    </p>
  );
}

export function statusLabel(status: FactStatus) {
  return label[status];
}
