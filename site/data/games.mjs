// The slate. Every figure comes from the game's own report (path in `source`); none is lab-certified and the site says so.
// A field set to null is rendered as "not available yet" — never filled in by hand.

export const games = [
  {
    slug: 'page-breaker', no: '01', name: 'Page Breaker', room: 'page-breaker', accent: '#E8233F',
    source: 'page-breaker/docs/MATH_REPORT.md', math: 'pbk-math-0.2.0',
    kicker: 'A comic-book hero who knows he lives in a comic. He tears the page to respin, and picks fights with the artist who draws him.',
    description: 'Page Breaker is a 5×3 comic-book slot by ODDWIN Studios: mystery panels, Rip & Respin, a player-choice fight bonus and Director\'s Cut free spins. Up to 5,000× the bet.',
    status: 'Playable · private demo',
    facts: { grid: '5×3 · 20', rtp: '88.40–96.13%', volatility: 'High', maxWin: '5,000×' },
    par: [
      ['Grid', '5×3', '20 fixed lines'], ['Volatility', 'High', 'σ 8.8× per round'], ['Max win', '5,000×', 'hard cap in engine'],
      ['Hit rate', '32.9%', 'any win'], ['Free spins', '1 / 102', 'rounds'], ['Fight bonus', '1 / 195', 'rounds'],
    ],
    rtp: ['96.13%', '94.13%', '92.22%', '88.40%'], buy: 'bonus buy 40× (v96), switchable per market',
    hero: { video: 'pb_fight', label: 'The fight · real capture' },
    still: { video: 'pb_fight', caption: 'The fight · K.O.' },
    mechanicsTitle: 'What the player does.',
    mechanics: [
      { video: 'pb_mystery', name: 'Mystery panels', text: 'Blank panels flip and all reveal the same symbol.', len: '0:04' },
      { video: 'pb_rip', name: 'Rip & Respin', text: 'On a quiet spin Rip tears the page and respins the reels, holding the first two.', len: '0:06' },
      { video: 'pb_dc', name: 'Director\'s Cut', text: 'Ten free spins; every three collected levels up sticky wilds and adds spins.', len: '0:07' },
    ],
    trailer: { src: 'page-breaker_46s_en.mp4', poster: 'pb_fight.jpg', len: '0:46' }, // EN cut: page-breaker/trailer/film_en
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance', 'lobby', 'sources'],
  },
  {
    slug: 'obsidian', no: '02', name: 'Obsidian', fullName: 'Obsidian · The Lost Vault', room: 'obsidian', accent: '#E0662A',
    source: 'obsidian-vault/docs/FICHA_TECNICA.md', math: 'obv-math-1.0.0',
    kicker: 'A vault asleep beneath the volcano. Molten stones lock, the Crucible collects, and Vault Spins carry a molten multiplier up to ×10.',
    description: 'Obsidian · The Lost Vault is a 5×3 Hold & Win slot by ODDWIN Studios: the Crucible collect, Molten Lock and Vault Spins with a ×10 molten multiplier. Up to 10,000× the bet.',
    status: 'Playable · v1.0',
    facts: { grid: '5×3 · 20', rtp: '88–96%', volatility: 'High', maxWin: '10,000×' },
    par: [
      ['Grid', '5×3', '20 fixed lines'], ['Volatility', 'High', 'σ 11.6× per round'], ['Max win', '10,000×', 'total bet'],
      ['Hit rate', '32.8%', 'any win'], ['Molten Lock', '1 / 163', 'mean 22.7×'], ['Vault Spins', '1 / 196', 'mean 59.3×'],
    ],
    rtp: ['96%', '94%', '92%', '88%'], buy: 'bonus buy 62× (v96), switchable per market',
    jackpots: [['MINI', '20×', '#38D39F'], ['MINOR', '50×', '#4C8DFF'], ['MAJOR', '250×', '#A86BFF'], ['GRAND', '2,500×', '#FF3D5A']],
    hero: { video: 'obs_lock', label: 'Molten Lock · real capture' },
    still: { video: 'obs_lock', caption: 'Molten Lock' },
    mechanicsTitle: 'Three roads to the vault.',
    mechanics: [
      { video: 'obs_base', name: 'The Crucible', text: 'On reel 5 it collects every magma stone in view — values and jackpots — on any spin it lands.', len: '0:06' },
      { video: 'obs_lock', name: 'Molten Lock', text: 'Six or more stones lock in place for three respins that reset with every new stone. A full vault pays the Grand.', len: '0:07' },
      { video: 'obs_fs', name: 'Vault Spins', text: 'Three keys open eight spins, retriggerable to 48. Every Crucible raises the molten multiplier ×1 → ×10.', len: '0:07' },
    ],
    trailer: null, // EN cut pending
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance'],
  },
  {
    slug: 'aura', no: '03', name: 'Aura', room: 'aura', accent: '#A47BFF',
    source: 'aura/05_docs/FICHA_TECNICA.md', math: 'aura-math-0.4.0',
    kicker: 'An obsidian sanctuary and a celestial force held in a titan\'s hands. Ascension Hold & Win with an Aura meter up to ×10.',
    description: 'Aura is a 5×4 Hold & Win slot by ODDWIN Studios: Ascension with an Aura meter up to ×10, Eclipse free spins and the Titan\'s Hands. Up to 5,000× the bet. No bonus buy.',
    status: 'Commercial candidate',
    facts: { grid: '5×4 · 20', rtp: '92.12–96.11%', volatility: 'High', maxWin: '5,000×' },
    par: [
      ['Grid', '5×4', '20 fixed lines'], ['Volatility', 'High', 'σ 10.1× per round'], ['Max win', '5,000×', 'total bet'],
      ['Hit rate', '21.7%', 'any win'], ['Ascension', '1 / 201', 'mean 71.0×'], ['Eclipse', '1 / 272', 'mean 59.2×'],
    ],
    rtp: ['96.11%', '94.08%', '92.12%'], buy: 'no bonus buy, no autoplay, no turbo — by design',
    jackpots: [['MINOR', '20×'], ['MAJOR', '100×'], ['GRAND', '1,000×']],
    hero: { video: 'aura_hands', label: 'The Titan\'s Hands · real capture' },
    still: { video: 'aura_hands', caption: 'The Titan\'s Hands' },
    mechanicsTitle: 'Three ways the aura rises.',
    mechanics: [
      { video: 'aura_asc', name: 'Ascension', text: 'Six or more orbs start a Hold & Win. The Aura meter climbs ×2 → ×10; a full grid of twenty pays the Grand.', len: '0:07' },
      { video: 'aura_eclipse', name: 'Eclipse', text: 'Three, four or five Eclipse discs give 8, 10 or 12 free spins, with an Aura meter that never resets.', len: '0:07' },
      { video: 'aura_hands', name: 'The Titan\'s Hands', text: 'The golden hands rise from the corners and cup an orb: +1× on the multiplier, every time.', len: '0:06' },
    ],
    trailer: { src: 'aura_30s_en.mp4', poster: 'aura_hands.jpg', len: '0:30' },
    walkthrough: { src: 'aura_features_en.mp4', len: '0:57' },
    kit: ['trailer', 'factsheet', 'build', 'par3', 'integration', 'compliance', 'lab', 'lobby'],
  },
  {
    slug: 'vice-miami-spin', no: '04', name: 'Vice Miami Spin', room: 'vice', accent: '#FF4FB0',
    source: 'vice-miami-spin/docs/FICHA_TECNICA.md', math: 'vms-math-0.3.0',
    kicker: 'Neon sunset, bags of cash and a six-bag heist. Collect takes everything; a full Heist Hold pays the Grand.',
    description: 'Vice Miami Spin is a 5×3 neon Hold & Win slot by ODDWIN Studios: Collect, Heist Hold with four jackpots and Sunset Heist free spins. Up to 5,000× the bet.',
    status: 'Playable · v0.3',
    facts: { grid: '5×3 · 20', rtp: '88–96%', volatility: 'High', maxWin: '5,000×' },
    par: [
      ['Grid', '5×3', '20 fixed lines'], ['Volatility', 'High', 'σ 7.2× per round'], ['Max win', '5,000×', 'cap per round'],
      ['Hit rate', '32.8%', 'any win'], ['Heist Hold', '1 / 171', 'mean 25.4×'], ['Free spins', '1 / 184', 'mean 41.9×'],
    ],
    rtp: ['96%', '94%', '92%', '88%'], buy: 'free-spins buy 43×, switchable per market',
    jackpots: [['MINI', '25×'], ['MINOR', '75×'], ['MAJOR', '250×'], ['GRAND', '2,000×']],
    hero: { video: 'vice_hold', label: 'Heist Hold · real capture' },
    still: { video: 'vice_hold', caption: 'Heist Hold' },
    mechanicsTitle: 'How the heist goes down.',
    mechanics: [
      { video: 'vice_base', name: 'Collect', text: 'Cash bags hide prizes and jackpots; the Collect bag takes every one in view.', len: '0:05' },
      { video: 'vice_hold', name: 'Heist Hold', text: 'Six bags start the hold. Bags stay, every new one resets the respins, and a full screen pays the Grand.', len: '0:07' },
      { video: 'vice_fs', name: 'Sunset Heist', text: 'Three briefcases open retriggerable free spins with more money on the reels.', len: '0:07' },
    ],
    trailer: null, // EN cut pending
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance'],
  },
  {
    slug: 'bar-and-cigar', no: '05', name: 'Bar & Cigar Bonanza', room: 'bar-and-cigar', accent: '#E7A33A',
    source: 'oddwin-nico/juegos/bar-and-cigar/docs/FICHA_TECNICA.md', math: 'bcb-0.4',
    kicker: 'A battered old tavern that acts like the most exclusive club in town. The Fumatrón 3000 turns the reels to smoke, and the house always pours one more round.',
    description: 'Bar & Cigar Bonanza is a 5×4 tavern-comedy slot by ODDWIN Studios: Fumatrón 3000 smoke wilds with the Humómetro up to ×25, One More Round free rounds with La Cuenta up to ×10, house tokens collected by La Caja, and La Hora Feliz Hold & Win with four jackpots. Up to 5,000× the bet.',
    status: 'Playable · bcb-0.4',
    facts: { grid: '5×4 · 20', rtp: '87.83–95.83%', volatility: 'High', maxWin: '5,000×' },
    par: [
      ['Grid', '5×4', '20 fixed lines'], ['Volatility', 'High', 'σ 11.6× per spin'], ['Max win', '5,000×', 'cap per round'],
      ['Hit rate', '33.1%', 'any win'], ['La Hora Feliz', '1 / 197', 'spins'], ['One More Round', '1 / 175', 'spins'],
    ],
    rtp: ['95.83%', '93.78%', '91.85%', '87.83%'], buy: 'One More Round buy 47× (v96), off by default and blocked in the ES and UK profiles',
    jackpots: [['CHUPITO', '20×'], ['COPA', '50×'], ['RESERVA', '200×'], ['GRAN RESERVA', '1,000×']],
    hero: { video: 'bc_happy', label: 'La Hora Feliz · real capture' },
    still: { video: 'bc_smoke', caption: 'Fumatrón 3000' },
    mechanicsTitle: 'What the house serves.',
    mechanics: [
      { video: 'bc_smoke', name: 'Fumatrón 3000', text: 'On reels 2–4 it turns itself and every cell above it into HUMO, the wild smoke. The Humómetro (×2 to ×25) multiplies only the lines that pass through it.', len: '0:07' },
      { video: 'bc_round', name: 'One More Round', text: 'Three, four or five bells pour 8, 10 or 12 rounds. La Cuenta — the tab — starts at ×2 and climbs +1 per bell up to ×10; three bells in one round pour ¡Otra Ronda!, four more.', len: '0:07' },
      { video: 'bc_happy', name: 'La Hora Feliz', text: 'Happy hour: six or more house tokens stay for three respins that reset with every new token. La Caja on reel 5 collects them all; fill twenty cells for the Gran Reserva.', len: '0:07' },
    ],
    trailer: null, // EN cut pending (the 50 s trailer exists in Spanish only)
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance'],
  },
  {
    slug: 'frutiger-eden', no: '06', name: 'Frutiger Eden', room: 'eden', accent: '#36E0FF',
    source: 'oddwin-nico/juegos/eden/docs/FICHA_TECNICA.md', math: 'eden-1.0',
    kicker: 'A bright digital paradise from the early 2000s, all glass and water. Cascades fill the Ecosystem until Aqua Nova opens, and floating pearls are swept up by the whirlpool or held in Pearl Lagoon.',
    description: 'Frutiger Eden is a 5×4, 1,024-ways cascading slot by ODDWIN Studios: the Ecosystem column, Aqua Nova free spins with a bloom multiplier up to ×5, a whirlpool Collect and the Pearl Lagoon Hold & Win with four jackpots. Up to 5,000× the bet.',
    status: 'Playable · eden-1.0',
    facts: { grid: '5×4 · 1,024', rtp: '87.73–96.28%', volatility: 'High', maxWin: '5,000×' },
    par: [
      ['Grid', '5×4', '1,024 ways, cascades'], ['Volatility', 'High', 'σ ≈ 9.5× per round'], ['Max win', '5,000×', 'published cap'],
      ['Hit rate', '36.3%', 'any win'], ['Aqua Nova', '1 / 280', 'mean 99×'], ['Pearl Lagoon', '1 / 194', 'mean 30×'],
    ],
    rtp: ['96.28%', '94.01%', '92.49%', '87.73%'], buy: 'Aqua Nova buy 104× (v96), switchable per market',
    jackpots: [['MINI', '20×'], ['MINOR', '50×'], ['MAJOR', '250×'], ['GRAND', '1,000×']],
    hero: { video: 'eden_lagoon', label: 'Pearl Lagoon · real capture' },
    still: { video: 'eden_nova', caption: 'Aqua Nova' },
    mechanicsTitle: 'Where the water goes.',
    mechanics: [
      { video: 'eden_cascade', name: 'Ecosystem', text: 'Winners dissolve into water and new symbols fall. Every winning cascade raises the Ecosystem column one level; at four, Aqua Nova begins.', len: '0:07' },
      { video: 'eden_nova', name: 'Aqua Nova', text: 'Eight spins that keep the water between spins. Every two winning cascades the column blooms: +1 multiplier up to ×5 and +2 spins, up to twenty.', len: '0:07' },
      { video: 'eden_lagoon', name: 'Pearl Lagoon', text: 'Six or more pearls lock for three respins that reset with every new pearl. Fill all twenty cells for the Grand.', len: '0:07' },
    ],
    trailer: null, // EN cut pending (the 44 s trailer exists in Spanish only)
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance'],
  },
  {
    slug: 'dead-air', no: '07', name: 'Dead Air', fullName: 'Dead Air · Channel 13', room: 'dead-air', accent: '#D6281C',
    source: 'dead-air-n1/dead-air/docs/FICHA_TECNICA.md', math: 'DA13-N1',
    kicker: 'At 03:13 your television picks up a channel that does not exist. The whole game is that broadcast — test cards, emergency alerts, worn VHS and a host who speaks to you, calmly.',
    description: 'Dead Air · Channel 13 is a 5×3 analogue-horror slot by ODDWIN Studios: a persistent Signal meter, the Emergency Broadcast Hold & Win and the It’s in the Building bonus, where something crawls across the monitor wall. No gore. Up to 5,000× the bet.',
    status: 'Playable · DA13-N1',
    facts: { grid: '5×3 · 20', rtp: '88–96%', volatility: 'Medium-high', maxWin: '5,000×' },
    par: [
      ['Grid', '5×3', '20 fixed lines'], ['Volatility', 'Medium-high', 'σ 5.84× per round'], ['Max win', '5,000×', 'also on buys'],
      ['Hit rate', '42.9%', 'any win'], ['Emergency Broadcast', '1 / 102.6', 'EV 21.76×'], ['It’s in the Building', '1 / 227.5', 'EV 61.40×'],
    ],
    rtp: ['96.00%', '94.00%', '92.00%', '88.00%'], buy: 'two buys (Emergency Broadcast 22.5×, It’s in the Building 64×, v96), switchable per market',
    jackpots: [['ADVISORY', '20×'], ['ALERT', '50×'], ['EMERGENCY', '150×'], ['END OF BROADCAST', '1,000×']],
    hero: { video: 'da_emergency', label: 'Emergency Broadcast · real capture' },
    still: { video: 'da_signal', caption: 'The Signal meter' },
    mechanicsTitle: 'What the channel broadcasts.',
    mechanics: [
      { video: 'da_signal', name: 'Signal', text: 'Every test card brings something one step closer. The meter keeps its thirteen steps per bet; full, or three cards at once, and it’s in the building.', len: '0:05' },
      { video: 'da_emergency', name: 'Emergency Broadcast', text: 'Six or more sightings lock for three respins that reset with every new one. Advisory, Alert and Emergency plates; fill all fifteen for End of Broadcast.', len: '0:07' },
      { video: 'da_building', name: 'It’s in the Building', text: 'Eight transmissions. Something crawls along a route of adjacent monitors and they turn into EYE wilds. Above 250× the celebration runs in reverse: silence, black, one line and the figure.', len: '0:07' },
    ],
    trailer: null, // EN cut pending (the 30 s trailer and the 89 s walkthrough exist in Spanish only)
    kit: ['trailer', 'factsheet', 'build', 'par4', 'integration', 'compliance', 'sources'],
  },
];

// Titles announced before their footage, figures and permission arrive: shown as "material pending". None today.
export const pending = [];

// Partner kit rows. `public` files are linked only if they exist under static/docs; otherwise they read "on request".
export const kitItems = {
  trailer: ['Trailers 16:9 and 9:16', 'public'],
  factsheet: ['One-page fact sheet (PDF)', 'public'],
  build: ['Playable build, desktop and mobile', 'partner'],
  par4: ['PAR sheet · 4 RTP versions', 'partner'],
  par3: ['PAR sheet · 3 RTP versions', 'partner'],
  integration: ['Integration guide · RGS contract', 'partner'],
  compliance: ['Compliance matrix · market profiles', 'partner'],
  lab: ['Lab submission pack', 'partner'],
  lobby: ['Key art, cutdowns and lobby tiles', 'partner'],
  sources: ['Source art with production records', 'ip'],
};
