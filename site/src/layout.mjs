// Page shell: head (meta, canonical, Open Graph, JSON-LD written into the HTML), header, footer.
import { site, nav } from '../data/site.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

export function page({ path, title, description, css = [], body, schema = [], image = '/media/reel.jpg', noindex = false }) {
  const url = site.origin + (path === '/' ? '/' : path);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.origin}${image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#07080B">
<link rel="icon" href="/img/brand/oddwin_mono.png" type="image/png">
<link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/oddwin.css">
${css.map((c) => `<link rel="stylesheet" href="${c}">`).join('\n')}
${schema.map((s) => `<script type="application/ld+json">${json(s)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap">
  <a class="logo" href="/"><img src="/img/brand/oddwin_wordmark.png" alt="ODDWIN Studios" width="108" height="28"></a>
  <nav aria-label="Main">${nav.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <a class="access" href="/#contact">Request a private demo →</a>
</div></header>
<main id="main">
${body}
</main>
<footer><div class="wrap">
  <div>
  <p>ODDWIN Studios presents its games to businesses only. The games are playable and available for evaluation; their math is calculated and simulated, not yet certified by a test lab. Demos use fictional credits — no real-money play. 18+.</p>
  <p class="links"><a href="/legal">Legal notice</a><a href="/privacy">Privacy</a>${site.demoLive ? `<a href="${site.demoOrigin}/">Invited? Open your private demo</a>` : ''}</p>
  </div>
  <span class="seal mono"><img src="/img/brand/oddwin_mono.png" alt="" width="34" height="35"><span>© ${site.year} ODDWIN Studios</span></span>
</div></footer>
<dialog class="film" aria-label="Trailer"><video controls playsinline></video><div class="bar"><span class="mono"></span><button class="close" type="button">Close</button></div></dialog>
<script src="/js/site.js" defer></script>
</body>
</html>
`;
}

export const organization = () => ({
  '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.origin + '/',
  logo: site.origin + '/img/brand/oddwin_mono.png', email: site.email, description: site.description,
});

export const breadcrumbs = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.origin + path })),
});
