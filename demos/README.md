# Private demos · demo.oddwinstudios.com

Evaluation builds of every ODDWIN game, shown only to invited business contacts. The Worker `oddwin-demos`
(`worker.js`) checks **every** request — the portal page and every game file — against a personal invitation stored in
Cloudflare KV. Without a valid invitation session the site answers 401 and serves nothing from `/play/`.

- No shared passwords. Each invitation is personal, covers a list of games and expires.
- The raw invitation token exists only in the link; KV stores its SHA-256. The session cookie is HMAC-signed
  (`SESSION_KEY` secret), `HttpOnly`, `Secure`, `SameSite=Lax`, and lasts until the invitation expires (max 30 days).
- Revoking takes effect within about a minute, also for sessions already open (KV propagation + a 30 s cache).
- `noindex` everywhere, `robots.txt` disallows all, no source maps, no dev/QA hooks in the builds.
- Anything sent to a browser can be inspected or saved: this protects access, not the files once they are in a
  browser. Do not put anything in a build that a partner must not keep.

## Procedure: request → review → grant → revoke

1. **A request arrives.** The website form (`/api/demo-request` in `../site/worker/demo-request.js`) mails
   partnership@oddwinstudios.com (secret `NOTIFY_TO`; Reply-To = the requester) and keeps a copy. To see the latest requests:
   `node admin.mjs requests`
2. **Review it** (company, role, markets). Reply from your mailbox if you need more information. Nothing is granted
   automatically.
3. **Grant access** to the games you choose:
   ```bash
   node admin.mjs grant --email name@company.com --name "Name" --company "Company" --games page-breaker,aura --days 14 --request <request id>
   ```
   `--games all` grants the whole catalogue. The command prints the personal link **once**; send it yourself from
   your mailbox. Suggested text: “Here is your personal access to the private demo of <games>, valid until <date>:
   <link>. Fictional credits only. Please don't forward it.”
4. **Follow up**: `node admin.mjs list` shows each invitation, its state, how many times the link was opened and when.
5. **Extend or revoke**:
   ```bash
   node admin.mjs extend <id> --days 7
   node admin.mjs revoke <id>
   ```

`admin.mjs` uses wrangler with the Cloudflare login on this Mac (`/Users/javiperezz7/Projects/oddwin-studios-web/node_modules/.bin/wrangler`,
override with `WRANGLER=`). Run it from this folder.

## Updating the builds

Each game builds its evaluation version with `npm run build:eval` in its own `game/` folder, which writes to
`builds/<slug>/` here (Vite base `/play/<slug>/`). Then:

```bash
node assemble.mjs        # copies only the games listed in READY into public/, refuses source maps / sources
npx wrangler deploy      # (wrangler from oddwin-studios-web/node_modules/.bin)
```

Only add a game to `READY` in `assemble.mjs` after its evaluation build has been verified (spin, bets to 100 €, buy,
preview, reset, desktop and mobile).

## Evaluation profile (all games)

100,000 € fictional balance with "Reset demo balance"; bets up to 100 € per spin; bonus buys at their real price
(math report) with the cost shown before confirming; "Preview feature" for features that cannot be bought — free,
resolved by the game's normal logic and RNG, and **its win is not added to the balance**; ribbons distinguish base
game, bought bonus and manual preview. RTP, odds, max win, rules and market profiles are unchanged. Normal builds of
each game do not contain these controls.
