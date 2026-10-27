// Host-level rules _redirects cannot express, all 301: http → https, www → apex, /page.html → /page.
// Everything else is the static site (dist/, with its _redirects and _headers).
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    let move = false;
    if (url.protocol === 'http:') { url.protocol = 'https:'; move = true; }
    if (url.hostname === 'www.oddwinstudios.com') { url.hostname = 'oddwinstudios.com'; move = true; }
    if (url.pathname.endsWith('.html')) { url.pathname = url.pathname.replace(/(index)?\.html$/, ''); move = true; }
    return move ? Response.redirect(url.toString(), 301) : env.ASSETS.fetch(request);
  },
};
