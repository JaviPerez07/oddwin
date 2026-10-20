import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Schematic, SlotArtwork } from "@/types/slot";

type Aspect = "landscape" | "wide" | "square" | "portrait";
const SIZE: Record<Aspect, [number, number]> = {
  landscape: [800, 600],
  wide: [800, 450],
  square: [600, 600],
  portrait: [640, 800],
};

type Cell = [reel: number, row: number];

/** Fixed, hand-placed overlays per pattern so every plate is stable between renders. */
const SCATTER: Cell[] = [[0, 1], [1, 3], [2, 0], [2, 4], [3, 2], [4, 1], [5, 3], [4, 4]];
const COINS: Cell[] = [[0, 0], [2, 1], [3, 2], [4, 0], [0, 2]];
const CLUSTER: Cell[] = [[2, 2], [3, 2], [3, 3], [4, 3], [3, 4], [2, 3], [4, 2], [5, 3]];
const STICKY: Cell[] = [[1, 1], [3, 0], [4, 2], [2, 2]];
const LOCKED: Cell[] = [[0, 1], [1, 3], [2, 0], [2, 2], [3, 1], [4, 3], [1, 0]];

function rowsOf(s: Schematic, reel: number) {
  return Array.isArray(s.rows) ? s.rows[reel] : s.rows;
}

/**
 * Technical reel-layout diagram shown in a — Análisis's specs. It documents the
 * grid (from our research data) and is never used as the game's cover.
 */
