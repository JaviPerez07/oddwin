// Cuts the DEAD AIR — CHANNEL 13 website loops from the English captures in ./clips (capture_da.mjs) into
// site/static/media, with exactly the encoding of cut_loops.mjs: 960 px, H.264 CRF 27 preset slow, yuv420p, no audio,
// +faststart, plus a JPEG poster (-q:v 4).   node cut_da.mjs [name ...]
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url).pathname, clips = here + 'clips/', media = here + '../site/static/media/';
// name: [source clip, start s, duration s, poster offset s (in source time)]
export const LOOPS = {
  da_signal: ['da_card.mp4', 0.5, 4.5, 4.6],
  da_emergency: ['da_lock.mp4', 3.3, 7.0, 10.2],
  da_building: ['da_building.mp4', 2.4, 7.0, 6.0],
  da_deadair: ['da_deadair.mp4', 28.4, 6.0, 31.5],
};

const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const only = process.argv.slice(2);
for (const [name, [src, ss, t, poster]] of Object.entries(LOOPS)) {
  if (only.length && !only.includes(name)) continue;
  ff('-ss', String(ss), '-t', String(t), '-i', clips + src, '-an', '-vf', 'scale=960:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${media}${name}.mp4`);
  ff('-ss', String(poster - ss), '-i', `${media}${name}.mp4`, '-frames:v', '1', '-q:v', '4', `${media}${name}.jpg`);
  console.log('loop', name);
}
