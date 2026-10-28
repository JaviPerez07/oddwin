// ODDWIN Studios · the only script on the site. No trackers, no cookies.
// Reveal on scroll (transform/opacity only), loops that play only while visible, reel timecode,
// trailer dialog, and the demo request form (sent to /api/demo-request on our own server).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  const rv = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach((el) => rv.observe(el));

  // Lazy loops: source attached on first view, paused off-screen; with reduced motion only the poster shows.
  const vids = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      if (!reduce) v.play().catch(() => {});
    } else v.pause();
  }), { threshold: 0.35 });
  document.querySelectorAll('video[data-src]').forEach((v) => vids.observe(v));

  const reel = document.querySelector('.reel video');
  if (reel) {
    const bar = document.querySelector('.reel .prog i'), tc = document.getElementById('tc');
    reel.addEventListener('timeupdate', () => {
      const t = reel.currentTime, f = Math.floor((t % 1) * 30);
      tc.textContent = ['00', Math.floor(t / 60), Math.floor(t % 60), f].map((n) => String(n).padStart(2, '0')).join(':');
      bar.style.width = (t / (reel.duration || 1)) * 100 + '%';
    });
  }

  // Trailer dialog: the film loads only when asked for, and stops when closed.
  const dlg = document.querySelector('dialog.film');
  if (dlg) {
    const v = dlg.querySelector('video'), title = dlg.querySelector('.bar span');
    document.querySelectorAll('[data-film]').forEach((b) => b.addEventListener('click', () => {
      v.src = b.dataset.film; v.poster = b.dataset.poster || '';
      title.textContent = b.dataset.title;
      dlg.showModal(); v.play().catch(() => {});
    }));
    dlg.querySelector('.close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { v.pause(); v.removeAttribute('src'); v.load(); });
  }

  // Demo request. Game links carry ?game=<slug> (kept in the URL) and the form preselects it; the generic link leaves
  // "Select a game". utm_source / utm_campaign (or the referring page) ride along as source and campaign. The request
  // goes to our server with an idempotency key that survives retries, so a flaky connection never files it twice.
  const form = document.getElementById('demo-form');
  if (form) {
    const q = new URLSearchParams(location.search), keep = (k, v) => { try { if (v) sessionStorage.setItem(k, v); return sessionStorage.getItem(k) || ''; } catch { return v || ''; } };
    const sel = form.elements.game, msg = form.querySelector('.msg'), btn = form.querySelector('button[type=submit]');
    const pick = (slug) => { if (slug && [...sel.options].some((o) => o.value === slug)) sel.value = slug; };
    pick(q.get('game'));
    form.elements.source.value = keep('oddwin_src', q.get('utm_source') || (document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer.slice(0, 200) : '')) || 'direct';
    form.elements.campaign.value = keep('oddwin_cmp', q.get('utm_campaign'));
    // on the home page, a game's demo link only has to pick the game and scroll
    document.querySelectorAll('[data-game-link]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault(); pick(a.dataset.gameLink);
      history.replaceState(null, '', `?game=${a.dataset.gameLink}${q.get('utm_campaign') ? `&utm_campaign=${encodeURIComponent(q.get('utm_campaign'))}` : ''}#contact`);
      document.getElementById('contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));
    const t0 = Date.now();
    let key = null;
    const say = (t, cls) => { msg.textContent = t; msg.className = 'msg ' + (cls || ''); };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      const bad = [...form.querySelectorAll('[required]')].filter((el) => !el.value.trim() || (el.type === 'email' && !el.checkValidity()));
      if (bad.length) { bad.forEach((el) => el.setAttribute('aria-invalid', 'true')); bad[0].focus(); say('Please fill in the highlighted fields.', 'err'); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      key = key || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());
      data.key = key; data.elapsed = Date.now() - t0; data.page = location.pathname;
      btn.disabled = true; say('Sending…');
      try {
        const r = await fetch('/api/demo-request', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.ok) {
          say(`Thank you — your request${j.game ? ` for ${j.game}` : ''} has reached our team. We review every request and reply by email.`, 'ok');
          form.reset(); pick(''); key = null;
          form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = true; });
          return;
        }
        if (j.fields) j.fields.forEach((n) => form.elements[n] && form.elements[n].setAttribute('aria-invalid', 'true'));
        say(j.error || 'We could not send your request. Please try again, or write to partnership@oddwinstudios.com.', 'err');
      } catch {
        say('The connection failed. Please try again — your request will not be sent twice — or write to partnership@oddwinstudios.com.', 'err');
      }
      btn.disabled = false;
    });
  }
})();
