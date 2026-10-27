# ODDWIN web v2 · Fase 0 · Inventario de contenido (26/10/2026)

Web B2B (distribuidoras, agregadores, casinos). Cada cifra de este documento sale del informe o la ficha del propio
juego (ruta indicada). Ninguna está certificada: en la web se dice así.

## 1 · La web actual (no se ha tocado)

- Proyecto: `~/Projects/oddwin-studios-web` · Next.js 16 + OpenNext en Cloudflare Workers (`wrangler.jsonc`, worker
  `oddwin`, dominios oddwinstudios.com y www). En producción ahora mismo; último commit 9769e34.
- **Sobra para B2B (primer concepto de afiliados):** `/slots` y `/slots/[slug]` (reseñas de juegos de terceros), `/casinos`,
  `/providers`, `/markets/[country]`, `/go/[offerId]` (redirección de afiliado), `/affiliate-disclosure`, `/methodology`,
  `src/data/{slots,casinos,offers,providers,markets,assets}.ts`, `lib/{affiliate-tracking,offers,eligibility,validation,facts}`,
  `docs/asset-permissions/` (permisos de imágenes de BTG, Pragmatic, Hacksaw…), tests `affiliate.spec.ts`.
- **Se aprovecha:** dominio y despliegue en Cloudflare, `partnership@oddwinstudios.com`, logo, páginas legales (a
  reescribir para B2B), tráilers ya subidos (AURA 6 s, Obsidian 10 s, Channel 13 15 s) y los subtítulos `.vtt`.
- Rutas viejas indexadas → **301** a la home o a `/games` en la v2 (nunca 200).
- Recomendación: proyecto nuevo y ligero (`~/Projects/oddwin-web-v2`), no podar el actual.

## 2 · Portfolio · datos medidos

| | PAGE BREAKER | AURA | OBSIDIAN · The Lost Vault | VICE MIAMI SPIN |
|---|---|---|---|---|
| Fuente | `page-breaker/docs/MATH_REPORT.md` (pbk-math-0.2.0) | `aura/05_docs/FICHA_TECNICA.md` (aura-math-0.4.0) | `obsidian-vault/docs/FICHA_TECNICA.md` (obv-math-1.0.0) | `vice-miami-spin/docs/FICHA_TECNICA.md` (vms-math-0.3.0) |
| Mundo | Cómic: el héroe sabe que vive en un cómic y rompe la página | Mito: santuario de obsidiana, oro fundido, aura violeta | Bóveda volcánica: obsidiana y oro kintsugi, magma y luna | Miami 80s: neón, atardecer, golpe a la caja fuerte |
| Rejilla | 5×3 · 20 líneas | 5×4 · 20 líneas | 5×3 · 20 líneas | 5×3 · 20 líneas |
| RTP | 96,13 / 94,13 / 92,22 / 88,40 % | 96,11 / 94,08 / 92,12 % | 96 / 94 / 92 / 88 % | 96 / 94 / 92 / 88 % (sim. 96,46 / 93,97 / 92,50 / 88,72 ±0,45) |
| Volatilidad | Alta (σ 8,8×) | Alta (σ 10,1×) | Alta (σ 11,6×) | Alta (σ 7,2×) |
| Premio máximo | 5.000× | 5.000× | **10.000×** | 5.000× |
| Frecuencia de premio | 32,9 % | 21,7 % | 32,8 % | 32,8 % |
| Funciones | Viñetas misterio · RIP & RESPIN · bonus de pelea con elección (mismo valor esperado) · DIRECTOR'S CUT FS con wilds fijos | ASCENSIÓN (Hold & Win, medidor ×2–×10) · ECLIPSE FS · MANOS DEL TITÁN · botes | Crisol (Collect) · MOLTEN LOCK (Hold & Win) · VAULT SPINS ×1→×10 · 4 botes de gema | COLLECT · HEIST HOLD (Hold & Win) · 4 botes · SUNSET HEIST FS |
| Frecuencias | FS 1/102 · pelea 1/195 | ASCENSIÓN 1/201 (71×) · ECLIPSE 1/272 (59×) | LOCK 1/163 (22,7×) · FS 1/196 (59,3×) | HOLD 1/171 (25,4×) · FS 1/184 (41,9×) |
| Compra de bonus | 40× (v96), por mercado | **No** (diseño de juego responsable) | 62× (v96), por mercado | 43×, por mercado |
| Servidor | RGS de referencia, bonus en varios pasos, rondas firmadas, recuperación | RGS, RNG criptográfico, cadena SHA-256 | RGS, rondas firmadas | RGS, rondas firmadas, promos |
| Docs B2B | MATH_REPORT · INTEGRATION · GDD · **falta FICHA_TECNICA y PITCH** | FICHA · MATH · PITCH · INTEGRATION · COMPLIANCE_MATRIX | FICHA · MATH · PITCH · INTEGRATION · COMPLIANCE · IDENTITY | FICHA · MATH · PITCH · INTEGRATION · COMPLIANCE |
| Estado | Prototipo jugable; demo privada online | «Candidata comercial» | Prototipo 1.0 (rediseño completo) | Prototipo 0.3 |

