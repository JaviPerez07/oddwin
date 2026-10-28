// DEAD AIR — CHANNEL 13 (DA13-N1): clean English 1920px gameplay captures for the website, frame by frame.
// The game's own capture clock (?capture=1) only advances with __da.step(ms): no dropped frames, deterministic.
// Needs the game's dev server (npm run dev in dead-air/game, port 5413) because __daqa (fixtures) is dev-only.
//   node capture_da.mjs <outName> <fixture[,fixture...]|idle> [preroll_s] [tail_s] [gap_s]
// Soft mode (default, no ?intense=1). Writes clips/<outName>.mp4 (CRF 14) + clips/<outName>.json (cues), deletes frames.
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const require = createRequire('/Users/javiperezz7/Projects/dead-air-n1/dead-air/game/package.json');
const { chromium } = require('playwright-core');
const [outName, fixtureList = 'card', pre = '1.0', tail = '1.5', gap = '0.6'] = process.argv.slice(2);
const FPS = 30, DT = 1000 / FPS, W = 1920, H = 1080;
const URL_ = process.env.DA_URL ?? 'http://127.0.0.1:5413';
const EXE = process.env.QA_BROWSER ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const here = new URL('.', import.meta.url).pathname, clips = here + 'clips/', frames = `${clips}${outName}_frames/`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`${URL_}/?capture=1&lang=en`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__da?.ready && window.__daqa, null, { timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
let n = 0;
const shot = async () => {
  await page.evaluate(async (dt) => { window.__da.step(dt); await new Promise((r) => setTimeout(r, 0)); await new Promise((r) => setTimeout(r, 0)); }, DT);
  await page.screenshot({ path: `${frames}${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 });
};
const marks = [];
for (let i = 0; i < Math.round(+pre * FPS); i++) await shot();
if (fixtureList !== 'idle') {
  for (const [k, f] of fixtureList.split(',').entries()) {
    if (k) for (let i = 0; i < Math.round(+gap * FPS); i++) await shot();
    marks.push({ fixture: f, frame: n, t: n / FPS });
    const ok = await page.evaluate((id) => window.__daqa.play(id), f);
    if (!ok) throw new Error('play failed: ' + f);
    for (let i = 0; i < 90 * FPS; i++) { await shot(); if (i > 10 && !(await page.evaluate(() => window.__daqa.busy()))) break; }
  }
}
for (let i = 0; i < Math.round(+tail * FPS); i++) await shot();
const cues = await page.evaluate(() => window.__da.cues);
const text = await page.evaluate(() => document.body.innerText);
await browser.close();
const out = `${clips}${outName}.mp4`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', frames + '%05d.jpg', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-movflags', '+faststart', out]);
writeFileSync(`${clips}${outName}.json`, JSON.stringify({ fixtures: fixtureList, frames: n, fps: FPS, marks, cues, domText: text, errors }, null, 1));
if (!process.env.KEEP_FRAMES) rmSync(frames, { recursive: true, force: true });
console.log(JSON.stringify({ outName, frames: n, seconds: n / FPS, marks, errors }));
