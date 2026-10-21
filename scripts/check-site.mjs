import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:3000';
const routes=['/','/services','/games','/games/aura','/games/obsidian-the-lost-vault','/games/dead-air-channel-13','/slots','/slots/gates-of-olympus','/slots/reactoonz','/providers','/providers/netent','/markets/es','/casinos','/about','/contact','/methodology','/responsible-gambling','/affiliate-disclosure','/privacy','/terms'];
for(const route of routes){const res=await fetch(base+route);assert.equal(res.status,200,route);const html=await res.text();assert.match(html,/<html[^>]*lang="es"/,route);assert.ok(!html.includes('Análisised'),route);assert.match(html,/https:\/\/oddwinstudios\.com/,route);}
const assets=['/brand/oddwin-studios-logo.jpg','/studio/world-building-hero.webp','/games/aura/aura-keyart.webp','/games/aura/aura-trailer-6s-en.mp4','/games/aura/aura-trailer-es.vtt','/games/channel-13/channel-13-presenter.jpg','/games/channel-13/channel-13-teaser-15s.mp4','/games/obsidian/obsidian-teaser-poster.jpg','/games/obsidian/obsidian-teaser-10s.mp4','/robots.txt','/sitemap.xml'];
for(const asset of assets)assert.equal((await fetch(base+asset,{method:'HEAD'})).status,200,asset);
const home=await (await fetch(base+'/')).text();
for(const trailer of ['/games/aura/aura-trailer-6s-en.mp4','/games/channel-13/channel-13-teaser-15s.mp4','/games/obsidian/obsidian-teaser-10s.mp4'])assert.ok(home.includes(trailer),trailer);
assert.ok(!home.includes('Seguimos'),'Removed homepage section');
for(const market of ['gb','ca-on','se','de','mt'])assert.equal((await fetch(base+'/markets/'+market)).status,404,market);
assert.equal((await fetch(base+'/pagina-inexistente')).status,404);
assert.equal((await fetch(base+'/go/oferta-inexistente')).status,400);
assert.equal((await fetch(base+'/go/oferta-inexistente?market=es')).status,404);
console.log(`${routes.length} páginas en español, ${assets.length} recursos, tres tráilers y rutas no disponibles comprobados en ${base}`);
