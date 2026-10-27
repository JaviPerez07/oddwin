// Site-wide settings. Legal fields stay null until Javi provides them; `node generate-site.mjs --release` refuses to
// build while any of them is null, so the legal notice can never go live half-empty.

export const site = {
  name: 'ODDWIN Studios',
  origin: 'https://oddwinstudios.com', // canonical: no www, no .html
  email: 'partnership@oddwinstudios.com',
  description: 'ODDWIN Studios designs, builds and launches original casino slots for aggregators, distributors and operators — math, game server and launch film included.',
  year: 2026,
  legal: {
    company: null,      // razón social
    taxId: null,        // NIF / CIF
    address: null,      // domicilio
    registry: null,     // datos registrales, si los hay
  },
};

export const nav = [
  ['Games', '/#slate'], ['What ships', '/#ships'], ['Partners', '/#deals'], ['Studio', '/#studio'], ['Contact', '/#contact'],
];

// Routes from the first (affiliate) concept, now retired. Every one gets a 301, never a 200.
export const retired = [
  ['/slots', '/#slate'], ['/slots/*', '/#slate'],
  ['/casinos', '/'], ['/casinos/*', '/'],
  ['/providers', '/'], ['/providers/*', '/'],
  ['/markets/*', '/'], ['/go/*', '/'],
  ['/affiliate-disclosure', '/'], ['/methodology', '/'],
  ['/services', '/#ships'], ['/about', '/#studio'], ['/contact', '/#contact'],
  ['/terms', '/legal'], ['/responsible-gambling', '/legal#responsible'],
  ['/games', '/#slate'],
  ['/games/obsidian-the-lost-vault', '/games/obsidian'],
  ['/games/dead-air-channel-13', '/#slate'],
];
