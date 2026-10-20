/**
 * Central brand + site configuration. Rename here and every header, footer,
 * metadata and JSON-LD block follows.
 */
export const site = {
  name: "OddWin Studios",
  /** Company that publishes the site. */
  publisher: "OddWin Studios",
  tagline: "Juegos de casino originales y producción cinematográfica para editores y operadores.",
  shortTagline: "Juegos de casino y producción creativa",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://oddwinstudios.com").replace(/\/$/, ""),
  locale: "es",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "partnership@oddwinstudios.com",
  social: [] as { label: string; url: string }[],
  /** Unpublished (pending_review) reviews are visible but carry noindex. */
  showPendingReviews: true,
  nav: [
    { href: "/services", label: "Servicios" },
    { href: "/games", label: "Nuestros juegos" },
    { href: "/slots", label: "Revista de slots" },
    { href: "/casinos", label: "Directorio de casinos" },
  ],
} as const;

export type SiteConfig = typeof site;
