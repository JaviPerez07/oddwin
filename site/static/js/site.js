// ODDWIN Studios · the only script on the site. No trackers, no cookies.
// Reveal on scroll (transform/opacity only), loops that play only while visible, reel timecode,
// trailer dialog, and the contact form that hands the request to the visitor's mail client.
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

  // Contact: no server stores anything; the request opens as an email to partnership@.
  const form = document.querySelector('form.form');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form), get = (k) => (d.get(k) || '').toString().trim();
    const body = [`Company: ${get('company')}`, `We are: ${get('type')}`, `Markets: ${get('markets')}`, `Title of interest: ${get('title')}`, '', ''].join('\n');
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(`Partner access · ${get('company') || 'request'}`)}&body=${encodeURIComponent(body)}`;
  });
})();
