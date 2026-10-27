// Home: the release slate.
import { site } from '../data/site.mjs';
import { games, pending } from '../data/games.mjs';
import { page, esc, organization } from './layout.mjs';

const slateRow = (g) => `
  <article class="title rv" data-game="${g.slug}">
    <span class="n">${g.no}</span>
    <div>
      <h3 class="display gold">${esc(g.name)}</h3>
      <p class="kicker">${esc(g.kicker)}</p>
      <dl class="facts"><dt>Grid</dt><dd>${g.facts.grid}</dd><dt>RTP</dt><dd>${g.facts.rtp}</dd><dt>Volatility</dt><dd>${g.facts.volatility}</dd><dt>Max win</dt><dd>${g.facts.maxWin}</dd></dl>
      <span class="status"><i></i>${esc(g.status)}</span><br>
      <a class="more" href="/games/${g.slug}">Enter the room <span class="vh">of ${esc(g.name)}</span>→</a>
    </div>
    <figure class="still"><video data-src="/media/${g.still.video}.mp4" poster="/media/${g.still.video}.jpg" muted loop playsinline preload="none" aria-label="${esc(g.name)}, ${esc(g.still.caption)}, real capture"></video><span class="tag">Real capture</span><span class="cap">${esc(g.still.caption)}</span></figure>
  </article>`;

const pendingRow = (p) => `
  <article class="title pending rv">
    <span class="n">${p.no}</span>
    <div><h3 class="display gold">${esc(p.name)}</h3><p class="kicker">Partner studio title. Copy, figures and footage to come from its owner.</p><span class="status"><i></i>Material pending</span></div>
    <figure class="still"><span>Real footage only<br>— waiting for the build —</span></figure>
  </article>`;

