import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { siteEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (siteEnv !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/", "/*?q=", "/*?*provider=", "/*?*mechanic=", "/*?*volatility=", "/*?*sort=", "/*?*view="] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
