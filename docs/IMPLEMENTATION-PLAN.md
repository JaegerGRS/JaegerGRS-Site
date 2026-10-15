# Implementation phases: status and remaining plan (October 2026)

The work was done as small, separately verified, committed and deployed changes, not a rewrite. Each change ran `npm run verify` (page build, link and structure check, Worker tests) first.

## Phase 1: Audit and foundation: done
- Architecture documented (generator in `src/site`, Worker in `src/`, tray app in `agent/`, Durable Objects for rig state and rate limiting).
- Content accuracy audit: `docs/CONTENT-AUDIT.md`.
- Security-sensitive areas: `docs/SECURITY-REVIEW.md`. Do not change casually: `src/worker.mjs`, `src/lib/security.mjs` (CSP and headers), `src/lib/rig.mjs` and `src/rig-hub.mjs` (authentication and the public allowlist), `src/lib/contact.mjs`, `src/guard.mjs`, `wrangler.toml`, and the CI workflow.
- Baseline Lighthouse: **not recorded**. Chrome is not installed here. Core Web Vitals were measured with Chromium instead (see the changelog); install Chrome to add Lighthouse scores.

## Phase 2: Content and structure: done, except items needing your input
- Homepage positioning, international availability, project directory, expertise, About and Journey are done. Rig API sales content is secondary.
- Waiting on you: an approved CV and verified qualifications; approval of the personal-disclosure wording; confirmation of dates and workstation (see the audit).

## Phase 3: Visual modernisation: not a separate pass
- The existing design was kept. Shared tokens, cards, layouts and navigation already exist, and responsive fixes were made in the responsive pass. No redesign was carried out, and none is recommended before real photos and screenshots exist.

## Phase 4: Case studies: done as far as real evidence allows
- Every project has a case study with a status and limitations. The evidence register at `/projects/#evidence` lists what is missing: hardware photos, repair write-ups, and application screenshots for the tray app, JAE, Grey Signal's Windows app and Personal AI.

## Phase 5: SEO, accessibility, performance: done, with manual checks outstanding
- SEO checks run in CI. Responsive tested at 320 to 2560 px and landscape. Performance measured in Chromium (LCP 0.35 to 0.55 s unthrottled, 1.4 to 1.6 s throttled; CLS 0).
- Accessibility was tested with axe and keyboard checks. WCAG 2.2 AA compliance is **not claimed**. Still needed: a screen-reader pass, 200% zoom, LinkedIn Post Inspector, and Google's Rich Results Test.

## Phase 6: Security and final verification: done, with owner decisions outstanding
- Final checks on 15 October 2026: all 26 pages and the sitemap and robots.txt return 200; internal links pass (709); every external link resolves (LinkedIn blocks automated requests, so check it by hand); the live panel reports online with the allowlisted fields only.
- HTTP link: the only plain-HTTP link is the Grey Signal site at `http://94.0.68.77`. The migration plan is in `docs/GREY-SIGNAL-HTTPS-MIGRATION.md` and needs your approval.

## Owner decisions still open
1. Set the `GUARD_SALT` secret; fix sender verification for `website@jaegergrs.com`; decide on Turnstile and `contact@jaegergrs.com`.
2. Decide whether to turn off `workers_dev`; confirm `RIG_SETUP` is closed; confirm log retention.
3. Approve the Grey Signal Cloudflare Tunnel and hostname.
4. Supply the CV, qualifications, photos and screenshots.
5. Confirm the dates, workstation, Rig API prices and support terms.
6. Decide whether to purge the accidentally committed `YouTube AI Story` files (needs a force-push).
7. Install Chrome to record Lighthouse baselines.
