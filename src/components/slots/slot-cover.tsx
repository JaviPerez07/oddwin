import { MechanicGlyph } from "@/components/editorial/mechanic-glyph";
import { cn } from "@/lib/utils";
import type { Mechanic, SlotArtwork } from "@/types/slot";
import { CoverImage } from "./cover-image";

type Aspect = "16/9" | "4/3" | "1/1";

/**
 * Cover for a slot, from the asset registry (one source of truth):
 *  - surface "hero" uses `artwork.licensed` (key art), "card" uses `artwork.card`
 *    (thumbnail, else key art) — each already passed lib/assets.ts#canDisplay.
 *  - Official art is always credited; it is cropped only when the licence
 *    allows modification, otherwise shown whole on a neutral ground.
 *  - Without displayable art: a plain typographic panel (name, studio, colour
 *    hairline, conceptual mechanic glyph). It imitates no artwork and needs no
 *    visitor-facing label; `data-cover` marks it for QA.
 */
export function SlotCover({
  artwork,
  name,
  provider,
  surface = "card",
  aspect = "4/3",
  size = "md",
  priority,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className,
  zoomOnHover = true,
  mechanic,
}: {
  artwork: SlotArtwork;
  name: string;
  provider?: string;
  surface?: "hero" | "card";
  aspect?: Aspect;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  sizes?: string;
  className?: string;
  zoomOnHover?: boolean;
  /** Primary mechanic: drawn as a small conceptual glyph on the placeholder. */
  mechanic?: Mechanic;
}) {
  const art = surface === "hero" ? artwork.licensed : (artwork.card ?? null);
  const { palette } = artwork;

  const placeholder = (
    <div
      role="img"
      aria-label={`${name}${provider ? ` de ${provider}` : ""}`}
      className={cn(
        "@container absolute inset-0 flex flex-col justify-end bg-surface-2 ring-1 ring-inset ring-line transition-colors duration-300",
        zoomOnHover && "group-hover:bg-surface-3",
      )}
      data-cover="placeholder"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: palette.base }} />
      {mechanic && size !== "sm" ? <MechanicGlyph mechanic={mechanic} className="absolute left-[6cqw] top-[6cqw] size-[16cqw] max-h-14 max-w-14 text-fg-3/70" /> : null}
      <div className={cn(size === "sm" ? "p-3" : "p-[7cqw]")}>
        {provider && size !== "sm" ? <p className="text-[clamp(0.65rem,3.4cqw,0.85rem)] font-medium text-fg-3">{provider}</p> : null}
        <p
          className={cn("font-semibold leading-[1.1] tracking-[-0.015em] text-fg/90", size === "sm" ? "text-sm" : "mt-[1.5cqw]")}
          style={size === "sm" ? undefined : { fontSize: size === "lg" ? "clamp(1.4rem, 6cqw, 3rem)" : "clamp(1.05rem, 8cqw, 1.9rem)" }}
        >
          {name}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl bg-surface-2", className)}
      style={{ aspectRatio: aspect }}
      data-cover={art ? (art.isTestData ? "official-test" : "official") : "placeholder-frame"}
      data-surface={surface}
    >
      {art ? <CoverImage art={art} sizes={sizes} preload={priority} zoom={zoomOnHover && art.fit === "cover"} showCredit={size !== "sm"} fallback={placeholder} /> : placeholder}
    </div>
  );
}