export function SlotPlate({
  artwork,
  name,
  aspect = "landscape",
  detail = "full",
  plateNo,
  className,
}: {
  artwork: SlotArtwork;
  name: string;
  aspect?: Aspect;
  detail?: "full" | "thumb";
  plateNo?: number;
  className?: string;
}) {
  const s = artwork.schematic;
  const field = "#151a22";
  const accent = artwork.palette.glow;
  const [W, H] = SIZE[aspect];
  const full = detail === "full";
  const paper = "#eef1f6";

  const maxRows = Array.isArray(s.rows) ? Math.max(...s.rows) : s.rows;
  const topBand = full ? 64 : 0;
  const bottomBand = full ? 92 : 0;
  const sideBand = full ? 72 : 0;
  const pad = full ? Math.min(W, H) * 0.06 : Math.min(W, H) * 0.1;
  const topReelH = s.topReel ? 0.7 : 0;
  const availW = W - 2 * pad - sideBand;
  const availH = H - 2 * pad - topBand - bottomBand;
  const c = Math.min(availW / s.reels, availH / (maxRows + topReelH));
  const gridW = c * s.reels;
  const gridH = c * maxRows;
  const gx = pad + sideBand + (availW - gridW) / 2;
  const gy = pad + topBand + (availH - gridH - c * topReelH) / 2 + c * topReelH;

  const cellRect = (reel: number, row: number) => {
    const n = rowsOf(s, reel);
    const h = gridH / n;
    return { x: gx + reel * c, y: gy + row * h, w: c, h };
  };
  const inGrid = ([r, row]: Cell) => r < s.reels && row < rowsOf(s, r);

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < s.reels; r++) {
    for (let row = 0; row < rowsOf(s, r); row++) {
      const { x, y, w, h } = cellRect(r, row);
      const locked = s.pattern === "respin";
      cells.push(
        <rect
          key={`c${r}-${row}`}
          x={x + 2}
          y={y + 2}
          width={w - 4}
          height={h - 4}
          fill={paper}
          fillOpacity={0.07}
          stroke={paper}
          strokeOpacity={locked ? 0.35 : 0.42}
          strokeDasharray={locked ? "4 5" : undefined}
          strokeWidth={1}
        />,
      );
    }
  }

  const overlay: React.ReactNode[] = [];
  const inset = (r: number, row: number, k = 0.16) => {
    const { x, y, w, h } = cellRect(r, row);
    return { x: x + w * k, y: y + h * k, w: w * (1 - 2 * k), h: h * (1 - 2 * k), cx: x + w / 2, cy: y + h / 2, cw: w, ch: h };
  };

  switch (s.pattern) {
    case "scatter": {
      SCATTER.filter(inGrid).forEach(([r, row], i) => {
        const b = inset(r, row, 0.2);
        overlay.push(<rect key={`s${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={accent} />);
      });
      [[1, 1], [5, 0]].filter((cell) => inGrid(cell as Cell)).forEach(([r, row], i) => {
        const b = inset(r, row);
        overlay.push(
          <g key={`m${i}`}>
            <circle cx={b.cx} cy={b.cy} r={Math.min(b.cw, b.ch) * 0.32} fill="none" stroke={paper} strokeWidth={2} />
            <text x={b.cx} y={b.cy} fill={paper} fontSize={Math.min(b.cw, b.ch) * 0.3} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-plex-mono)">×</text>
          </g>,
        );
      });
      break;
    }
    case "collect": {
      COINS.filter(inGrid).forEach(([r, row], i) => {
        const b = inset(r, row);
        overlay.push(<circle key={`k${i}`} cx={b.cx} cy={b.cy} r={Math.min(b.cw, b.ch) * 0.26} fill={accent} />);
      });
      const b = inset(1, 2, 0.22);
      overlay.push(<rect key="collector" x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={paper} strokeWidth={2.5} />);
      overlay.push(<path key="collector-hook" d={`M ${b.cx} ${b.y + b.h * 0.18} v ${b.h * 0.45} a ${b.w * 0.14} ${b.w * 0.14} 0 0 1 ${-b.w * 0.28} 0`} fill="none" stroke={paper} strokeWidth={2.5} />);
      break;
    }
    case "expand": {
      (s.focus ?? []).filter((r) => r < s.reels).forEach((r) => {
        const top = cellRect(r, 0);
        const h = gridH;
        overlay.push(<rect key={`e${r}`} x={top.x + 2} y={top.y + 2} width={c - 4} height={h - 4} fill={accent} />);
        overlay.push(<line key={`e${r}a`} x1={top.x + c / 2} y1={top.y + 14} x2={top.x + c / 2} y2={top.y + h - 14} stroke={field} strokeWidth={2} strokeDasharray="2 6" />);
        overlay.push(<path key={`e${r}b`} d={`M ${top.x + c / 2 - 8} ${top.y + 22} l 8 -8 l 8 8 M ${top.x + c / 2 - 8} ${top.y + h - 22} l 8 8 l 8 -8`} fill="none" stroke={field} strokeWidth={2} />);
      });
      break;
    }
    case "cluster": {
      CLUSTER.filter(inGrid).forEach(([r, row], i) => {
        const { x, y, w, h } = cellRect(r, row);
        overlay.push(<rect key={`g${i}`} x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill={accent} />);
      });
      break;
    }
    case "sticky": {
      STICKY.filter(inGrid).forEach(([r, row], i) => {
        const b = inset(r, row, 0.18);
        overlay.push(
          <g key={`p${i}`}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={accent} />
            <circle cx={b.x + b.w - 7} cy={b.y + 7} r={4} fill={field} />
          </g>,
        );
      });
      break;
    }
    case "respin": {
      LOCKED.filter(inGrid).forEach(([r, row], i) => {
        const b = inset(r, row, 0.12);
        overlay.push(<rect key={`l${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={accent} />);
      });
      break;
    }
    case "megaways": {
      const pts: string[] = [];
      for (let r = 0; r < s.reels; r++) {
        const row = Math.min(rowsOf(s, r) - 1, [1, 4, 1, 3, 2, 5][r] ?? 0);
        const b = inset(r, row);
        overlay.push(<rect key={`w${r}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={accent} />);
        pts.push(`${b.cx},${b.cy}`);
      }
      overlay.push(<polyline key="way" points={pts.join(" ")} fill="none" stroke={paper} strokeWidth={2} />);
      if (s.topReel) {
        for (let r = 1; r < s.reels - 1; r++) {
          overlay.push(
            <rect key={`t${r}`} x={gx + r * c + 2} y={gy - c * topReelH + 2} width={c - 4} height={c * topReelH - 6} fill={paper} fillOpacity={0.12} stroke={paper} strokeOpacity={0.6} />,
          );
        }
      }
      break;
    }
    case "line": {
      const pts = Array.from({ length: s.reels }, (_, r) => {
        const b = inset(r, Math.min(rowsOf(s, r) - 1, r % 2));
        return `${b.cx},${b.cy}`;
      });
      overlay.push(<polyline key="line" points={pts.join(" ")} fill="none" stroke={accent} strokeWidth={4} />);
      break;
    }
  }

  const reg = (x: number, y: number) => (
    <g key={`reg${x}-${y}`} stroke={paper} strokeOpacity={0.7} strokeWidth={1}>
      <circle cx={x} cy={y} r={7} fill="none" />
      <line x1={x - 12} y1={y} x2={x + 12} y2={y} />
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} />
    </g>
  );

  const dimsNote =
    s.dimsStatus === "verified" ? null : s.dimsStatus === "unsourced" ? "ILUSTRATIVO · DISEÑO SIN FUENTE VERIFICADA" : "† DIMENSIONES PENDIENTES DE VERIFICACIÓN";
  const rowsLabel = Array.isArray(s.rows) ? `${Math.min(...s.rows)}–${maxRows} FILAS · VARIABLES` : `${s.rows} FILAS`;
  const mono = { fontFamily: "var(--font-plex-mono)" } as const;
  const condensed = { fontFamily: "var(--font-archivo)", fontStretch: "72%" } as const;

  return (
    <figure className={cn("relative overflow-hidden", className)} style={{ backgroundColor: field }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" role="img" aria-label={`Diagrama de ${name}: ${s.reels} rodillos, ${Array.isArray(s.rows) ? "filas variables" : `${s.rows} filas`}. Elaborado por ${site.name}; no es material oficial del juego.`} preserveAspectRatio="xMidYMid slice">
        <rect width={W} height={H} fill={field} />
        {cells}
        {overlay}
        {full ? (
          <>
            {reg(26, 26)}
            {reg(W - 26, 26)}
            {reg(26, H - 26)}
            {reg(W - 26, H - 26)}
            <text x={48} y={pad + 22} fill={paper} fontSize={13} letterSpacing={2} style={mono}>
              {`${site.name.toUpperCase()} DIAGRAMA${plateNo ? ` Nº ${String(plateNo).padStart(2, "0")}` : ""}`}
            </text>
            <text x={W - 48} y={pad + 22} fill={paper} fontSize={13} letterSpacing={2} textAnchor="end" style={mono} opacity={0.85}>
              NO ES ARTE DEL JUEGO
            </text>
            {/* reel dimension */}
            <g stroke={paper} strokeOpacity={0.8}>
              <line x1={gx} y1={gy + gridH + 18} x2={gx + gridW} y2={gy + gridH + 18} />
              <line x1={gx} y1={gy + gridH + 12} x2={gx} y2={gy + gridH + 24} />
              <line x1={gx + gridW} y1={gy + gridH + 12} x2={gx + gridW} y2={gy + gridH + 24} />
              <line x1={gx - 18} y1={gy} x2={gx - 18} y2={gy + gridH} />
              <line x1={gx - 24} y1={gy} x2={gx - 12} y2={gy} />
              <line x1={gx - 24} y1={gy + gridH} x2={gx - 12} y2={gy + gridH} />
            </g>
            <text x={gx + gridW / 2} y={gy + gridH + 40} fill={paper} fontSize={13} letterSpacing={2} textAnchor="middle" style={mono}>
              {`${s.reels} RODILLOS`}
            </text>
            <text x={gx - 30} y={gy + gridH / 2} fill={paper} fontSize={13} letterSpacing={2} textAnchor="middle" style={mono} transform={`rotate(-90 ${gx - 30} ${gy + gridH / 2})`}>
              {rowsLabel}
            </text>
            <text x={48} y={H - pad - 4} fill={paper} fontSize={Math.min(46, W / 15)} fontWeight={780} style={condensed}>
              {name.toUpperCase()}
            </text>
            {dimsNote ? (
              <text x={W - 48} y={H - pad - 6} fill={accent} fontSize={11} letterSpacing={1.5} textAnchor="end" style={mono}>
                {dimsNote}
              </text>
            ) : null}
          </>
        ) : null}
      </svg>
    </figure>
  );
}
