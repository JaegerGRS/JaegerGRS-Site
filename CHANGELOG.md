# Version history

All dates reflect work that actually shipped or was prepared as a release. No fabricated earlier commits.

## v0.3.0 - 15 October 2026
- Added a contact form (`/api/contact`) with origin checks, honeypot, size limits and per-visitor rate limiting; mail via Cloudflare Email Service or Resend.
- Added the live PC panel (`/api/rig`) and `agent/rig-agent.mjs`, a PC app that connects with a secret key (DPAPI-encrypted on the PC, `RIG_TOKEN` secret on Cloudflare).
- Mobile, tablet, desktop and TV fixes: content visible without JavaScript, Escape/outside-click menu close, touch target sizes, larger scaling and focus rings for TV remotes.
- Rig API is now installed with one script tag (`/embed/rig-embed.js` plus its CSS): it builds and updates the live panel by itself. The product page shows the install line and pricing (£29 single site, £59 done-for-you).
- New Rig API product page (projects/rig-api): the API and tray app are for sale, clearly marked as made for small sites and servers only. Buying enquiries use a new "Buy the Rig API" contact topic.
- The site can now create the pairing key itself: with the Cloudflare variable `RIG_SETUP=open`, the app's "Get key from site" button fetches it once. Closed by default.
- Added `JaegerRigAgent.exe`, a 24 KB native Windows tray app (agent/app): key typed into the app and stored with DPAPI, starts quietly with Windows, below-normal priority, near-zero CPU. CI builds it as a downloadable artifact.
- Contact rate limiting now persists in Durable Object storage, so limits survive the object being evicted.
- Extra security headers (COOP, `form-action`), security.txt and no-store API responses.
- Rebuilt around a page generator (scripts/generate-pages.mjs) as the single source of truth.
- Added standalone-site links to svartsecurity.org, jaethetech.com, Grey Signal and GitHub from the home, projects and project pages.
- Added the JAE project page and real Grey Signal artwork.
- Brand-matched accents for Svart (indigo) and Grey Signal (orange).
- Worker now uses Cloudflare static assets so images are served correctly; added link/CSP checks and Worker tests to CI.
- Removed the one-off import workflows.
- Home and About now lead with who I am and what I do, then all projects.
- Reorganised the code into public/ (deployed files) and src/site/ (page generator).
- Grey Signal is now described as self-hosted at an open IP (no full site or domain yet).

## v0.2.0 — 14 October 2026
- Redesigned the portfolio with a restrained dark editorial visual system.
- Split projects, expertise, background, contact and changelog into real independent pages and nested subpages.
- Added detailed case studies for Svart Security, JaeTheTech, Grey Signal and hands-on PC hardware experience.
- Added project filtering, responsive navigation, breadcrumbs and 404 handling.
- Expanded page-specific SEO metadata, social previews and XML sitemap.
- Added route validation and Wrangler Worker deployment documentation.

## v0.1.0 — 14 October 2026
- Initial dark portfolio foundation, first technical project overviews, metadata and changelog.
