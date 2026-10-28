# Internal: company details still to complete (not published)

The public legal notice and privacy page print these only once they are filled in `data/site.mjs` → `site.legal`.
Until then they are simply left out — the pages do not say "pending" and nothing is invented. This does **not** resolve
the legal requirement to identify the site owner; it only avoids publishing placeholders.

| Field | `site.legal` key | Where it appears | Status |
|---|---|---|---|
| Legal entity name (razón social) or the owner's full name | `company` | Legal notice "Owner", Privacy "Controller" | missing — the pages show "ODDWIN Studios" (trade name) |
| Tax ID (NIF / CIF) | `taxId` | Legal notice | missing |
| Registered address (domicilio) | `address` | Legal notice | missing |
| Registry details (Registro Mercantil), if any | `registry` | Legal notice | missing |

Also to confirm before publishing team details: full names, roles, photos and professional profiles of Javi and Nico
(the site currently shows first names only).

When the data is in: `node generate-site.mjs --release && npx wrangler deploy` (the `--release` flag refuses to build
while company, taxId or address are empty).
