// POST /api/demo-request — the home page's demo request form.
// Server-side validation, honeypot + minimum fill time, rate limits (per hashed IP and per email), idempotency by the
// client's key, a stored copy in KV (REQUESTS), and one notification to the team through our own Zoho mailbox
// (authenticated as that mailbox; the visitor goes in Reply-To, never in From).
// Secrets (wrangler secret put …, never in the repo): SMTP_USER (the Zoho login mailbox), SMTP_PASS, SMTP_FROM (optional:
// an alias of that mailbox to send as, e.g. partnership@), NOTIFY_TO (comma-separated mailboxes),
// IP_SALT. Var: SMTP_HOST (default smtppro.zoho.eu).
import { games } from '../data/games.mjs';
import { site } from '../data/site.mjs';
import { sendMail } from './smtp.js';

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ');
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const EMAIL = /^[^\s@<>()",;:\\[\]]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;
const GAMES = Object.fromEntries([...games.map((g) => [g.slug, g.fullName || g.name]), ['catalogue', 'Full catalogue']]);

export async function demoRequest(request, env) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405);
  const origin = request.headers.get('origin');
  if (origin && !/^https:\/\/(www\.)?oddwinstudios\.com$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return json({ ok: false, error: 'Forbidden.' }, 403);
  if (!/^application\/json/.test(request.headers.get('content-type') || '')) return json({ ok: false, error: 'Unsupported request.' }, 415);
  const raw = await request.text();
  if (raw.length > 12000) return json({ ok: false, error: 'Request too large.' }, 413);
  let d; try { d = JSON.parse(raw); } catch { return json({ ok: false, error: 'Invalid request.' }, 400); }

  const f = {
    name: clean(d.name, 120), email: clean(d.email, 200).toLowerCase(), company: clean(d.company, 160), type: clean(d.type, 40),
    game: clean(d.game, 40), markets: clean(d.markets, 200), message: clean(d.message, 2000),
    source: clean(d.source, 200), campaign: clean(d.campaign, 120), page: clean(d.page, 120),
  };
  const key = clean(d.key, 64);
  // spam: the hidden field must stay empty and a human takes more than a couple of seconds to fill the form
  if (clean(d.website, 200) || Number(d.elapsed) < 2500) return json({ ok: false, error: 'We could not accept this request. Please write to ' + site.email + '.' }, 400);
  const bad = [];
  if (f.name.length < 2) bad.push('name');
  if (!EMAIL.test(f.email)) bad.push('email');
  if (f.company.length < 2) bad.push('company');
  if (!site.companyTypes.includes(f.type)) bad.push('type');
  if (!GAMES[f.game]) bad.push('game');
  if (!/^[A-Za-z0-9-]{16,64}$/.test(key)) bad.push('key');
  if (bad.length) return json({ ok: false, error: 'Please check the highlighted fields.', fields: bad.filter((b) => b !== 'key') }, 422);

  const kv = env.REQUESTS;
  // idempotency: the same key returns the first answer and never files or mails twice
  const seen = await kv.get(`req:${key}`, 'json');
  if (seen) return seen.notified ? json({ ok: true, id: seen.id, game: GAMES[seen.game], repeat: true }) : json({ ok: false, error: `We could not notify our team automatically. Please write to ${site.email}.` }, 503);

  // rate limits: 5 per hour per IP fingerprint (salted hash, kept 2 h), 3 per day per email address
  const ipHash = (await sha((env.IP_SALT || 'oddwin') + (request.headers.get('cf-connecting-ip') || ''))).slice(0, 24);
  const hour = Math.floor(Date.now() / 3.6e6), day = Math.floor(Date.now() / 8.64e7);
  const ipKey = `rl:ip:${ipHash}:${hour}`, mailKey = `rl:mail:${await sha(f.email)}:${day}`;
  const [ipN, mailN] = await Promise.all([kv.get(ipKey), kv.get(mailKey)]).then((v) => v.map((n) => Number(n || 0)));
  if (ipN >= 5 || mailN >= 3) return json({ ok: false, error: `Too many requests. Please try again later, or write to ${site.email}.` }, 429);
  await Promise.all([kv.put(ipKey, String(ipN + 1), { expirationTtl: 7200 }), kv.put(mailKey, String(mailN + 1), { expirationTtl: 172800 })]);

  const id = new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + key.slice(0, 8);
  const rec = { id, at: new Date().toISOString(), ...f, ipHash, notified: false };
  const isTest = /^TEST\b/.test(f.company) || /^TEST\b/.test(f.name);

  const text = [
    isTest ? 'TEST REQUEST — sent to check the form; not a real lead.\n' : '',
    `New private demo request on oddwinstudios.com (${id})`, '',
    `Game:     ${GAMES[f.game]}`, `Name:     ${f.name}`, `Email:    ${f.email}`, `Company:  ${f.company}`, `Type:     ${f.type}`,
    `Markets:  ${f.markets || '—'}`, '', 'Message:', f.message || '—', '',
    `Page:     ${f.page || '—'}`, `Source:   ${f.source || '—'}`, `Campaign: ${f.campaign || '—'}`, '',
    'Reply to this email to answer the requester directly.',
    'To invite them: demos/admin.mjs grant (see demos/README.md). Nothing is granted automatically.',
  ].join('\n');

  let notified = false, mailError = null, messageId = null;
  if (env.SMTP_USER && env.SMTP_PASS && env.NOTIFY_TO) {
    try {
      const to = env.NOTIFY_TO.split(',').map((s) => s.trim()).filter((s) => EMAIL.test(s));
      const r = await sendMail({
        host: env.SMTP_HOST || 'smtppro.zoho.eu', user: env.SMTP_USER.trim(), pass: env.SMTP_PASS.replace(/\s+/g, ''),   // Zoho shows app passwords in groups of four
        heloDomain: 'oddwinstudios.com',
        from: `ODDWIN demo requests <${env.SMTP_FROM || env.SMTP_USER}>`, envelopeFrom: env.SMTP_FROM || env.SMTP_USER, to, replyTo: `${oneLine(f.name).replace(/["<>]/g, '')} <${f.email}>`,
        subject: oneLine(`${isTest ? '[TEST] ' : ''}Demo request · ${GAMES[f.game]} · ${f.company}`), text,
      });
      notified = true; messageId = r.messageId;
    } catch (e) { mailError = String(e && e.message || e).slice(0, 200); }
  } else mailError = 'smtp not configured';

  await kv.put(`req:${key}`, JSON.stringify({ ...rec, notified, mailError, messageId }), { expirationTtl: 60 * 60 * 24 * 180 });
  await kv.put(`lead:${id}`, JSON.stringify({ ...rec, notified, mailError, messageId }), { expirationTtl: 60 * 60 * 24 * 365 });
  console.log(JSON.stringify({ evt: 'demo-request', id, game: f.game, notified, mailError }));   // no personal data in logs

  if (!notified) return json({ ok: false, error: `Your request was saved, but we could not notify our team automatically. Please also write to ${site.email} so it is not missed.` }, 503);
  return json({ ok: true, id, game: GAMES[f.game] });
}
