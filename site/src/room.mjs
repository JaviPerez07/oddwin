// Game rooms: the top of the page takes the game's own identity; the rest stands on the ODDWIN floor.
import { site } from '../data/site.mjs';
import { games, kitItems } from '../data/games.mjs';
import { page, esc, breadcrumbs } from './layout.mjs';
import { existsSync } from 'node:fs';

const filmButton = (g) => g.trailer
  ? `<button class="play-btn" type="button" data-film="/video/${g.trailer.src}" data-poster="/media/${g.trailer.poster}" data-title="${esc(g.name)} · trailer ${g.trailer.len}"><i></i>Watch the trailer</button>`
  : '';

const player = (g) => `<div class="player">
      <video src="/media/${g.hero.video}.mp4" poster="/media/${g.hero.video}.jpg" autoplay muted loop playsinline aria-label="${esc(g.name)}, ${esc(g.hero.label)}"></video>
      ${filmButton(g)}
      <span class="len">Loop · ${esc(g.hero.label)}${g.trailer ? '' : ' · English trailer in production'}</span>
    </div>`;

// One identity block per room, built from each game's own design document.
const heroes = {
  'page-breaker': (g) => `
  <img class="rip" data-qa-deco src="/img/games/rip_wave.png" alt="">
  <div class="wrap top">
    <div>
      <h1>Page<br>Breaker!!</h1>
      <p class="bubble">“Hey, you! Yes, you on the other side of the page. Welcome to my comic.” — Rip</p>
      <div class="tags"><span>Comic action</span><span>Player-choice bonus</span><span>Server-side multi-step</span></div>
      <p class="fight">The fight: Safe, Normal or Improvised. Riskier hits pay more — every choice has the same expected value, resolved on the server step by step.</p>
    </div>
    ${player(g)}
  </div>
  <div class="tear"></div>`,

  obsidian: (g) => `
  <img class="keeper" data-qa-deco src="/img/games/obs_keeper.webp" alt="">
  <div class="wrap top">
    <div class="mark">
      <h1>OBSIDIAN</h1>
      <div class="sub">THE LOST VAULT</div>
      <p class="line">A vault hidden inside a sleeping volcano. Black volcanic glass, veins of molten gold, three roads to the jackpot always in sight.</p>
      <div class="gems">${g.jackpots.map(([n, v]) => `<span>${n} ${v}</span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <svg class="vein" viewBox="0 0 1440 22" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="vein" x1="0" x2="1"><stop offset="0" stop-color="#7A5420"/><stop offset=".35" stop-color="#F6DDA0"/><stop offset=".6" stop-color="#D9A84E"/><stop offset="1" stop-color="#7A5420"/></linearGradient></defs><rect width="1440" height="22" fill="#07080B"/><path d="M0 11 L120 9 L180 14 L260 7 L340 12 L420 10 L470 16 L560 8 L650 12 L720 9 L790 15 L880 10 L960 13 L1030 6 L1110 12 L1190 10 L1250 15 L1330 9 L1440 12" stroke="url(#vein)" stroke-width="2" fill="none"/></svg>`,

  aura: (g) => `
  <div class="wrap top">
    <div class="mark">
      <h1>AURA</h1>
      <div class="sub">Ascension · Eclipse · The Titan's Hands</div>
      <p class="line">An obsidian sanctuary, molten gold and a violet force held in a titan's hands. Monumental, adult and quiet — light only where the aura is.</p>
      <div class="plates">${g.jackpots.map(([n, v]) => `<span><small>${n}</small><b>${v}</b></span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <span class="aura-line" aria-hidden="true"></span>`,

  vice: (g) => `
  <img class="woman" data-qa-deco src="/img/games/vice_woman.webp" alt="">
  <div class="wrap top">
    <div class="mark">
      <h1 data-qa-ignore aria-label="Vice Miami Spin"><span class="logo-vice">VICE</span><span class="logo-sub">MIAMI SPIN</span></h1>
      <p class="line">Neon sunset on the reels. Bags of cash hide prizes and jackpots; six of them start the heist.</p>
      <div class="bags">${g.jackpots.map(([n, v]) => `<span>${n}<b>${v}</b></span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <span class="sunset" aria-hidden="true"></span>`,
};

const kitRow = (g, key, staticDir) => {
  const [label, access] = kitItems[key];
  if (key === 'trailer' && g.trailer) return `<li>${label}<button class="link" type="button" data-film="/video/${g.trailer.src}" data-poster="/media/${g.trailer.poster}" data-title="${esc(g.name)} · trailer ${g.trailer.len}">Watch</button></li>`;
  if (access === 'public') {
    const file = `docs/${g.slug}-${key}.pdf`;
    return existsSync(`${staticDir}/${file}`) ? `<li>${label}<a class="link" href="/${file}">Download</a></li>` : `<li>${label}<span>On request</span></li>`;
  }
  return `<li>${label}<span>${access === 'ip' ? 'On IP deals' : 'Partner access'}</span></li>`;
};

export function room(g, staticDir) {
  const i = games.indexOf(g), next = games[(i + 1) % games.length], prev = games[(i - 1 + games.length) % games.length];
  const body = `
<div class="wrap crumb mono"><a href="/#slate">Games</a> / ${g.no} / <b>${esc(g.name)}</b></div>

<div class="room room-${g.room}">${heroes[g.room](g)}
</div>

<section><div class="wrap">
  <div class="sec-head"><span class="mono">Key figures</span><h2 class="display gold">The numbers, from the PAR.</h2><span class="mono">${g.math} · not lab-certified</span></div>
  <dl class="par">
    ${g.par.map(([k, v, s]) => `<div><dt>${k}</dt><dd>${v}</dd><small>${esc(s)}</small></div>`).join('\n    ')}
  </dl>
  <div class="rtp"><span>RTP versions</span>${g.rtp.map((r) => `<b>${r}</b>`).join('')}<span>· ${esc(g.buy)}</span></div>
</div></section>

<section><div class="wrap">
  <div class="sec-head"><span class="mono">Mechanics</span><h2 class="display gold">${esc(g.mechanicsTitle)}</h2><span class="mono">Loops are real captures</span></div>
  <div class="mech">
    ${g.mechanics.map((m) => `<figure><video data-src="/media/${m.video}.mp4" poster="/media/${m.video}.jpg" muted loop playsinline preload="none" aria-label="${esc(g.name)}, ${esc(m.name)}, real capture"></video><figcaption><h3>${esc(m.name)}</h3><p>${esc(m.text)}</p><span class="mono">Real capture · ${m.len}</span></figcaption></figure>`).join('\n    ')}
  </div>${g.walkthrough ? `
  <div class="walk"><button class="btn ghost" type="button" data-film="/video/${g.walkthrough.src}" data-poster="/media/${g.hero.video}.jpg" data-title="${esc(g.name)} · feature walkthrough ${g.walkthrough.len}">Watch the feature walkthrough · ${g.walkthrough.len}</button></div>` : ''}
</div></section>

<section><div class="wrap">
  <div class="sec-head"><span class="mono">Partner kit</span><h2 class="display gold">What you get with ${esc(g.name)}.</h2><span class="mono">Private access per company</span></div>
  <ul class="kit">
    ${g.kit.map((k) => kitRow(g, k, staticDir)).join('\n    ')}
  </ul>
  <div class="ask"><a class="btn" href="/#contact">Request access to ${esc(g.name)}</a><p>Access is personal: each partner signs in with their work email. No real-money play; 18+.</p></div>
</div></section>

<nav class="next" aria-label="More titles"><div class="wrap"><a href="/games/${prev.slug}" class="mono">← ${prev.no} · ${esc(prev.name)}</a><a href="/games/${next.slug}"><b class="display gold">${esc(next.name)} →</b></a></div></nav>`;

  return page({
    path: `/games/${g.slug}`, title: `${g.fullName || g.name} — ODDWIN Studios`, description: g.description,
    css: [`/css/rooms/${g.room}.css`], body, image: `/media/${g.hero.video}.jpg`,
    schema: [breadcrumbs([['ODDWIN Studios', '/'], ['Games', '/#slate'], [g.name, `/games/${g.slug}`]])],
  });
}

export const roomPaths = () => games.map((g) => `/games/${g.slug}`);
export { site };
