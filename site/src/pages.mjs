// Text pages: legal notice, privacy, 404. Company details are printed only when they exist in data/site.mjs: a missing
// field is left out (LEGAL_TODO.md lists them), never shown as "pending" and never invented.
import { site } from '../data/site.mjs';
import { page } from './layout.mjs';

const line = (label, v) => (v ? `${label}: ${v}<br>` : '');

export function legal() {
  const l = site.legal;
  const body = `
<div class="wrap doc">
  <h1 class="display gold">Legal notice</h1>
  <h2>Who runs this site</h2>
  <p>${line('Owner', l.company || 'ODDWIN Studios')}${line('Tax ID', l.taxId)}${line('Address', l.address)}${l.registry ? `${l.registry}<br>` : ''}Contact: <a href="mailto:${site.email}">${site.email}</a></p>
  <h2>What this site is</h2>
  <p>A business-to-business presentation of games developed by ODDWIN Studios, addressed to game providers, aggregators, distributors, publishers, operators and studios. It does not offer gambling, does not take bets and has no real-money play.</p>
  <h2>Figures and certification</h2>
  <p>RTP, volatility, hit rates and feature frequencies come from each game's math report: an exact base-game calculation and simulations of ten million rounds or more per version. They are not yet certified by an accredited test lab. Certification is carried out with each partner, for each market; certified figures replace these once a game has been tested.</p>
  <h2>Private demos</h2>
  <p>Evaluation builds are shown only to invited business contacts, with fictional credits. They involve no deposits, no payments and no real-money play.</p>
  <h2 id="responsible">Responsible design</h2>
  <p>Our games are built for adults (18+) and for regulated markets. Market profiles cover minimum spin time, session clock and net position, bonus buy on or off, and the warnings each jurisdiction requires.</p>
  <h2>Intellectual property</h2>
  <p>Game names, characters, art, music, code and footage shown here belong to ODDWIN Studios or to the partner studio named with each title. Reuse needs written permission.</p>
</div>`;
  return page({ path: '/legal', title: 'Legal notice — ODDWIN Studios', description: 'Legal notice of oddwinstudios.com, a B2B site for licensed businesses.', body });
}

export function privacy() {
  const body = `
<div class="wrap doc">
  <h1 class="display gold">Privacy</h1>
  <h2>Short version</h2>
  <p>This site runs no analytics or advertising and loads nothing from third parties: fonts, images and films are served from our own domain. The public site sets no cookies.</p>
  <h2>When you request a demo</h2>
  <p>The demo request form sends your name, work email, company, company type, the game you chose and, if you add them, your markets and message to our server. We forward the request to our team by email and keep a copy so we can review it and answer. To limit abuse, we keep a short-lived, non-reversible fingerprint of the sending IP address. We use this information only to answer your request and to manage a possible business relationship, and we keep it while that conversation or relationship lasts. You can also write directly to <a href="mailto:${site.email}">${site.email}</a>.</p>
  <h2>Private demos</h2>
  <p>If we invite you to a private demo, the invitation link sets one cookie on demo.oddwinstudios.com. It is strictly necessary: it keeps you signed in to the games you were invited to until the invitation expires or is revoked. We record which invitation was used and when, to manage access.</p>
  <h2>Controller and your rights</h2>
  <p>Controller: ${site.legal.company || 'ODDWIN Studios'}. You can ask to access, correct or delete your data, or object to its use, by writing to <a href="mailto:${site.email}">${site.email}</a>. You can also complain to your data protection authority (in Spain, the AEPD).</p>
  <h2>Hosting and email</h2>
  <p>The site is served by Cloudflare, which processes technical connection data (such as IP addresses) to deliver and protect it. Our email is hosted by Zoho.</p>
</div>`;
  return page({ path: '/privacy', title: 'Privacy — ODDWIN Studios', description: 'How oddwinstudios.com handles data: no analytics, no third-party requests, and what happens when you request a demo.', body });
}

export function notFound() {
  const body = `
<div class="wrap doc">
  <h1 class="display gold">This page left the vault.</h1>
  <p>The address may belong to the first version of this site. Every game we make is on the home page.</p>
  <p><a class="btn" href="/#games">See the games</a></p>
</div>`;
  return page({ path: '/404', title: 'Not found — ODDWIN Studios', description: 'Page not found.', body, noindex: true });
}
