# Portfolio task status

Last checked: 15 October 2026. Detailed acceptance results and remaining implementation decisions are in [docs/IMPLEMENTATION-PLAN.md](docs/IMPLEMENTATION-PLAN.md); verified facts and content requiring confirmation are in [docs/CONTENT-AUDIT.md](docs/CONTENT-AUDIT.md).

## Verified complete

- Static site builds 26 pages; the portfolio retains its 25 content routes and 404 page.
- Worker API, contact validation, honeypot, origin checks and rate limiting are covered by tests. `GUARD_SALT` is configured as a production Worker secret using 32 cryptographically random bytes.
- `scripts/notes-server.mjs` has been reviewed: it binds only to `127.0.0.1`, requires its generated password and writes under the git-ignored `notes/` directory.
- Lighthouse production lab runs with Playwright Chromium: performance 99 on `/`, `/about/` and `/contact/` in clean runs (LCP 1.9 s, CLS 0, TBT 0 ms); accessibility and SEO 100 on `/`, `/projects/`, `/projects/rig-api/` and `/contact/`. Runs varied; these are not field Core Web Vitals. Homepage Best Practices scored 93, including a Cloudflare-injected inline script blocked by the site's CSP.
- Latest local validation: `npm run verify` passed (26 generated pages, 709 internal links and Worker tests).

## Still outstanding

- **Contact delivery:** Cloudflare must verify `website@jaegergrs.com` as an allowed sender. No test message was sent to a real recipient.
- **Cloudflare account checks/decisions:** confirm request-log retention and that `RIG_SETUP` is closed; decide whether to add Turnstile, disable `workers_dev`, or configure `contact@jaegergrs.com`.
- **Grey Signal HTTPS:** approve and configure a Cloudflare Tunnel and hostname. The current project link remains explicitly labelled HTTP; no DNS or tunnel changes have been made.
- **Owner-provided evidence and facts:** approved CV and verified education; photos/screenshots; confirmation of dates, workstation components, supported Windows versions, and Rig API pricing/support terms; decision on personal-disclosure wording.
- **Manual checks:** screen-reader use, real-browser zoom, LinkedIn Post Inspector, Google's Rich Results Test, and the tray application's context menu.
- **Repository history:** decide whether to remove the accidentally committed YouTube AI Story files; rewriting history requires an approved force-push.

No unsupported credentials, experience, evidence or security claims should be added while these items are pending.
