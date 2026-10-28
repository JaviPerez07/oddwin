// Clean English gameplay of FRUTIGER EDEN for the website, frame by frame with a virtual clock, so a busy machine can
// never drop or stutter a frame. Adapted from capture_showcase.mjs and the game's own trailer/tools/capture_eden.mjs.
// Playwright Clock (installed, then paused so only runFor() moves it) fakes timers, rAF, Date and performance.now
// (Pixi ticks exactly 1/fps per frame). Eden also draws
// overlays with CSS transitions and Web Animations, which run on the real clock: every animation is paused when it
// appears and seeked by hand 1/fps per frame (finish() at its end, because the game awaits some .finished promises).
// (Chrome virtual time via CDP was tried first: rAF timestamps stay on the real clock, so Pixi ran 2-5x too fast.)
//   node capture_eden.mjs <scene> [--max 70] [--tail 1.5] [--lead 1.0] [--out clips/eden_<scene>.mp4]
// scene = a fixed dev-only round from the game's src/fixtures.json (grand, lagoon-bote, aqua-nova, collect, cascada…).
// The game's dev server must be running on 127.0.0.1:5190. Read-only: it never edits the game.
// Writes <out>.mp4 (1920×1080, CRF 14), <out>_contact.jpg (1 frame per second) and <out>.json (phase per frame).
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [scene, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.reduce((acc, v, i, arr) => (v.startsWith('--') ? [...acc, [v.slice(2), arr[i + 1]]] : acc), []));
const fps = 30, STEP = 1000 / fps, maxS = +(opt.max ?? 70), tailS = +(opt.tail ?? 1.5), leadS = +(opt.lead ?? 1.0);
const here = new URL('.', import.meta.url).pathname;
const out = opt.out ?? `${here}clips/eden_${scene}.mp4`;
const dir = out.replace(/\.mp4$/, '_frames/');
const require = createRequire('/Users/javiperezz7/Projects/obsidian-vault/game/');
const { chromium } = require('playwright-core');
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--mute-audio'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: 'en-GB' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date('2026-10-27T12:00:00Z') });
await page.goto(`http://127.0.0.1:5190/?seq=${scene}&lang=en`);
// install() leaves the fake clock flowing with real time; pause it so only runFor() moves it (else slow screenshots speed the game up)
await page.clock.pauseAt(new Date('2026-10-27T12:00:02Z'));
const tick = async (ms) => { await page.clock.runFor(ms); await page.waitForTimeout(5); };
for (let i = 0; i < 300 && !(await page.evaluate(() => !!window.__eden)); i++) await tick(100);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
for (let i = 0; i < 15; i++) await tick(100);
// "<SCENE> selected scene, seed N" is a dev/QA label, not part of the game: keep it off the website footage
await page.addStyleTag({ content: '#showcaseBadge{display:none!important}' });
// CSS transitions/animations run on the real clock: pause each one when it appears and seek it by hand, 1/fps per frame
const cssStep = (ms) => page.evaluate((ms) => {
  for (const a of document.getAnimations()) {
    if (a.playState === 'finished') continue;
    if (!a.__v) { a.__v = 1; a.pause(); }
    const t = (Number(a.currentTime) || 0) + ms * (a.playbackRate || 1), end = a.effect?.getComputedTiming().endTime;
    // a paused animation never resolves .finished, and the game awaits some of them (AQUA NOVA / PEARL LAGOON intros)
    if (Number.isFinite(end) && t >= end) a.finish(); else a.currentTime = t;
  }
}, ms);
const step = async () => { await page.clock.runFor(STEP); await cssStep(STEP); };

let f = 0, started = false, endAt = Infinity, summaryAt = 0;
const marks = [], phases = [];
let last = '';
while (f < maxS * fps && f < endAt) {
  await step();
  if (!started && f >= leadS * fps) { started = true; await page.evaluate(() => { void window.__eden.spin(); }); }
  const st = await page.evaluate(() => { const s = window.__eden.state(); return { phase: s.phase, busy: s.busy, rounds: s.rounds, tier: s.tier, summary: document.getElementById('summary').open }; });
  const key = st.phase + (st.tier ? `-${st.tier}` : '') + (st.summary ? '+summary' : '');
  phases.push(key);
  if (key !== last) { marks.push({ f, t: +(f / fps).toFixed(3), phase: key }); last = key; }
  if (st.summary && !summaryAt) summaryAt = f;
  if (summaryAt && f === summaryAt + Math.round(2.5 * fps)) await page.evaluate(() => document.getElementById('sumClose').click());
  if (started && !st.busy && st.rounds > 0 && endAt === Infinity) endAt = f + Math.round(tailS * fps);
  await page.screenshot({ path: `${dir}${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  f++;
}
const result = await page.evaluate(() => ({ total: window.__eden.last?.total, tier: window.__eden.last?.tier, lang: document.documentElement.lang }));
await browser.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${dir}%05d.jpg`, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${dir}%05d.jpg`, '-vf', `select='not(mod(n\\,30))',scale=320:-1,tile=6x${Math.ceil(f / 30 / 6)}`, '-frames:v', '1', out.replace(/\.mp4$/, '_contact.jpg')]);
rmSync(dir, { recursive: true, force: true });
writeFileSync(out.replace(/\.mp4$/, '.json'), JSON.stringify({ scene, fps, frames: f, seconds: +(f / fps).toFixed(2), spinAt: leadS, result, errors, marks, phases }, null, 0));
console.log(JSON.stringify({ out, seconds: +(f / fps).toFixed(2), ...result, errors: errors.length }));
