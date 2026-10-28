// Cuts the FRUTIGER EDEN website loops from the clean English captures in ./clips (made by capture_eden.mjs) and
// writes them to site/static/media with exactly the encoding of cut_loops.mjs: 960 px, H.264 CRF 27 preset slow,
// yuv420p, no audio, +faststart, plus a JPEG poster (-q:v 4).   node cut_eden.mjs [loop names…]
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url).pathname, clips = here + 'clips/', media = here + '../site/static/media/';
// name: [source clip, start s, duration s, poster offset s]  (times are clip times; see clips/eden_*.json phase marks)
export const LOOPS = {
  eden_cascade: ['eden_aqua-nova.mp4', 2.6, 7.0, 9.0],   // base spin: cascades raise ECOSYSTEM 1/4 → 4/4 (ends before the AQUA NOVA intro)
  eden_nova: ['eden_aqua-nova.mp4', 53.3, 7.0, 54.1],     // AQUA NOVA: blooms ×3 → ×4 → ×5
  eden_lagoon: ['eden_grand.mp4', 17.5, 7.0, 24.3],       // PEARL LAGOON (GRAND round): pearls lock until all 20 cells are full
  eden_collect: ['eden_collect.mp4', 1.0, 5.0, 4.3],      // whirlpool lands on reel 5 and collects the pearls
};

const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const only = process.argv.slice(2);
for (const [name, [src, ss, t, poster]] of Object.entries(LOOPS)) {
  if (only.length && !only.includes(name)) continue;
  ff('-ss', String(ss), '-t', String(t), '-i', clips + src, '-an', '-vf', 'scale=960:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${media}${name}.mp4`);
  ff('-ss', String(poster - ss), '-i', `${media}${name}.mp4`, '-frames:v', '1', '-q:v', '4', `${media}${name}.jpg`);
  console.log('loop', name);
}
