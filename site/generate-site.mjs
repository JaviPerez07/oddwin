#!/usr/bin/env node
// ODDWIN Studios · static site generator. Edit data/ and src/, never dist/.
//   node generate-site.mjs            → dist/ (draft: legal gaps allowed, marked on the page)
//   node generate-site.mjs --release  → fails if any legal field is still empty
// Output is plain HTML/CSS for Cloudflare Pages: clean URLs (file.html served as /file), 301-only redirects.
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, retired } from './data/site.mjs';
import { games } from './data/games.mjs';
import { home } from './src/home.mjs';
import { room } from './src/room.mjs';
import { legal, privacy, notFound } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const staticDir = join(root, 'static'), out = join(root, 'dist');
const release = process.argv.includes('--release');

const missing = Object.entries(site.legal).filter(([k, v]) => v == null && k !== 'registry').map(([k]) => k);
if (release && missing.length) { console.error(`✗ --release: legal data missing (${missing.join(', ')}) in data/site.mjs`); process.exit(1); }

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(staticDir, out, { recursive: true });

const write = (rel, html) => { const f = join(out, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
const pages = [['/', 'index.html', home()], ['/legal', 'legal.html', legal()], ['/privacy', 'privacy.html', privacy()]];
for (const g of games) pages.push([`/games/${g.slug}`, `games/${g.slug}.html`, room(g, staticDir)]);
for (const [, file, html] of pages) write(file, html);
write('404.html', notFound());

// Per-game accent (status dot, capture tag) as a stylesheet, so the CSP can forbid inline styles.
write('css/accents.css', '/* generated from data/games.mjs */\n' + games.map((g) => `[data-game="${g.slug}"] { --c: ${g.accent}; }`).join('\n') + '\n.title.pending { --c: #6E6A62; }\n');

write('_redirects', '# Retired routes from the first (affiliate) concept. 301 only, never 200.\n' + retired.map(([a, b]) => `${a} ${b} 301`).join('\n') + '\n');
write('_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
https://:project.pages.dev/*
  X-Robots-Tag: noindex
https://:version.:project.pages.dev/*
  X-Robots-Tag: noindex
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/media/*
  Cache-Control: public, max-age=604800
/video/*
  Cache-Control: public, max-age=604800
`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /*?q=*\nDisallow: /*?s=*\n\nSitemap: ${site.origin}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([p]) => `  <url><loc>${site.origin}${p}</loc></url>`).join('\n')}\n</urlset>\n`);

// Checks: every local reference resolves to a file, no file is over the Pages limit (25 MiB), no inline styles (CSP).
const errors = [];
const walk = (d) => readdirSync(d).flatMap((n) => { const f = join(d, n); return statSync(f).isDirectory() ? walk(f) : [f]; });
const files = walk(out);
for (const f of files) if (statSync(f).size > 25 * 1024 * 1024) errors.push(`over 25 MiB: ${f.slice(out.length)}`);
const resolve = (u) => { const p = u.split(/[?#]/)[0]; if (!p || p === '/') return 'index.html'; const c = p.replace(/^\//, ''); return existsSync(join(out, c)) && statSync(join(out, c)).isFile() ? c : `${c}.html`; };
for (const f of files.filter((f) => /\.(html|css)$/.test(f))) {
  const src = readFileSync(f, 'utf8'), rel = f.slice(out.length);
  for (const m of src.matchAll(/(?:href|src|data-src|data-film|data-poster|poster)="(\/[^"]*)"|url\((\/[^)]*)\)/g)) {
    const u = m[1] || m[2];
    if (!existsSync(join(out, resolve(u)))) errors.push(`${rel}: broken ${u}`);
  }
  if (rel.endsWith('.html') && /\sstyle="/.test(src)) errors.push(`${rel}: inline style (blocked by CSP)`);
  if (rel.endsWith('.html') && /<script>(?!\s*$)/.test(src.replace(/<script type="application\/ld\+json">/g, ''))) errors.push(`${rel}: inline script (blocked by CSP)`);
}
const size = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(`${pages.length + 1} pages · ${files.length} files · ${(size / 1048576).toFixed(1)} MB → dist/`);
if (missing.length) console.log(`! draft: legal data pending (${missing.join(', ')}) — shown as gaps on /legal and /privacy`);
if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
console.log('✓ links, assets, file sizes and CSP checks pass');
