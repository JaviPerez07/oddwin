import localFont from "next/font/local";

/*
 * Self-hosted, OFL-1.1 fonts (via Fontsource):
 *  - Archivo (variable width + weight): one family for UI, reading text and
 *    display. Display sizes use a slightly expanded, heavy cut for a
 *    contemporary game-product voice; body text stays at normal width.
 *  - IBM Plex Mono: figures (RTP, multipliers) and reference codes.
 */
export const archivo = localFont({
  src: "../fonts/Archivo-latin-wdth.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const oswald = localFont({
  src: "../fonts/Oswald.woff2",
  variable: "--font-oswald",
  weight: "200 700",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});
