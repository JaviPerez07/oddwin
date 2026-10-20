"use client";

import Image from "next/image";
import { useState } from "react";

/** Blurred backdrop taken from official art; silently disappears if the file fails to load. */
export function AmbientArt({ src, className }: { src: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image aria-hidden alt="" src={src} fill sizes="10vw" onError={() => setFailed(true)} className={className} />;
}
