import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${site.name} — Inicio`}>
      <span className="relative size-10 overflow-hidden rounded-full bg-canvas-2 ring-1 ring-commercial/40 transition-colors group-hover:ring-commercial" aria-hidden>
        <Image src="/brand/oddwin-studios-logo.jpg" alt="" width={1024} height={1024} sizes="200px" className="absolute max-w-none object-cover" style={{ width: "250%", height: "250%", left: "-75%", top: "-49%" }} />
      </span>
      <span className="leading-none">
        <span className="headline block text-[1.15rem] tracking-[0.04em]">ODDWIN</span>
        <span className="mt-1 block text-[0.55rem] font-semibold tracking-[0.34em] text-commercial">STUDIOS</span>
      </span>
    </Link>
  );
}
