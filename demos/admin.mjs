#!/usr/bin/env node
// Team tool for private demo invitations (KV namespace "oddwin-invites" on Cloudflare, through wrangler).
//   node admin.mjs requests [n]                         latest demo requests from the website form (default 20)
//   node admin.mjs grant --email a@b.com --games page-breaker,aura [--name "Ann"] [--company "Co"] [--days 14] [--request <id>]
//   node admin.mjs list                                 every invitation with its state
//   node admin.mjs revoke <id>                          withdraw now (open sessions stop within about a minute)
//   node admin.mjs extend <id> --days 7                 move the expiry date
// --games all grants the whole catalogue. Nothing is ever granted automatically and nothing is emailed by this tool:
// it prints the personal link, which Javi or Nico send to the invitee themselves.
import { execFileSync } from 'node:child_process';
import { randomBytes, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const REQUESTS = 'eda8b2d377c9420db2a9ec0bb620a421';
const ORIGIN = 'https://demo.oddwinstudios.com';
const WRANGLER = process.env.WRANGLER || '/Users/javiperezz7/Projects/oddwin-studios-web/node_modules/.bin/wrangler';
const GAMES = JSON.parse(readFileSync(join(here, 'games.json'), 'utf8')).map((g) => g.slug);
const ns = () => JSON.parse(readFileSync(join(here, 'kv.json'), 'utf8'));

const wr = (args) => execFileSync(WRANGLER, args, { cwd: here, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const kvGet = (nsId, key) => { try { return JSON.parse(wr(['kv', 'key', 'get', key, '--namespace-id', nsId, '--remote'])); } catch { return null; } };
const kvPut = (nsId, key, value) => {
  const dir = mkdtempSync(join(tmpdir(), 'kv-')), f = join(dir, 'v.json');   // value via file: never on the command line
  writeFileSync(f, typeof value === 'string' ? value : JSON.stringify(value));
  try { wr(['kv', 'key', 'put', key, '--path', f, '--namespace-id', nsId, '--remote']); } finally { rmSync(dir, { recursive: true, force: true }); }
};
const kvList = (nsId, prefix) => JSON.parse(wr(['kv', 'key', 'list', '--namespace-id', nsId, '--prefix', prefix, '--remote']));
const opt = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const date = (t) => new Date(t).toISOString().slice(0, 16).replace('T', ' ');

const [cmd, arg] = process.argv.slice(2);
const { invites } = ns();

if (cmd === 'grant') {
  const email = (opt('email') || '').toLowerCase().trim();
  const games = (opt('games') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email) || !games.length) throw new Error('usage: grant --email … --games slug,slug|all');
  const list = games.includes('all') ? ['*'] : games;
  const unknown = list.filter((g) => g !== '*' && !GAMES.includes(g));
  if (unknown.length) throw new Error(`unknown or unpublished game: ${unknown.join(', ')} (published: ${GAMES.join(', ')})`);
  const days = Number(opt('days', 14));
  const token = randomBytes(32).toString('base64url'), hash = createHash('sha256').update(token).digest('hex'), id = hash.slice(0, 10);
  const rec = { id, email, name: opt('name', ''), company: opt('company', ''), games: list, exp: Date.now() + days * 864e5, revoked: false, created: new Date().toISOString(), by: process.env.USER || '', request: opt('request', ''), uses: 0 };
  kvPut(invites, `inv:${hash}`, rec);
  kvPut(invites, `idx:${id}`, hash);
  console.log(`Granted ${id} · ${email} · ${list.join(', ')} · until ${date(rec.exp)} UTC`);
  console.log(`Personal link (send it yourself; it is shown only now):\n${ORIGIN}/i/${token}`);
} else if (cmd === 'list') {
  for (const k of kvList(invites, 'inv:')) {
    const r = kvGet(invites, k.name);
    if (!r) continue;
    const state = r.revoked ? 'REVOKED' : r.exp < Date.now() ? 'expired' : 'active';
    console.log(`${r.id}  ${state.padEnd(7)}  until ${date(r.exp)}  uses ${r.uses || 0}${r.last ? ` (last ${date(r.last)})` : ''}  ${r.email}  ${r.company || ''}  [${r.games.join(',')}]`);
  }
} else if (cmd === 'revoke' || cmd === 'extend') {
  const hash = kvGet(invites, `idx:${arg}`) ?? (() => { try { return wr(['kv', 'key', 'get', `idx:${arg}`, '--namespace-id', invites, '--remote']).trim(); } catch { return null; } })();
  const r = hash && kvGet(invites, `inv:${hash}`);
  if (!r) throw new Error(`no invitation ${arg}`);
  if (cmd === 'revoke') r.revoked = true; else r.exp = Date.now() + Number(opt('days', 7)) * 864e5;
  kvPut(invites, `inv:${hash}`, r);
  console.log(`${cmd === 'revoke' ? 'Revoked' : 'Extended'} ${r.id} · ${r.email} · ${cmd === 'revoke' ? 'sessions stop within about a minute' : `until ${date(r.exp)} UTC`}`);
} else if (cmd === 'requests') {
  const keys = kvList(REQUESTS, 'lead:').map((k) => k.name).sort().reverse().slice(0, Number(arg || 20));
  for (const k of keys) {
    const r = kvGet(REQUESTS, k);
    if (r) console.log(`${r.id}  ${date(r.at)}  ${r.notified ? 'mailed ' : 'NOT MAILED'}  ${r.game.padEnd(16)} ${r.company} · ${r.name} <${r.email}> · ${r.type}${r.markets ? ` · ${r.markets}` : ''}`);
  }
} else {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 9).join('\n'));
}
