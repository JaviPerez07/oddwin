"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("relative rounded-md px-3 py-2 text-[0.78rem] font-semibold tracking-[0.015em] transition-colors after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-commercial after:transition-transform", active ? "text-white after:scale-x-100" : "text-fg-3 hover:text-white hover:after:scale-x-100")}
    >
      {children}
    </Link>
  );
}
