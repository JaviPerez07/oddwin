// demo.oddwinstudios.com — private evaluation builds, by invitation only.
// Every request (pages AND game files) passes through here (run_worker_first): no valid invitation session, no bytes.
//   /i/<token>        open an invitation: checks it in KV, sets a signed session cookie, redirects to the portal
//   /                 portal with the games this invitation covers (or a "by invitation" page without a session)
//   /play/<slug>/…    the game files, only if <slug> is in the invitation
//   /logout           clears the session
// KV (INVITES): inv:<sha256(token)> → { id, email, name, company, games: [...] | ['*'], exp, revoked, created, uses, last }
//               idx:<id> → sha256(token)   (admin.mjs uses it to revoke or extend by id)
// Secret: SESSION_KEY (HMAC for the cookie). The raw token is never stored; only its hash.
import GAMES from './games.json';

const COOKIE = 'od_session';
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const hmac = async (key, s) => hex(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), enc.encode(s)));
const same = (a, b) => a.length === b.length && [...a].reduce((d, c, i) => d | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SEC = {
  'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY', 'Strict-Transport-Security': 'max-age=31536000', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const withHeaders = (res, extra = {}) => { const r = new Response(res.body, res); for (const [k, v] of Object.entries({ ...SEC, ...extra })) r.headers.set(k, v); return r; };

// short in-isolate cache so a game's hundred file requests don't each read KV; revocation applies within ~30 s
// (+ KV propagation, usually under a minute)
const memo = new Map();
async function invite(env, hash) {
  const hit = memo.get(hash);
  if (hit && hit.t > Date.now() - 30000) return hit.v;
  const v = await env.INVITES.get(`inv:${hash}`, 'json');
  memo.set(hash, { t: Date.now(), v });
  return v;
}
const live = (inv) => inv && !inv.revoked && inv.exp > Date.now();
const allows = (inv, slug) => inv.games.includes('*') || inv.games.includes(slug);

async function session(request, env) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})\\.(\\d+)\\.([a-f0-9]{64})`));
  if (!m) return null;
  const [, hash, exp, sig] = m;
  if (+exp < Date.now() || !same(sig, await hmac(env.SESSION_KEY, `${hash}.${exp}`))) return null;
  const inv = await invite(env, hash);
  return live(inv) ? { hash, inv } : null;
}

const page = (title, body, status = 200) => new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${esc(title)} · ODDWIN Studios</title><link rel="icon" href="/static/oddwin_mono.png"><link rel="stylesheet" href="/static/portal.css"></head><body><header><img src="/static/oddwin_wordmark.png" alt="ODDWIN Studios" width="108" height="28"><span>Private demos</span></header><main>${body}</main><footer>Evaluation builds with fictional credits — no deposits, no payments, no real-money play. 18+. Questions: <a href="mailto:partnership@oddwinstudios.com">partnership@oddwinstudios.com</a></footer></body></html>`,
  { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" } });

const closed = (status = 401) => page('By invitation', `<h1>Private demos are by invitation.</h1><p>This site holds the evaluation builds of ODDWIN Studios games. To see them, request a private demo at <a href="https://oddwinstudios.com/#contact">oddwinstudios.com</a>; we review every request and send a personal invitation link.</p><p class="dim">Already invited? Open the link from your invitation email again — it signs you in on this device.</p>`, status);

function portal(inv) {
  const mine = GAMES.filter((g) => allows(inv, g.slug));
  const until = new Date(inv.exp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });
  return page('Your private demos', `<h1>Your private demos${inv.company ? ` · ${esc(inv.company)}` : ''}</h1>
<p>Access for <b>${esc(inv.email)}</b>, valid until <b>${until}</b>. Each game opens with 100,000 € in fictional credits; bonus buys show their price before you confirm, and features without a buy can be opened with “Preview feature”.</p>
<ul class="games">${mine.map((g) => `<li><a href="/play/${g.slug}/"><img src="/static/${g.slug}.jpg" alt=""><b>${esc(g.name)}</b><span>${esc(g.line)}</span></a></li>`).join('')}</ul>
<p class="dim">Please do not forward this access: the invitation is personal. The math report, integration guide and compliance documents are sent separately. <a href="/logout">Sign out</a></p>`);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url), p = url.pathname;
    if (url.protocol === 'http:' && url.hostname.endsWith('oddwinstudios.com')) { url.protocol = 'https:'; return Response.redirect(url.toString(), 301); }
    if (!env.SESSION_KEY || env.SESSION_KEY.length < 32) return new Response('Private demos are temporarily unavailable.', { status: 503, headers: { 'content-type': 'text/plain', ...SEC } });
    if (p === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain', ...SEC } });
    if (p.startsWith('/static/')) return withHeaders(await env.ASSETS.fetch(request), { 'cache-control': 'public, max-age=3600' });

    if (p.startsWith('/i/')) {
      const token = p.slice(3);
      if (!/^[A-Za-z0-9_-]{32,64}$/.test(token)) return withHeaders(page('Invitation not valid', '<h1>This invitation link is not valid.</h1><p>Please check the link, or ask us for a new one at <a href="mailto:partnership@oddwinstudios.com">partnership@oddwinstudios.com</a>.</p>', 403));
      const hash = await sha(token), inv = await env.INVITES.get(`inv:${hash}`, 'json');
      if (!live(inv)) return withHeaders(page('Invitation not valid', `<h1>This invitation ${inv && inv.revoked ? 'has been withdrawn' : inv ? 'has expired' : 'is not valid'}.</h1><p>Ask us for a new one at <a href="mailto:partnership@oddwinstudios.com">partnership@oddwinstudios.com</a>.</p>`, 403));
      await env.INVITES.put(`inv:${hash}`, JSON.stringify({ ...inv, uses: (inv.uses || 0) + 1, last: new Date().toISOString() }));
      memo.delete(hash);
      const exp = Math.min(inv.exp, Date.now() + 30 * 864e5);
      const value = `${hash}.${exp}.${await hmac(env.SESSION_KEY, `${hash}.${exp}`)}`;
      console.log(JSON.stringify({ evt: 'invite-open', id: inv.id }));
      return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': `${COOKIE}=${value}; Path=/; Max-Age=${Math.floor((exp - Date.now()) / 1000)}; HttpOnly; Secure; SameSite=Lax`, 'cache-control': 'no-store', ...SEC } });
    }
    if (p === '/logout') return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`, ...SEC } });

    const s = await session(request, env);
    if (p === '/' || p === '/index.html') return withHeaders(s ? portal(s.inv) : closed(200));
    const m = p.match(/^\/play\/([a-z0-9-]+)(\/.*)?$/);
    if (!m) return withHeaders(closed(404));
    if (!s) return withHeaders(closed(401));
    const slug = m[1];
    if (!GAMES.some((g) => g.slug === slug)) return withHeaders(closed(404));
    if (!allows(s.inv, slug)) return withHeaders(page('Not in your invitation', `<h1>This game is not part of your invitation.</h1><p><a href="/">Back to your demos</a> · or ask us to add it at <a href="mailto:partnership@oddwinstudios.com">partnership@oddwinstudios.com</a>.</p>`, 403));
    if (!m[2]) return Response.redirect(`${url.origin}/play/${slug}/`, 301);   // games load files relative to /play/<slug>/
    const res = await env.ASSETS.fetch(request);
    const html = (res.headers.get('content-type') || '').includes('text/html');
    // private: browsers may cache game files for the session, shared caches may not
    return withHeaders(res, { 'cache-control': html ? 'no-store' : 'private, max-age=3600' });
  },
};
