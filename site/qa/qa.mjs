// QA del sitio servido (node serve.mjs): solapes texto-texto y texto-imagen, texto cortado, scroll horizontal,
// errores de consola o CSP, recursos que fallan; y las redirecciones 301 de las rutas retiradas.
// node qa/qa.mjs [ruta ...]   → qa/shots/<ruta>_<w>x<h>.png + informe
import { createRequire } from 'node:module';
const require = createRequire('/Users/javiperezz7/Projects/page-breaker/game/');
const { chromium } = require('playwright-core');
const dir = new URL('.', import.meta.url).pathname;
const base = process.env.BASE || 'http://localhost:5310';
import { mkdirSync } from 'node:fs'; mkdirSync(dir + 'shots', { recursive: true });
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/games/page-breaker', '/games/obsidian', '/games/aura', '/games/vice-miami-spin', '/legal', '/privacy', '/nope'];
const sizes = [[1000, 520], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [820, 1180], [390, 844], [360, 740]];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let bad = 0;
for (const f of pages) for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  const errs = [];
  p.on('console', (m) => { if (m.type() === 'error' && !(f === '/nope' && /404/.test(m.text()))) errs.push('consola: ' + m.text().slice(0, 120)); });
  p.on('pageerror', (e) => errs.push('js: ' + String(e).slice(0, 120)));
  p.on('requestfailed', (q) => { if (!/\.mp4$/.test(q.url())) errs.push('falla: ' + q.url()); });
  p.on('response', (q) => { if (q.status() >= 400 && !q.url().endsWith('/nope')) errs.push(`${q.status()}: ${q.url()}`); });
  await p.goto(base + f, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = [];
    const leaves = [...document.querySelectorAll('body *')].filter((el) => {
      if (el.closest('[data-qa-ignore]')) return false;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const st = getComputedStyle(el);
      return own && st.visibility !== 'hidden' && st.opacity !== '0' && el.getClientRects().length;
    });
    const boxes = leaves.map((el) => {
      const rg = document.createRange(); rg.selectNodeContents(el);
      return { el, r: rg.getBoundingClientRect(), t: el.textContent.trim().slice(0, 28) };
    }).filter((x) => x.r.width > 2 && x.r.height > 2);
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j];
      if (a.el.contains(c.el) || c.el.contains(a.el)) continue;
      const ix = Math.min(a.r.right, c.r.right) - Math.max(a.r.left, c.r.left);
      const iy = Math.min(a.r.bottom, c.r.bottom) - Math.max(a.r.top, c.r.top);
      if (ix > 3 && iy > 3) out.push(`solape: «${a.t}» × «${c.t}»`);
    }
    // texto encima de imágenes o vídeos (logo, fotogramas), salvo rótulos que viven dentro de su figura a propósito
    const media = [...document.querySelectorAll('img, video')].filter((m) => !m.hasAttribute('data-qa-deco') && m.getClientRects().length).map((m) => ({ m, r: m.getBoundingClientRect() }));
    for (const x of boxes) {
      if (x.el.closest('figure, .player, .plate, .still')) continue;
      for (const { m, r } of media) {
        if (m.contains(x.el)) continue;
        const ix = Math.min(x.r.right, r.right) - Math.max(x.r.left, r.left);
        const iy = Math.min(x.r.bottom, r.bottom) - Math.max(x.r.top, r.top);
        if (ix > 3 && iy > 3) out.push(`texto sobre imagen: «${x.t}» × ${m.tagName.toLowerCase()} ${(m.getAttribute('src') || m.dataset.src || '').split('/').pop()}`);
      }
    }
    for (const x of boxes) if (x.r.right > innerWidth + 1 || x.r.left < -1) out.push(`cortado: «${x.t}»`);
    if (document.documentElement.scrollWidth > innerWidth) out.push(`scroll horizontal ${document.documentElement.scrollWidth}`);
    return out;
  });
  r.push(...errs);
  const name = `${(f.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home')}_${w}x${h}`;
  await p.screenshot({ path: `${dir}shots/${name}.png` });
  if (r.length) { bad += r.length; console.log(`✗ ${name}\n   ${[...new Set(r)].slice(0, 8).join('\n   ')}`); } else console.log(`✓ ${name}`);
  await p.close();
}
await b.close();
// redirecciones: cada ruta retirada responde 301 (nunca 200) y su destino existe
const { readFileSync } = await import('node:fs');
for (const line of readFileSync(new URL('../dist/_redirects', import.meta.url), 'utf8').split('\n').filter((l) => l && !l.startsWith('#'))) {
  const [from, to] = line.split(/\s+/), probe = from.replace('*', 'x');
  const r1 = await fetch(base + probe, { redirect: 'manual' });
  const r2 = await fetch(base + to.split('#')[0]);
  if (r1.status !== 301 || r1.headers.get('location') !== to || r2.status !== 200) { bad++; console.log(`✗ redirección ${probe} → ${r1.status} ${r1.headers.get('location')} (destino ${r2.status})`); }
}
for (const [u, code] of [['/', 200], ['/games/aura', 200], ['/legal', 200], ['/games/aura.html', 308], ['/nope', 404]]) {
  const r = await fetch(base + u, { redirect: 'manual' }); if (r.status !== code) { bad++; console.log(`✗ ${u} → ${r.status}, esperaba ${code}`); }
}
console.log(bad ? `\n${bad} problemas` : '\nSin solapes, cortes ni scroll horizontal');
