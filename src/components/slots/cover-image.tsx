"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LicensedArt } from "@/types/slot";

/**
 * Official image with a runtime safety net: if the file fails to load (moved,
 * deleted, CDN error), the provided fallback renders instead of a broken image.
 */
export function CoverImage({
  art,
  sizes,
  preload,
  zoom,
  showCredit,
  fallback,
}: {
  art: LicensedArt;
  sizes: string;
  preload?: boolean;
  zoom?: boolean;
  showCredit?: boolean;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <>
      <Image
        src={art.src}
        alt={art.alt}
        fill
        sizes={sizes}
        preload={preload}
        onError={() => setFailed(true)}
        className={cn(
          art.fit === "cover" ? "object-cover" : "object-contain",
          zoom && "transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]",
        )}
      />
      {showCredit ? (
        <span className="absolute bottom-1.5 right-1.5 max-w-[90%] truncate rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white/85" data-testid="art-credit">
          {art.attribution ?? `© ${art.credit}`}
        </span>
      ) : null}
    </>
  );
}
