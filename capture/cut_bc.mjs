// Cuts the BAR & CIGAR BONANZA website loops from the clean English captures in ./clips (made by capture_bc.mjs) and
// writes them to site/static/media with exactly the encoding of cut_loops.mjs: 960 px, H.264 CRF 27 preset slow,
// yuv420p, no audio, +faststart, plus a JPEG poster (-q:v 4).   node cut_bc.mjs [names...]
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url).pathname, clips = here + 'clips/', media = here + '../site/static/media/';
// name: [source clip, start s, duration s, poster offset s]
export const LOOPS = {
  bc_smoke: ['bc_smoke_5838.mp4', 4.0, 6.6, 8.3],
  bc_round: ['bc_round_908.mp4', 21.5, 7.0, 27.3],
  bc_happy: ['bc_happy_879.mp4', 14.5, 7.0, 20.3],
  bc_box: ['bc_box_6209.mp4', 3.5, 6.0, 7.2],
};
const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const only = process.argv.slice(2);
for (const [name, [src, ss, t, poster]] of Object.entries(LOOPS)) {
  if (only.length && !only.includes(name)) continue;
  ff('-ss', String(ss), '-t', String(t), '-i', clips + src, '-an', '-vf', 'scale=960:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${media}${name}.mp4`);
  ff('-ss', String(poster - ss), '-i', `${media}${name}.mp4`, '-frames:v', '1', '-q:v', '4', `${media}${name}.jpg`);
  console.log('loop', name);
}
