// Text pages: legal notice, privacy, 404. Missing legal data is shown as a visible gap, never invented.
import { site } from '../data/site.mjs';
import { page } from './layout.mjs';

const gap = (v, what) => v ?? `<span class="todo">Pending: ${what}</span>`;

export function legal() {
  const l = site.legal;
  const body = `
<div class="wrap doc">
  <h1 class="display gold">Legal notice</h1>
  <h2>Who runs this site</h2>
  <p>Owner: ${gap(l.company, 'company name')}<br>Tax ID: ${gap(l.taxId, 'tax ID')}<br>Address: ${gap(l.address, 'registered address')}${l.registry ? `<br>${l.registry}` : ''}<br>Contact: <a href="mailto:${site.email}">${site.email}</a></p>
  <h2>What this site is</h2>
  <p>A business-to-business presentation of games developed by ODDWIN Studios, addressed to licensed aggregators, distributors, operators and studios. It does not offer gambling, does not take bets and has no real-money play.</p>
  <h2>Figures and certification</h2>
  <p>RTP, volatility, hit rates and feature frequencies come from each game's PAR sheet: an exact base-game calculation and simulations of ten million rounds or more per version. They are not yet certified by an accredited test lab. Certified figures replace them once each game has been tested for a given market.</p>
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
  <p>This site sets no cookies, runs no analytics or advertising, and loads nothing from third parties: fonts, images and films are served from our own domain.</p>
  <h2>When you write to us</h2>
  <p>The partner-access form does not send anything to a server. It opens an email in your own mail program, addressed to <a href="mailto:${site.email}">${site.email}</a>. We use what you send only to answer you and to manage a possible business relationship, and we keep it while that conversation or relationship lasts.</p>
  <h2>Controller and your rights</h2>
  <p>Controller: ${gap(site.legal.company, 'company name')}. You can ask to access, correct or delete your data, or object to its use, by writing to <a href="mailto:${site.email}">${site.email}</a>. You can also complain to your data protection authority (in Spain, the AEPD).</p>
  <h2>Hosting</h2>
  <p>The site is served by Cloudflare, which processes technical connection data (such as IP addresses) to deliver and protect it.</p>
</div>`;
  return page({ path: '/privacy', title: 'Privacy — ODDWIN Studios', description: 'How oddwinstudios.com handles data: no cookies, no analytics, no third-party requests.', body });
}

export function notFound() {
  const body = `
<div class="wrap doc">
  <h1 class="display gold">This page left the vault.</h1>
  <p>The address may belong to the first version of this site. Everything we make is on the slate.</p>
  <p><a class="btn" href="/#slate">See the slate</a></p>
</div>`;
  return page({ path: '/404', title: 'Not found — ODDWIN Studios', description: 'Page not found.', body, noindex: true });
}
