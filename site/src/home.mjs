// Home: what we are, the featured games, the rest of the catalogue, what a partner can evaluate today (verified per
// title), what we deliver and adapt, how we work together, the studio and the demo request.
import { site } from '../data/site.mjs';
import { games } from '../data/games.mjs';
import { page, esc, organization } from './layout.mjs';

const demoLink = (g) => `/?game=${g.slug}#contact`;

const featuredRow = (g) => `
  <article class="title rv" data-game="${g.slug}">
    <span class="n">${g.no}</span>
    <div>
      <h3 class="display gold">${esc(g.name)}</h3>
      <p class="kicker">${esc(g.concept)}</p>
      <dl class="facts"><dt>Grid</dt><dd>${g.facts.grid}</dd><dt>RTP</dt><dd>${g.facts.rtp}</dd><dt>Volatility</dt><dd>${g.facts.volatility}</dd><dt>Max win</dt><dd>${g.facts.maxWin}</dd></dl>
      <div class="go"><a class="more" href="/games/${g.slug}">See the game <span class="vh">${esc(g.name)}</span>→</a><a class="more alt" href="${demoLink(g)}" data-game-link="${g.slug}">Request a private demo <span class="vh">of ${esc(g.name)}</span></a></div>
    </div>
    <figure class="still"><video data-src="/media/${g.still.video}.mp4" poster="/media/${g.still.video}.jpg" muted loop playsinline preload="none" aria-label="${esc(g.name)}, ${esc(g.still.caption)}, real capture"></video><span class="tag">Real capture</span><span class="cap">${esc(g.still.caption)}</span></figure>
  </article>`;

const card = (g) => `
  <article class="card rv" data-game="${g.slug}">
    <a class="pic" href="/games/${g.slug}" tabindex="-1" aria-hidden="true"><video data-src="/media/${g.still.video}.mp4" poster="/media/${g.still.video}.jpg" muted loop playsinline preload="none"></video></a>
    <span class="n mono">${g.no}</span>
    <h3 class="display gold-s"><a href="/games/${g.slug}">${esc(g.name)}</a></h3>
    <p>${esc(g.concept)}</p>
    <span class="mono spec">${g.facts.grid} · ${g.facts.volatility} · ${g.facts.maxWin}</span>
    <a class="more" href="${demoLink(g)}" data-game-link="${g.slug}">Request a private demo <span class="vh">of ${esc(g.name)}</span>→</a>
  </article>`;

// Every cell is checked against the game's project folder; "In preparation" / "Not yet" mean exactly that.
const COLS = ['Build', 'Private demo', 'Math report', 'Compliance matrix', 'English trailer', 'Lab certification'];
const cell = (ok, t, c) => `<td class="${ok ? 'y' : 'n'}" data-label="${COLS[c]}"><i aria-hidden="true"></i>${t}</td>`;
const statusRow = (g) => `
      <tr><th scope="row"><a href="/games/${g.slug}">${esc(g.name)}</a></th>${cell(true, 'Playable', 0)}${cell(g.demo, g.demo ? 'By invitation' : 'In preparation', 1)}${cell(true, g.rtp.length + ' RTP versions', 2)}${cell(g.docs.compliance, g.docs.compliance ? 'Yes' : 'Not yet', 3)}${cell(!!g.trailer, g.trailer ? 'Yes' : 'Spanish only', 4)}${cell(false, 'Per partner and market', 5)}</tr>`;

