// Host-level rules _redirects cannot express, all 301: http → https, www → apex, /page.html → /page.
// /api/demo-request is the demo request form (worker/demo-request.js). Everything else is the static site (dist/, with
// its _redirects and _headers).
import { demoRequest } from './worker/demo-request.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let move = false;
    if (url.protocol === 'http:' && url.hostname.endsWith('oddwinstudios.com')) { url.protocol = 'https:'; move = true; }
    if (url.hostname === 'www.oddwinstudios.com') { url.hostname = 'oddwinstudios.com'; move = true; }
    if (url.pathname.endsWith('.html')) { url.pathname = url.pathname.replace(/(index)?\.html$/, ''); move = true; }
    if (move) return Response.redirect(url.toString(), 301);
    if (url.pathname === '/api/demo-request') {
      try { return await demoRequest(request, env); } catch (e) {
        console.log(JSON.stringify({ evt: 'demo-request-error', error: String(e && e.message || e).slice(0, 200) }));
        return new Response(JSON.stringify({ ok: false, error: 'Something went wrong on our side. Please write to partnership@oddwinstudios.com.' }), { status: 500, headers: { 'content-type': 'application/json' } });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
