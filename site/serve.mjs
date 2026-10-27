#!/usr/bin/env node
// Local preview of dist/ that behaves like Cloudflare Pages: clean URLs (/legal → legal.html), _redirects (301),
// _headers (CSP included, so violations show up locally) and 404.html. Range requests for video.
//   node serve.mjs [port]   (default 5310)
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.argv[2] || 5310);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf' };
const redirects = readFileSync(join(dist, '_redirects'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/));
const headerBlocks = readFileSync(join(dist, '_headers'), 'utf8').split(/\n(?=\/|https?:)/).map((b) => { const [pat, ...rest] = b.trim().split('\n'); return [pat, rest.map((h) => h.trim().split(/:\s(.+)/))]; });
const match = (pat, p) => new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$').test(p);

createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  for (const [from, to, code] of redirects) if (match(from, p)) { res.writeHead(Number(code), { Location: to }); return res.end(); }
  if (p.endsWith('.html')) { res.writeHead(308, { Location: p.replace(/(index)?\.html$/, '') || '/' }); return res.end(); }
  let file = join(dist, p === '/' ? 'index.html' : p), status = 200;
  if (!existsSync(file) || statSync(file).isDirectory()) file = existsSync(file + '.html') ? file + '.html' : (status = 404, join(dist, '404.html'));
  const headers = { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  for (const [pat, hs] of headerBlocks) if (pat.startsWith('/') && match(pat, p)) for (const [k, v] of hs) headers[k] = v;
  const size = statSync(file).size, range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range && status === 200) {
    const start = Number(range[1] || 0), end = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(status, { ...headers, 'Content-Length': size });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`dist/ on http://localhost:${port}`));
