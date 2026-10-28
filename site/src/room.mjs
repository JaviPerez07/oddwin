// Game rooms: the top of the page takes the game's own identity; the rest stands on the ODDWIN floor.
import { site } from '../data/site.mjs';
import { games } from '../data/games.mjs';
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

  'bar-and-cigar': (g) => `
  <img class="roxy" data-qa-deco src="/img/games/bc_roxy.webp" alt="">
  <div class="wrap top">
    <div class="mark">
      <h1 data-qa-ignore aria-label="Bar & Cigar Bonanza"><span class="sign"><span class="bc">Bar &amp; Cigar</span><span class="bn">Bonanza</span></span></h1>
      <p class="line">A battered old tavern that acts like the most exclusive club in town. Roxy pours, the Fumatrón 3000 smokes, and the house always stands one more round.</p>
      <div class="brass">${g.jackpots.map(([n, v]) => `<span><small>${n}</small><b>${v}</b></span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <span class="counter" aria-hidden="true"></span>`,

  eden: (g) => `
  <div class="wrap top">
    <div class="mark">
      <h1><img class="wordmark" src="/img/games/eden_wordmark.svg" alt="Frutiger Eden" width="354" height="198"></h1>
      <p class="line">A bright digital paradise from the early 2000s — glass, water and blue sky. Cascades fill the Ecosystem; pearls float until the whirlpool or the lagoon takes them.</p>
      <div class="pills">${g.jackpots.map(([n, v]) => `<span class="${n.toLowerCase()}"><small>${n}</small><b>${v}</b></span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <span class="shore" aria-hidden="true"></span>`,

  'dead-air': (g) => `
  <div class="wrap top">
    <div class="mark">
      <p class="osd" aria-hidden="true"><span>▶ PLAY</span><span>03:13</span></p>
      <h1>Dead Air<span class="ch">Channel 13</span></h1>
      <p class="band"><b>13</b>Channel 13 · Unscheduled broadcast</p>
      <p class="line">At 03:13 your television picks up a channel that does not exist. Test cards, emergency alerts, worn VHS and a host who speaks to you, calmly. The fear is in what you almost see — never blood.</p>
      <div class="plates">${g.jackpots.map(([n, v], k) => `<span class="p${k}"><small>${n}</small><b>${v}</b></span>`).join('')}</div>
    </div>
    ${player(g)}
  </div>
  <span class="alert-band" aria-hidden="true"></span>`,
};

// Status and deliverables, checked per title (docs flags in data/games.mjs come from each project's docs folder).
const statusList = (g) => {
  const row = (ok, k, v) => `<li class="${ok ? 'y' : 'n'}"><i aria-hidden="true"></i><b>${k}</b><span>${v}</span></li>`;
  return [
    row(true, 'Game build', 'Playable · HTML5, desktop and mobile'),
    row(g.demo, 'Private demo', g.demo ? 'By invitation, fictional credits' : 'Evaluation build in preparation'),
    row(true, 'Math report', `${g.rtp.length} RTP versions · ${esc(g.math)}`),
    row(true, 'Integration', 'Integration guide and reference game server'),
    row(g.docs.compliance, 'Compliance matrix', g.docs.compliance ? `Market profiles documented${g.docs.lab ? ' · lab submission pack prepared' : ''}` : 'Not written yet'),
    row(!!g.trailer, 'English trailer', g.trailer ? `Yes · ${g.trailer.len}` : 'In production (Spanish cut exists)'),
    row(false, 'Lab certification', 'Agreed with each partner, for each market'),
  ].join('\n      ');
};

const factsheet = (g, staticDir) => existsSync(`${staticDir}/docs/${g.slug}-factsheet.pdf`)
  ? `<a class="btn ghost" href="/docs/${g.slug}-factsheet.pdf" download>Download the fact sheet (PDF)</a>` : '';

export function room(g, staticDir) {
  const i = games.indexOf(g), next = games[(i + 1) % games.length], prev = games[(i - 1 + games.length) % games.length];
  const demo = `/?game=${g.slug}#contact`;
  const body = `
<div class="wrap crumb mono"><a href="/#games">Games</a> / ${g.no} / <b>${esc(g.name)}</b></div>

<div class="room room-${g.room}">${heroes[g.room](g)}
</div>

<section class="glance"><div class="wrap">
  <p class="concept">${esc(g.concept)}</p>
  <div class="acts"><a class="btn" href="${demo}" data-game-link="${g.slug}">Request a private demo of ${esc(g.name)}</a>${factsheet(g, staticDir)}</div>
</div></section>

<section><div class="wrap">
  <div class="sec-head"><span class="mono">Three differences</span><h2 class="display gold">${esc(g.mechanicsTitle)}</h2><span class="mono">Loops are real captures</span></div>
  <div class="mech">
    ${g.mechanics.map((m) => `<figure><video data-src="/media/${m.video}.mp4" poster="/media/${m.video}.jpg" muted loop playsinline preload="none" aria-label="${esc(g.name)}, ${esc(m.name)}, real capture"></video><figcaption><h3>${esc(m.name)}</h3><p>${esc(m.text)}</p><span class="mono">Real capture · ${m.len}</span></figcaption></figure>`).join('\n    ')}
  </div>${g.walkthrough ? `
  <div class="walk"><button class="btn ghost" type="button" data-film="/video/${g.walkthrough.src}" data-poster="/media/${g.hero.video}.jpg" data-title="${esc(g.name)} · feature walkthrough ${g.walkthrough.len}">Watch the feature walkthrough · ${g.walkthrough.len}</button></div>` : ''}
</div></section>

<section><div class="wrap">
  <div class="sec-head"><span class="mono">Status and deliverables</span><h2 class="display gold">Where ${esc(g.name)} stands.</h2><span class="mono">Checked ${site.updated}</span></div>
  <div class="state">
    <ul class="checks">
      ${statusList(g)}
    </ul>
    <div class="adapt">
      <h3 class="display gold-s">Possible adaptations</h3>
      <ul>
        <li>Languages, currencies and market profiles</li>
        <li>RTP version and bet range${g.buy && !/^no bonus buy/.test(g.buy) ? '; bonus buy on or off per market' : ''}</li>
        <li>Integration with your RGS or API</li>
        <li>Lobby art, cutdowns and labels for your brand</li>
      </ul>
      <p>Each change is scoped with you first: what it touches, how long it takes and whether it needs new math or a new certification.</p>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <details class="tech">
    <summary><span class="mono">Technical data</span><span class="display gold-s">Key figures from the math report</span><span class="mono">${g.math} · not lab-certified</span></summary>
    <dl class="par">
      ${g.par.map(([k, v, s]) => `<div><dt>${k}</dt><dd>${v}</dd><small>${esc(s)}</small></div>`).join('\n      ')}
    </dl>
    <div class="rtp"><span>RTP versions</span>${g.rtp.map((r) => `<b>${r}</b>`).join('')}<span>· ${esc(g.buy)}</span></div>
    <p class="note">The full PAR sheet, the integration guide and the compliance documents are shared privately with evaluating partners.</p>
  </details>
  <div class="ask"><a class="btn" href="${demo}" data-game-link="${g.slug}">Request a private demo of ${esc(g.name)}</a><p>We review each request and send a personal invitation. Fictional credits only — no real-money play. 18+.</p></div>
</div></section>

<nav class="next" aria-label="More titles"><div class="wrap"><a href="/games/${prev.slug}" class="mono">← ${prev.no} · ${esc(prev.name)}</a><a href="/games/${next.slug}"><b class="display gold">${esc(next.name)} →</b></a></div></nav>`;

  return page({
    path: `/games/${g.slug}`, title: `${g.fullName || g.name} — ODDWIN Studios`, description: g.description,
    css: [`/css/rooms/${g.room}.css`], body, image: `/media/${g.hero.video}.jpg`,
    schema: [breadcrumbs([['ODDWIN Studios', '/'], ['Games', '/#games'], [g.name, `/games/${g.slug}`]])],
  });
}

export const roomPaths = () => games.map((g) => `/games/${g.slug}`);
export { site };
