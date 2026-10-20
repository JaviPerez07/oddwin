import type { Metadata, Viewport } from "next";
import { ConsentBanner, PageViewTracker } from "@/components/layout/analytics";
import { MarketProvider } from "@/components/layout/market-context";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/editorial/json-ld";
import { site } from "@/config/site";
import { getMarkets } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search-index";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { archivo, oswald, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — juegos de casino y producción creativa`, template: `%s · ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0d1015",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [markets, searchIndex] = await Promise.all([getMarkets(), buildSearchIndex()]);
  const marketOptions = markets.map((m) => ({ code: m.code, name: m.countryName, minimumAge: m.minimumLegalAge.value }));

  return (
    <html
      lang={site.locale}
      className={`${archivo.variable} ${oswald.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <MarketProvider options={marketOptions}>
          <SiteHeader searchIndex={searchIndex} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MarketProvider>
        <PageViewTracker />
        <ConsentBanner />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