export function home() {
  const featured = games.filter((g) => g.featured), rest = games.filter((g) => !g.featured);
  const body = `
<div class="hero"><div class="wrap stage">
  <div class="copy">
    <h1 class="display gold shine rv">Original games. Built to adapt to your platform.</h1>
    <p class="rv">ODDWIN Studios is an independent games studio. Our slots are developed and playable, each with its own world, documented math and a reference game server — available for commercial evaluation and for adaptation to a provider's, distributor's or publisher's needs.</p>
    <div class="ctas rv"><a class="btn" href="#games">Explore the games</a><a class="btn ghost" href="#contact">Request a private demo</a></div>
  </div>
  <figure class="reel rv">
    <div class="frame"><i></i><video src="/media/reel.mp4" poster="/media/reel.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Showreel: real gameplay from Page Breaker, Obsidian, Vice Miami Spin and Aura"></video></div>
    <span class="prog"><i></i></span>
    <figcaption class="bar mono"><span><span class="rec"></span>Reel ${site.year} · real gameplay, frame by frame</span><span><b id="tc">00:00:00:00</b></span></figcaption>
  </figure>
</div>
<div class="wrap">
  <div class="figures rv">
    <div><b class="display gold">${games.length}</b><span>original games with playable builds</span></div>
    <div><b class="display gold">Private</b><span>demos per partner, by invitation</span></div>
    <div><b class="display gold">PAR</b><span>math report per RTP version, up to four</span></div>
    <div><b class="display gold">RGS</b><span>reference game server and integration guide</span></div>
  </div>
</div></div>

<section id="games"><div class="wrap">
  <div class="sec-head"><span class="mono">01 · Featured</span><h2 class="display gold">${featured.length === 3 ? 'Three' : featured.length} games to start with.</h2><span class="mono">Figures from each game's math report · not lab-certified</span></div>
${featured.map(featuredRow).join('\n')}
  <div class="sec-head sub"><span class="mono">Catalogue</span><h2 class="display gold">${rest.length} more worlds.</h2><span class="mono">Each one has its own page</span></div>
  <div class="cards">
${rest.map(card).join('\n')}
  </div>
</div></section>

<section id="status"><div class="wrap">
  <div class="sec-head"><span class="mono">02 · Status</span><h2 class="display gold">What you can evaluate today.</h2><span class="mono">Checked title by title · ${site.updated}</span></div>
  <div class="tbl rv" tabindex="0" role="region" aria-label="Status per game"><table>
    <thead><tr><th scope="col">Game</th>${COLS.map((c) => `<th scope="col">${c}</th>`).join('')}</tr></thead>
    <tbody>${games.map(statusRow).join('')}
    </tbody>
  </table></div>
  <p class="foot rv">Every game also has an integration guide and a reference game server (RGS). Integration with your platform and certification by an accredited test lab are agreed with each partner, for each market; no title is lab-certified yet.</p>
</div></section>

<section id="ships"><div class="wrap">
  <div class="sec-head"><span class="mono">03 · Deliverables</span><h2 class="display gold">What a partner receives, and what we adapt.</h2><span class="mono">Scope agreed per project</span></div>
  <div class="two">
    <div class="credits">
      <div class="credit rv"><b class="display gold-s">Evaluation build</b><span>The game in HTML5, desktop and mobile, with fictional credits — opened through a private demo.</span></div>
      <div class="credit rv"><b class="display gold-s">Math report</b><span>Up to four RTP versions, exact base-game calculation and simulations of ten million rounds per version.</span></div>
      <div class="credit rv"><b class="display gold-s">Reference game server</b><span>Signed rounds, idempotency and round recovery, with an integration guide for your platform team.</span></div>
      <div class="credit rv"><b class="display gold-s">Market profiles</b><span>Currency, language, bonus buy on or off, minimum spin time and session clock, documented per title.</span></div>
      <div class="credit rv"><b class="display gold-s">Launch material</b><span>Trailers cut from the real game, loops and key art for lobbies and announcements.</span></div>
    </div>
    <div class="adapt rv">
      <h3 class="display gold-s">Adaptable, once we scope it together</h3>
      <ul>
        <li>Languages, currencies and market profiles</li>
        <li>RTP version, bet ranges, bonus buy on or off</li>
        <li>Integration with your RGS or API, with ours as reference</li>
        <li>Presentation for your brand: lobby art, cutdowns, labels</li>
        <li>Reskins on a proven engine and bespoke development</li>
      </ul>
      <p>We assess every change before agreeing to it: what it touches, how long it takes, and whether it needs new math or a new certification.</p>
    </div>
  </div>
</div></section>

<section id="deals"><div class="wrap">
  <div class="sec-head"><span class="mono">04 · Working together</span><h2 class="display gold">From private demo to launch.</h2><span class="mono">Terms agreed per title</span></div>
  <ol class="path">
    <li class="rv"><span class="mono">Step 1</span><b>Evaluation</b><span>A private demo of the games you choose, with the math report and the integration guide.</span></li>
    <li class="rv"><span class="mono">Step 2</span><b>Agreement and scope</b><span>Which titles, which markets, what needs adapting and who does what.</span></li>
    <li class="rv"><span class="mono">Step 3</span><b>Adaptation, integration, certification</b><span>The changes we agreed, integration with your platform, testing by an accredited lab for each market.</span></li>
    <li class="rv"><span class="mono">Step 4</span><b>Launch</b><span>Release through your brand and channels, with the launch material ready.</span></li>
  </ol>
  <div class="deals three">
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">1</span><h3 class="display">Publishing and distribution</h3><p>Our games in your catalogue or through your channels, under the hybrid model below.</p></div>
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">2</span><h3 class="display">Bespoke and adaptation</h3><p>Development for providers and studios: adaptations, reskins on our engines, new games to a brief.</p></div>
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">3</span><h3 class="display">Exclusivity or IP</h3><p>Market exclusivity or acquisition of a title, when both sides want it.</p></div>
  </div>
  <div class="model rv">
    <span class="mono">Commercial model · hybrid</span>
    <p><b>A licence fee to use the game, plus a commission on the GGR it generates on your platform.</b> The fee covers access, integration and the agreed adaptation; the GGR share keeps us aligned with how the game actually performs. Amounts and percentages are agreed per title and per market.</p>
  </div>
</div></section>

<section id="studio"><div class="wrap">
  <div class="sec-head"><span class="mono">05 · Studio</span><h2 class="display gold">Two founders, one method.</h2><span class="mono">ODDWIN Studios</span></div>
  <div class="studio">
    <div>
      <p class="rv">ODDWIN Studios is Javi and Nico. We start every game from its world and its math at the same time, and we measure before we call anything finished: the RTP of each version, the frame time, the loudness of the trailer.</p>
      <p class="rv">Every film you see here is the real game, captured frame by frame. No mock-ups, no pre-renders.</p>
    </div>
    <ul class="rv">
      <li><b>Math</b>Exact calculation + 10M-round simulation per RTP version</li>
      <li><b>Engine</b>TypeScript, deterministic and seed-driven; the art never decides a result</li>
      <li><b>Server</b>Reference RGS with signed rounds and recovery</li>
      <li><b>Art &amp; film</b>Original characters and worlds; trailers made from the game itself</li>
    </ul>
  </div>
</div></section>

<div class="contact" id="contact">
  <img class="emblem" data-qa-deco src="/img/brand/oddwin_mono.png" alt="">
  <div class="wrap">
    <div class="copy">
      <h2 class="display gold shine">Request a private demo.</h2>
      <p>Tell us who you are and which game you want to see. We review every request and reply with a personal invitation to the private demo and the documents for your team.</p>
      <p class="alt">Prefer email? <a class="mail" href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <form class="form" id="demo-form" action="/api/demo-request" method="post" novalidate>
      <div class="row2">
        <label>Name<input name="name" autocomplete="name" required maxlength="120"></label>
        <label>Work email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
      </div>
      <div class="row2">
        <label>Company<input name="company" autocomplete="organization" required maxlength="160"></label>
        <label>Company type<select name="type" required><option value="">Select…</option>${site.companyTypes.map((t) => `<option>${t}</option>`).join('')}</select></label>
      </div>
      <label>Game of interest<select name="game" required><option value="">Select a game</option>${games.map((g) => `<option value="${g.slug}">${esc(g.name)}</option>`).join('')}<option value="catalogue">Full catalogue</option></select></label>
      <label>Markets <small>optional</small><input name="markets" placeholder="e.g. UK, Spain, Malta" maxlength="200"></label>
      <label>Message <small>optional</small><textarea name="message" rows="3" maxlength="2000"></textarea></label>
      <label class="hp" aria-hidden="true" data-qa-ignore>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
      <input type="hidden" name="source"><input type="hidden" name="campaign">
      <button class="btn" type="submit">Request a private demo</button>
      <p class="msg" role="status" aria-live="polite"></p>
      <span class="note">We use these details only to answer this request. See <a href="/privacy">Privacy</a>.</span>
    </form>
  </div>
</div>`;
  return page({
    path: '/', title: 'ODDWIN Studios — Original slots for providers, distributors and publishers',
    description: site.description, css: ['/css/home.css', '/css/accents.css'], body, schema: [organization()],
  });
}
