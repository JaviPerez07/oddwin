// Clean English gameplay of BAR & CIGAR BONANZA for the website, frame by frame with a virtual clock (Playwright
// Clock: rAF, timers and performance.now advance exactly 1/fps per frame), so no frame can be dropped.
// The game's dev server must be running on :5180 (?seed is a dev-only surface). One seeded first spin per run.
//   node capture_bc.mjs <seed> <out.mp4> [maxSeconds=40] [fps=30]
// Writes <out>.json with the game state per frame (to cut loops); the JPEG frame folder is deleted after encoding.
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [seed, out, maxArg, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg ?? 30), STEP = 1000 / fps, maxFrames = Number(maxArg ?? 40) * fps;
const require = createRequire('/Users/javiperezz7/Projects/obsidian-vault/game/');
const { chromium } = require('playwright-core');
const dir = out.replace(/\.mp4$/, '_frames/');
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.clock.install({ time: new Date('2026-10-27T20:00:00Z') });
await page.goto(`http://127.0.0.1:5180/?lang=en&seed=${seed}&nohelp=1&capture=1`);
for (let i = 0; i < 600; i++) {
  if (await page.evaluate(() => window.__bcb?.state().phase === 'idle')) break;
  await page.clock.runFor(100);
  await page.waitForTimeout(20);
}
await page.evaluate(() => document.fonts.ready);
await page.clock.runFor(1500);
await page.clock.pauseAt(new Date('2026-10-27T20:10:00Z'));
const state = () => page.evaluate(() => window.__bcb.state());

let n = 0;
const states = [];
const frame = async () => {
  await page.clock.runFor(STEP);
  await page.screenshot({ path: `${dir}${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  const s = await state();
  states.push(`${s.busy ? 'B' : '-'}${s.phase}`);
};
for (let i = 0; i < fps * 1.0; i++) await frame();            // a second of the idle scene before the spin
await page.evaluate(() => { void window.__bcb.spin(); });      // not awaited: time only moves as frames are taken
let idleRun = 0;
while (n < maxFrames) {
  await frame();
  const s = states.at(-1);
  idleRun = s === '-idle' ? idleRun + 1 : 0;
  if (idleRun >= fps * 1.5 && n > fps * 3) break;              // 1.5 s of calm tail after the round ends
}
const live = await page.evaluate(() => window.__bcb.live());
await browser.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${dir}%05d.jpg`, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
rmSync(dir, { recursive: true, force: true });
writeFileSync(out.replace(/\.mp4$/, '.json'), JSON.stringify({ seed: Number(seed), fps, frames: n, seconds: +(n / fps).toFixed(2), errors, live, states }, null, 0));
console.log(JSON.stringify({ out, frames: n, seconds: +(n / fps).toFixed(2), errors, live }));
