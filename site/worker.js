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
    const res = await env.ASSETS.fetch(request);
    return /\.(mp4|webm)$/.test(url.pathname) ? ranged(request, res) : res;
  },
};

// Static assets come back whole (200) even when the browser asks for a byte range, and without 206 the video player
// cannot seek. Videos are small enough (≤ 12 MB) to slice here.
async function ranged(request, res) {
  const range = request.headers.get('range');
  if (res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set('accept-ranges', 'bytes');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (!m[1] && !m[2])) return new Response(res.body, { status: 200, headers });
  const body = await res.arrayBuffer(), size = body.byteLength;
  let start = m[1] ? +m[1] : Math.max(0, size - +m[2]), end = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (start >= size || start > end) { headers.set('content-range', `bytes */${size}`); headers.delete('content-length'); return new Response(null, { status: 416, headers }); }
  headers.set('content-range', `bytes ${start}-${end}/${size}`);
  headers.set('content-length', String(end - start + 1));
  return new Response(request.method === 'HEAD' ? null : body.slice(start, end + 1), { status: 206, headers });
}
