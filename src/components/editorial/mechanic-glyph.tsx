import { cn } from "@/lib/utils";
import type { Mechanic } from "@/types/slot";

/**
 * Conceptual line diagrams explaining each mechanic. They describe how a
 * mechanic works and never depict any specific game.
 */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Grid({ cols = 3, filas = 3, filled = [] as [number, number][] }) {
  const size = 32 / Math.max(cols, filas);
  const ox = 8 + (32 - cols * size) / 2;
  const oy = 8 + (32 - filas * size) / 2;
  const cells = [];
  for (let c = 0; c < cols; c++)
    for (let r = 0; r < filas; r++) {
      const on = filled.some(([x, y]) => x === c && y === r);
      cells.push(<rect key={`${c}-${r}`} x={ox + c * size + 1} y={oy + r * size + 1} width={size - 2} height={size - 2} rx={1.5} fill={on ? "currentColor" : "none"} stroke="currentColor" strokeOpacity={on ? 1 : 0.35} strokeWidth={1.2} />);
    }
  return <>{cells}</>;
}

const glyphs: Record<Mechanic, React.ReactNode> = {
  tumble: (
    <>
      <Grid cols={3} filas={2} filled={[[1, 1]]} />
      <path {...S} d="M24 4v6m-3-3 3 3 3-3" transform="translate(0 -1)" />
    </>
  ),
  "pay-anywhere": <Grid cols={4} filas={4} filled={[[0, 1], [1, 3], [2, 0], [3, 2], [2, 2]]} />,
  "cluster-pays": <Grid cols={4} filas={4} filled={[[1, 1], [2, 1], [2, 2], [1, 2], [2, 3]]} />,
  megaways: (
    <>
      {[10, 18, 6, 14, 22].map((h, i) => (
        <rect key={i} x={9 + i * 6.4} y={40 - h - 6} width={4.6} height={h + 4} rx={1} {...S} strokeWidth={1.3} />
      ))}
    </>
  ),
  paylines: (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={8 + i * 8} cy={i % 2 ? 30 : 18} r={2.2} fill="currentColor" />
      ))}
      <path {...S} d="M8 18 16 30 24 18 32 30 40 18" />
    </>
  ),
  "both-ways": <path {...S} d="M8 24h32M13 19l-5 5 5 5M35 19l5 5-5 5" />,
  "expanding-symbols": (
    <>
      <Grid cols={3} filas={3} />
      <rect x={19.7} y={9} width={8.6} height={30} rx={1.5} fill="currentColor" />
    </>
  ),
  "expanding-wilds": (
    <>
      <Grid cols={3} filas={3} />
      <rect x={19.7} y={9} width={8.6} height={30} rx={1.5} fill="currentColor" fillOpacity={0.85} />
      <path d="M24 20l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5z" fill="var(--color-canvas)" />
    </>
  ),
  "sticky-wilds": (
    <>
      <rect x={12} y={14} width={22} height={22} rx={3} {...S} />
      <circle cx={34} cy={14} r={4} fill="currentColor" />
    </>
  ),
  multipliers: (
    <>
      <circle cx={24} cy={24} r={14} {...S} />
      <path {...S} d="M19 19l10 10M29 19 19 29" />
    </>
  ),
  "free-spins": (
    <>
      <path {...S} d="M36 24a12 12 0 1 1-4-9" />
      <path {...S} d="M33 9v6h-6" />
    </>
  ),
  "money-collect": (
    <>
      {[[12, 14], [36, 14], [12, 34], [36, 34]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={4} {...S} />
      ))}
      <rect x={19} y={19} width={10} height={10} rx={2} fill="currentColor" />
      <path {...S} strokeOpacity={0.5} d="M15 17l4 4M33 17l-4 4M15 31l4-4M33 31l-4-4" />
    </>
  ),
  "hold-and-respin": <Grid cols={4} filas={3} filled={[[0, 0], [2, 1], [3, 2], [1, 2]]} />,
  "bonus-buy": (
    <>
      <path {...S} d="M10 24 24 10h12v12L22 36z" />
      <circle cx={31} cy={15} r={2} fill="currentColor" />
    </>
  ),
  respins: (
    <>
      <rect x={17} y={17} width={14} height={14} rx={2} {...S} />
      <path {...S} d="M38 24a14 14 0 1 1-4-10" />
      <path {...S} d="M35 8v6h-6" />
    </>
  ),
  "feature-choice": <path {...S} d="M10 24h10m0 0 14-10m-14 10h14m-14 0 14 10M34 14h4M34 24h4M34 34h4" />,
};

export function MechanicGlyph({ mechanic, className }: { mechanic: Mechanic; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-12 shrink-0", className)}>
      {glyphs[mechanic]}
    </svg>
  );
}
