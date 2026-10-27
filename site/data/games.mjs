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
];

// Partner-studio titles: shown only as "material pending" until the owner sends footage, figures and written permission.
export const pending = [
  { no: '05', name: 'Bar & Cigar' },
  { no: '06', name: 'Frutiger Eden' },
];

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
