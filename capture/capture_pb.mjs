// Copy of page-breaker/game/tools/capture.mjs for the website: English UI, output to ./clips/pb_<shot>.mp4.
// Captura de planos del juego REAL para el tráiler, fotograma a fotograma y determinista: se detiene el reloj de Pixi y se
// avanza exactamente 1/fps por fotograma (nada de grabar la pantalla: sin tirones ni compresión). Contra npm run dev.
// node tools/capture.mjs <plano> [fps] [v]   → ../trailer/clips/<plano>[_v].mp4 (H.264, CRF 14); v = vertical 1080×1920
// Planos: title · reveal · rip · fight · fs  (semillas elegidas por su momento; ver SHOTS)
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const { chromium } = createRequire('/Users/javiperezz7/Projects/page-breaker/game/')('playwright-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://127.0.0.1:5295/?lang=en';
const SHOTS = {
  title: { frames: 90 },                                                  // portada
  reveal: { seed: 'tr-8172', lineBet: 2, frames: 330 },                    // viñetas → Rip, 25×
  rip: { seed: 'tr-7', lineBet: 2, frames: 420 },                          // Rip arranca la página, 29×
  fight: { seed: 'tr-882', lineBet: 2, frames: 1500, attack: 'safe' },    // escalera completa hasta el K.O.
  fs: { seed: 'tr-379', lineBet: 2, buy: true, frames: 2600 },             // Director's Cut nivel 3, 150×
};
const name = process.argv[2], fps = +(process.argv[3] ?? 30);
const vertical = process.argv[4] === 'v';
const tag = name + (vertical ? '_v' : '');
const VIEW = vertical ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const shot = SHOTS[name];
if (!shot) { console.error('plano desconocido:', name, Object.keys(SHOTS)); process.exit(1); }
const DIR = new URL(`clips/pb_${tag}_frames/`, import.meta.url).pathname;
const OUT = new URL(`clips/`, import.meta.url).pathname;
rmSync(DIR, { recursive: true, force: true }); mkdirSync(DIR, { recursive: true }); mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1 })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(BASE);
await page.waitForSelector('#start', { state: 'visible', timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
// reloj manual: a partir de aquí el juego solo avanza cuando lo pedimos
await page.evaluate(() => { const tk = window.__pb.scene.app.ticker; tk.autoStart = false; tk.stop(); window.__T = performance.now(); tk.update(window.__T); });
const step = () => page.evaluate((dt) => { window.__T += dt; window.__pb.scene.app.ticker.update(window.__T); }, 1000 / fps);

if (name !== 'title') {
  await page.evaluate(() => document.getElementById('start').click());
  for (let i = 0; i < 20; i++) await step();                              // deja aparecer la escena y el saludo
  await page.evaluate(({ seed, lineBet, buy }) => {
    const p = window.__pb; p.game.betIdx = [1, 2, 5, 10, 25, 50].indexOf(lineBet); p.game.sync(); p.force(seed); void p.game.play(!!buy);
  }, shot);
}
let n = 0, idleTail = 0;
for (let f = 0; f < shot.frames; f++) {
  await step();
  await page.screenshot({ path: `${DIR}${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 });
  if (shot.attack) {
    const open = await page.evaluate(() => !document.getElementById('fightui').hidden);
    if (open) { for (let i = 0; i < 12; i++) { await step(); await page.screenshot({ path: `${DIR}${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 }); } await page.click(`.atk.${shot.attack}`); }
  }
  if (name !== 'title' && !(await page.evaluate(() => window.__pb.game.busy))) { if (++idleTail > 45) break; }
}
await browser.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${DIR}%05d.jpg`, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}pb_${tag}.mp4`]);
writeFileSync(`${OUT}pb_${tag}.json`, JSON.stringify({ name: tag, ...shot, fps, frames: n, seconds: +(n / fps).toFixed(2), errors }, null, 1));
console.log(JSON.stringify({ name: tag, frames: n, seconds: +(n / fps).toFixed(2), errors }));