export function home() {
  const total = games.length + pending.length;
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
  const body = `
<div class="hero"><div class="wrap stage">
  <div class="copy">
    <h1 class="display gold shine rv">Original slots with a world of their own.</h1>
    <p class="rv">We design, build and launch casino games — with the math, the game server and the launch film already done. For aggregators, distributors and operators.</p>
    <div class="ctas rv"><a class="btn" href="#slate">See the slate</a><a class="btn ghost" href="#contact">Request partner access</a></div>
  </div>
  <figure class="reel rv">
    <div class="frame"><i></i><video src="/media/reel.mp4" poster="/media/reel.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Showreel: real gameplay from Page Breaker, Obsidian, Vice Miami Spin and Aura"></video></div>
    <span class="prog"><i></i></span>
    <figcaption class="bar mono"><span><span class="rec"></span>Reel ${site.year} · real gameplay, frame by frame</span><span><b id="tc">00:00:00:00</b></span></figcaption>
  </figure>
</div>
<div class="wrap">
  <div class="figures rv">
    <div><b class="display gold">${games.length}</b><span>original titles in playable builds</span></div>
    <div><b class="display gold">10M</b><span>rounds simulated per RTP version</span></div>
    <div><b class="display gold">96%</b><span>top RTP version · 94, 92 and 88 also built</span></div>
    <div><b class="display gold">10,000×</b><span>top max win on the slate</span></div>
  </div>
</div></div>

<section id="slate"><div class="wrap">
  <div class="sec-head"><span class="mono">01 · The slate</span><h2 class="display gold">${words[total]} titles. ${words[total]} worlds.</h2><span class="mono">Figures from each game's PAR · not lab-certified</span></div>
${games.map(slateRow).join('\n')}
${pending.map(pendingRow).join('\n')}
</div></section>

<section id="ships"><div class="wrap">
  <div class="sec-head"><span class="mono">02 · What ships</span><h2 class="display gold">Every title arrives ready to launch.</h2><span class="mono">Per title, per market</span></div>
  <div class="credits">
    <div class="credit rv"><b class="display gold-s">HTML5 build</b><span>Desktop and mobile, landscape and portrait layouts designed separately. PixiJS, frame times measured.</span></div>
    <div class="credit rv"><b class="display gold-s">RTP versions + PAR</b><span>Up to four versions (96 / 94 / 92 / 88). Exact base-game calculation plus 10M-round simulation per version.</span></div>
    <div class="credit rv"><b class="display gold-s">Reference game server</b><span>Signed rounds, idempotency, round recovery, multi-step bonuses resolved server-side, promo rounds.</span></div>
    <div class="credit rv"><b class="display gold-s">Market profiles</b><span>Currency, language, bonus buy on/off, minimum spin time, session clock and net position, per jurisdiction.</span></div>
    <div class="credit rv"><b class="display gold-s">Launch film</b><span>16:9 and 9:16 trailers cut from the real game, frame by frame. Cutdowns and key art for your lobby.</span></div>
    <div class="credit rv"><b class="display gold-s">Integration &amp; compliance</b><span>API contract, integration guide and a compliance matrix to hand to your test lab.</span></div>
  </div>
</div></section>

<section id="deals"><div class="wrap">
  <div class="sec-head"><span class="mono">03 · Partners</span><h2 class="display gold">Four ways to work with us.</h2><span class="mono">Terms discussed per title</span></div>
  <div class="deals">
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">A</span><h3 class="display">Distribution</h3><p>Take the catalogue to your operators on a revenue share.</p></div>
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">B</span><h3 class="display">Market exclusive</h3><p>A title only your brand runs, in the markets you choose.</p></div>
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">C</span><h3 class="display">Bespoke &amp; reskin</h3><p>A new world on a proven engine, made with the same method.</p></div>
    <div class="deal rv"><span class="letter display gold" aria-hidden="true">D</span><h3 class="display">IP acquisition</h3><p>Buy the game outright: code, art sources, math and production records.</p></div>
  </div>
  <ol class="path">
    <li class="rv"><span class="mono">Step 1</span><b>20-minute call</b><span>Your markets, how you take content, timing.</span></li>
    <li class="rv"><span class="mono">Step 2</span><b>Private build + PAR</b><span>Personal access to the playable build and the math.</span></li>
    <li class="rv"><span class="mono">Step 3</span><b>Integration plan</b><span>Your RGS or ours, certification route per market.</span></li>
    <li class="rv"><span class="mono">Step 4</span><b>Pilot</b><span>Live with telemetry; we read retention together.</span></li>
  </ol>
</div></section>

<section id="studio"><div class="wrap">
  <div class="sec-head"><span class="mono">04 · Studio</span><h2 class="display gold">Two founders, one method.</h2><span class="mono">ODDWIN Studios</span></div>
  <div class="studio">
    <div>
      <p class="rv">ODDWIN Studios is Javi and Nico. We start every game from its world and its math at the same time, and we don't call anything finished until it has been measured: the RTP, the frame time, the loudness of the trailer.</p>
      <p class="rv">Every film you see here is the real game, captured frame by frame. No mock-ups, no pre-renders.</p>
    </div>
    <ul class="rv">
      <li><b>Math</b>Exact calculation + 10M-round simulation per RTP version, PAR sheet</li>
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
      <h2 class="display gold shine">Want one of these in your lobby?</h2>
      <p>Tell us your company and markets. We reply with private access to the builds, the PAR sheets and a time for a call.</p>
      <a class="mail" href="mailto:${site.email}">${site.email}</a>
    </div>
    <form class="form" data-to="${site.email}" aria-label="Request partner access">
      <label>Company<input name="company" autocomplete="organization" required></label>
      <label>You are<select name="type"><option>Aggregator</option><option>Distributor</option><option>Operator</option><option>Studio</option></select></label>
      <label>Markets<input name="markets" placeholder="e.g. UK, ES, MGA"></label>
      <label>Title of interest<select name="title">${games.map((g) => `<option>${esc(g.name)}</option>`).join('')}<option>The whole slate</option></select></label>
      <button class="btn" type="submit">Request access</button>
      <span class="note">Opens an email to ${site.email}. Nothing is stored on this site.</span>
    </form>
  </div>
</div>`;
  return page({
    path: '/', title: 'ODDWIN Studios — Original slots for aggregators, distributors and operators',
    description: site.description, css: ['/css/home.css', '/css/accents.css'], body, schema: [organization()],
  });
}
