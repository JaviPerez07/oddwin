// QA de maquetas: solapes texto-texto, texto cortado por la ventana y scroll horizontal, a varios tamaños.
// node qa_overlap.mjs [pagina.html ...]   → shots/qa/<pagina>_<w>x<h>.png + informe
import { createRequire } from 'node:module';
const require = createRequire('/Users/javiperezz7/Projects/page-breaker/game/');
const { chromium } = require('playwright-core');
const dir = new URL('.', import.meta.url).pathname;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['a_home.html', 'a_game.html', 'a_game_obsidian.html', 'b_home.html', 'b_game.html'];
const sizes = [[1000, 520], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [820, 1180], [390, 844], [360, 740]];
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
let bad = 0;
for (const f of pages) for (const [w, h] of sizes) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await p.goto(`file://${dir}${f}`, { waitUntil: 'networkidle' });
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
  const name = `${f.replace('.html', '')}_${w}x${h}`;
  await p.screenshot({ path: `${dir}shots/qa/${name}.png` });
  if (r.length) { bad += r.length; console.log(`✗ ${name}\n   ${[...new Set(r)].slice(0, 8).join('\n   ')}`); } else console.log(`✓ ${name}`);
  await p.close();
}
await b.close();
console.log(bad ? `\n${bad} problemas` : '\nSin solapes, cortes ni scroll horizontal');
