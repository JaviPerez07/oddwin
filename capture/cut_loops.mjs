// Cuts the website loops from the clean English captures in ./clips and writes them to site/static/media:
// 960 px, H.264 CRF 27, no audio, +faststart, plus a JPEG poster. Then rebuilds the home showreel from the same cuts.
//   node cut_loops.mjs        (edit LOOPS / REEL below after reviewing the contact sheets)
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const here = new URL('.', import.meta.url).pathname, clips = here + 'clips/', media = here + '../site/static/media/';
// name: [source clip, start s, duration s, poster offset s]
export const LOOPS = {
  pb_mystery: ['pb_reveal.mp4', 0.4, 4.4, 3.6],
  pb_rip: ['pb_rip.mp4', 1.4, 6.0, 4.0],
  pb_fight: ['pb_fight.mp4', 12.5, 8.0, 17.2],
  pb_dc: ['pb_fs.mp4', 0.3, 7.0, 3.0],
  obs_base: ['obs_collect.mp4', 1.0, 6.0, 5.2],
  obs_lock: ['obs_hold_big.mp4', 3.0, 7.0, 6.5],
  obs_fs: ['obs_fs_epic.mp4', 12.0, 7.0, 13.4],
  vice_base: ['vice_collect.mp4', 0.5, 5.4, 3.2],
  vice_hold: ['vice_hold_big.mp4', 2.8, 7.0, 6.0],
  vice_fs: ['vice_fs_epic.mp4', 3.0, 7.0, 3.6],
  aura_asc: ['aura_9603.mp4', 5.0, 7.0, 10.5],
  aura_hands: ['aura_9603.mp4', 3.5, 6.0, 4.3],
  aura_eclipse: ['aura_47388.mp4', 3.8, 7.0, 4.4],
};
// the home showreel, cut from the 1920 px captures: [loop name, offset into that loop s, duration s]
export const REEL = [['pb_fight', 3.6, 3.4], ['obs_lock', 2.6, 3.4], ['vice_hold', 0.2, 3.4], ['pb_dc', 0, 3.4], ['aura_hands', 0.2, 3.4], ['obs_fs', 1.0, 3.4]];

const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const only = process.argv.slice(2);
for (const [name, [src, ss, t, poster]] of Object.entries(LOOPS)) {
  if (only.length && !only.includes(name)) continue;
  ff('-ss', String(ss), '-t', String(t), '-i', clips + src, '-an', '-vf', 'scale=960:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${media}${name}.mp4`);
  ff('-ss', String(poster - ss), '-i', `${media}${name}.mp4`, '-frames:v', '1', '-q:v', '4', `${media}${name}.jpg`);
  console.log('loop', name);
}
if (!only.length || only.includes('reel')) {
  const tmp = mkdtempSync(join(tmpdir(), 'reel-')), X = 0.4;
  const parts = REEL.map(([n, o, d], i) => { const f = join(tmp, `${i}.mp4`); const [src, ss] = LOOPS[n]; ff('-ss', String(ss + o), '-t', String(d), '-i', clips + src, '-vf', 'scale=1600:900:flags=lanczos,fps=30', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', f); return [f, d]; });
  let chain = '', last = '[0:v]', off = 0;
  parts.slice(1).forEach(([, d], i) => { off += parts[i][1] - X; const o = `[v${i + 1}]`; chain += `${last}[${i + 1}:v]xfade=transition=fade:duration=${X}:offset=${off.toFixed(2)}${o};`; last = o; });
  ff(...parts.flatMap(([f]) => ['-i', f]), '-filter_complex', chain.slice(0, -1), '-map', last, '-an', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', media + 'reel.mp4');
  ff('-ss', '1.0', '-i', media + 'reel.mp4', '-frames:v', '1', '-q:v', '3', media + 'reel.jpg');
  console.log('reel');
}
