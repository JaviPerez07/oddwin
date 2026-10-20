"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function SlotViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track("slot_view", { slot: slug });
  }, [slug]);
  return null;
}
