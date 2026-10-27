// Clean English gameplay for the website, frame by frame with a virtual clock (Playwright Clock: rAF, timers and
// performance.now advance exactly 1/fps per frame), so a busy machine can never drop or stutter a frame.
// For the OBSIDIAN engine family (Obsidian, Vice Miami Spin): showcase mode with one real engine fixture per run.
//   node capture_showcase.mjs <port> <fixture> <out.mp4> [fps=30]
// The game's dev server must be running. Writes <out>.json with the controller state per frame (to cut loops).
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [port, fixture, out, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg ?? 30), STEP = 1000 / fps;
const require = createRequire('/Users/javiperezz7/Projects/obsidian-vault/game/');
const { chromium } = require('playwright-core');
const dir = out.replace(/\.mp4$/, '_frames/');
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.clock.install({ time: new Date('2026-10-27T12:00:00Z') });
await page.goto(`http://127.0.0.1:${port}/?lang=en&seq=${fixture}`);
const tick = async (ms) => { await page.clock.runFor(ms); await page.waitForTimeout(5); };
for (let i = 0; i < 600 && !(await page.isVisible('#enter-showcase')); i++) await tick(100);
await page.evaluate(() => document.fonts.ready);
await page.click('#enter-showcase');
const state = () => page.evaluate(() => window.__obs.ctl.state);
for (let i = 0; i < 400 && (await state()) !== 'idle'; i++) await tick(50);

let n = 0;
const states = [];
const frame = async () => {
  await page.clock.runFor(STEP);
  await page.screenshot({ path: `${dir}${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  states.push(await state());
};
for (let i = 0; i < fps * 1.0; i++) await frame();            // a second of the idle scene before the spin
await page.click('#spin');
let guard = 0;
while (guard++ < fps * 240) {
  await frame();
  if (await page.isVisible('#sum-close')) { for (let i = 0; i < fps * 2; i++) await frame(); await page.click('#sum-close'); }
  if (states.at(-1) === 'idle' && states.length > fps * 2) break;
}
for (let i = 0; i < fps * 1.5; i++) await frame();            // tail
await browser.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${dir}%05d.jpg`, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
writeFileSync(out.replace(/\.mp4$/, '.json'), JSON.stringify({ port, fixture, fps, frames: n, seconds: +(n / fps).toFixed(2), errors, states }, null, 0));
console.log(JSON.stringify({ out, frames: n, seconds: +(n / fps).toFixed(2), errors }));
