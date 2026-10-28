// Site-wide settings. Legal fields stay null until the company details are final: the public pages simply leave them
// out (never "pending", never invented) and LEGAL_TODO.md keeps the internal list of what is missing.

export const site = {
  name: 'ODDWIN Studios',
  origin: 'https://oddwinstudios.com', // canonical: no www, no .html
  email: 'partnership@oddwinstudios.com',
  description: 'ODDWIN Studios is an independent studio with original, playable slots — documented math and a reference game server — available for commercial evaluation and adaptation by providers, distributors and publishers.',
  year: 2026,
  updated: '28 Oct 2026',            // date of the last title-by-title status check shown on the home page
  demoOrigin: 'https://demo.oddwinstudios.com',
  demoLive: true,                    // true only once invitations are deployed and tested end to end
  companyTypes: ['Game provider', 'Aggregator', 'Distributor', 'Publisher', 'Operator', 'Studio', 'Other'],
  legal: {
    company: null,      // razón social
    taxId: null,        // NIF / CIF
    address: null,      // domicilio
    registry: null,     // datos registrales, si los hay
  },
};

export const nav = [
  ['Games', '/#games'], ['Status', '/#status'], ['Deliverables', '/#ships'], ['Partners', '/#deals'], ['Studio', '/#studio'],
];

// Routes from the first (affiliate) concept, now retired. Every one gets a 301, never a 200.
export const retired = [
  ['/slots', '/#games'], ['/slots/*', '/#games'],
  ['/casinos', '/'], ['/casinos/*', '/'],
  ['/providers', '/'], ['/providers/*', '/'],
  ['/markets/*', '/'], ['/go/*', '/'],
  ['/affiliate-disclosure', '/'], ['/methodology', '/'],
  ['/services', '/#ships'], ['/about', '/#studio'], ['/contact', '/#contact'],
  ['/terms', '/legal'], ['/responsible-gambling', '/legal#responsible'],
  ['/games', '/#games'],
  ['/games/obsidian-the-lost-vault', '/games/obsidian'],
  ['/games/dead-air-channel-13', '/#games'],
];