Corregir antes de publicar: la ficha de OBSIDIAN dice «Propiedad: propietario del proyecto · estudio por definir» → ODDWIN.
AURA tiene 3 versiones de RTP (no 4). Confirmar apuestas en euros por juego antes de ponerlas en la web.

## 3 · Vídeo

| Juego | Pieza | Duración | Formato | Peso | Idioma | Valoración para la web |
|---|---|---|---|---|---|---|
| PAGE BREAKER | Tráiler HyperFrames | 46,0 s | 16:9 | 58 MB | ES | El listón. Falta versión **EN** y versión web ≤ 15 MB |
| PAGE BREAKER | Tráiler vertical | 31,6 s | 9:16 | 41 MB | ES | Para LinkedIn/redes |
| AURA | Tráileres 6/15/30 s | 6–30 s | 16:9 y 9:16 | 8–38 MB | ES y **EN (30 s)** | Buenos; el de 30 s EN sirve tal cual. Vídeo de funciones 57 s ES/EN (11 MB) |
| OBSIDIAN | Tráiler | 54,8 s | 16:9 y 9:16 | 36 MB | ES (UI en español, rótulo «SHOWCASE · SECUENCIA DEMOSTRATIVA») | Captura en tiempo real (método anterior); largo. Rehacer EN al nivel PAGE BREAKER |
| OBSIDIAN | Kit de lanzamiento (Remotion) | 8 / 15 / 30 s | 1:1, 9:16, 16:9 | 1,5–13 MB | ES | El de operadores 16:9 (30 s) es aprovechable ya |
| VICE MIAMI SPIN | Tráiler | 53,6 s | 16:9 y 9:16 | 46 MB | ES | Método anterior; acaba en la tabla de resumen (cierre débil). Rehacer EN |

Necesario para la web (por juego): tráiler EN 16:9 ≤ 60 s en versión web ≤ 15 MB (H.264 CRF ~26, `+faststart`), póster,
3 loops de mecánica de 6–8 s sin sonido (WebM/MP4 ≤ 2 MB) y un showreel de 20–30 s para la home. Cloudflare Pages no admite
archivos > 25 MiB: los másters van a R2 o a la sala de prensa privada.

## 4 · Arte disponible
- PAGE BREAKER: `game/public/assets/{bg,char,sym}` (fondos, poses de Rip, símbolos), arte fuente con prompts en `production/comfy/runs`.
- AURA: `06_arte/{keyframes,symbols,jackpots}`; keyart ya en la web actual.
- OBSIDIAN: `game/public/assets` (fondos H/V base, hold y bonus; la Guardiana en 3 poses; atlas de símbolos).
- VICE: `game/public/assets` (personajes, fondos, atlas).
- Fotogramas de tráiler para maquetas: `design/frames/`.

## 5 · Lo que falta y de quién depende
| Pendiente | Quién |
|---|---|
| Bar & Cigar y Frutiger Eden: propietario de la IP, cómo se presentan (ODDWIN / colaboración / estudio asociado), tráiler, fichas y **permiso por escrito** | Javi + el amigo |
| ¿CHANNEL 13 sigue en la web? (hoy aparece; no está en la lista nueva) | Javi |
| Tráileres EN de PAGE BREAKER, OBSIDIAN y VICE (oddwin-cinematics) | Claude, con visto bueno |
| FICHA_TECNICA + PITCH de PAGE BREAKER | Claude (sale del MATH_REPORT) |
| Fotos o retratos reales de Javi y Nico (sin ellos, la página de estudio va sin caras, nunca con caras generadas) | Javi y Nico |
| Búsqueda de marca de los nombres de juego · licencia comercial de la música de vidIQ | Javi |
| Legal B2B: razón social, domicilio y datos fiscales para el aviso legal | Javi |

## 6 · Nota de las maquetas (26/10/2026)
Las maquetas usan fotogramas de los tráileres actuales, que llevan rótulos en español («LAS VIÑETAS «??» SE REVELAN»,
«TÚ ELIGES EL GOLPE», «7 PIEDRAS · 3 REGIROS») y la interfaz del juego en español. Para la web hacen falta **capturas
limpias en inglés** de cada juego (`?lang=en`, sin rótulos de tráiler) con la herramienta de captura de cada proyecto.
