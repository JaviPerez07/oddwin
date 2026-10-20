import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:3000';
const routes=['/','/services','/games','/games/aura','/games/obsidian-the-lost-vault','/games/dead-air-channel-13','/slots','/slots/gates-of-olympus','/slots/reactoonz','/providers','/providers/netent','/markets/es','/markets/gb','/casinos','/about','/contact','/methodology','/responsible-gambling','/affiliate-disclosure','/privacy','/terms'];
for(const route of routes){const res=await fetch(base+route);assert.equal(res.status,200,route);const html=await res.text();assert.match(html,/<html[^>]*lang="es"/,route);assert.ok(!html.includes('Análisised'),route);assert.match(html,/https:\/\/oddwinstudios\.com/,route);}
for(const asset of ['/brand/oddwin-studios-logo.jpg','/studio/world-building-hero.webp','/games/aura/aura-keyart.webp','/games/aura/aura-trailer-6s-en.mp4','/games/aura/aura-trailer-es.vtt','/robots.txt','/sitemap.xml'])assert.equal((await fetch(base+asset,{method:'HEAD'})).status,200,asset);
assert.equal((await fetch(base+'/pagina-inexistente')).status,404);
assert.equal((await fetch(base+'/go/oferta-inexistente')).status,400);
assert.equal((await fetch(base+'/go/oferta-inexistente?market=es')).status,404);
console.log(`${routes.length} páginas en español, 7 recursos y 3 comprobaciones de rutas no disponibles comprobados en ${base}`);
