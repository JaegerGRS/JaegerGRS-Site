# Version history

All dates reflect work that actually shipped or was prepared as a release. No fabricated earlier commits.

## v0.3.0 - 15 October 2026
- Each project now has its own colour theme across its pages: Svart violet, Grey Signal cyan, JaeTheTech blue, JAE rose, PC hardware ember and Rig API gold. The rest of the site stays grey, black and white.
- Expanded the sub pages with set-up steps, FAQs, a pricing table, a security section and a hosting guide (new aq and steps components).
- Paired the tray app with the live site (key made by the Worker, setup closed afterwards).
- Added an all-rights-reserved LICENSE.
- Deployed to Cloudflare with wrangler deploy (jaegergrs.com now serves the new site). Preview URLs are switched off (preview_urls = false). Live checks: security headers, 403 on wrong origin and on closed setup, 503 on rig POST without key.
- Added a contact form (`/api/contact`) with origin checks, honeypot, size limits and per-visitor rate limiting; mail via Cloudflare Email Service or Resend.
- Added the live PC panel (`/api/rig`) and `agent/rig-agent.mjs`, a PC app that connects with a secret key (DPAPI-encrypted on the PC, `RIG_TOKEN` secret on Cloudflare).
- Mobile, tablet, desktop and TV fixes: content visible without JavaScript, Escape/outside-click menu close, touch target sizes, larger scaling and focus rings for TV remotes.
- Added 8 project sub pages (24 pages in total): Svart tools, Grey Signal build and channel, JaeTheTech Personal AI, JAE engineering, and Rig API install, pricing and what-you-get. Each project page now summarises and links to them instead of being one long page.
- Deleted the unused `grey-signal-subscribe.png`.
- Fonts are now self-hosted (`public/assets/fonts`, 62 KB, Latin subset). The CSP no longer allows Google Fonts, `img-src` is limited to this site, and a test fails if any third-party host is ever added back.
- Removed `JaegerGRS-Site-main/`, an old duplicate copy of the whole project that was committed inside the repo (71 files).
- Re-themed the site to neutral black, grey and white; green is kept only for "online" and success states, and the red/amber error and warning colours are unchanged. The `npm run dev` live preview rebuilds and reloads on every edit.
- Optimisation pass: re-compressed the two large JPEGs (about 240 KB saved), added a proper 1200x630 social card plus Twitter card and Open Graph tags, JSON-LD for the Rig API product, cache headers for images (1 week) and scripts/styles (revalidated hourly), removed unused imports from every page file and the unused `share.svg`.
- The site checker now also enforces one `h1`, unique titles and descriptions, canonical links, image alt text and sizes, and a valid social image on every page.
- `npm run selfhost` runs the full site and API on your own PC (same Worker code as production) so you can test the Rig API and tray app privately, from this PC or any device on your network.
- `npm run notes` starts a private, password-protected page for jotting change requests to paste into Copilot Chat (local only, git-ignored).
- Docs, changelog page and CI checks brought up to date with the current site and tools.
- Rig API is now installed with one script tag (`/embed/rig-embed.js` plus its CSS): it builds and updates the live panel by itself. The product page shows the install line and pricing (£29 single site, £49 done-for-you, £79 five sites).
- New Rig API product page (projects/rig-api): the API and tray app are for sale, clearly marked as made for small sites and servers only. Buying enquiries use a new "Buy the Rig API" contact topic.
- The site can now create the pairing key itself: with the Cloudflare variable `RIG_SETUP=open`, the app's "Get key from site" button fetches it once. Closed by default.
- Added `JaegerRigAgent.exe`, a 24 KB native Windows tray app (agent/app): key typed into the app and stored with DPAPI, starts quietly with Windows, below-normal priority, near-zero CPU. CI builds it as a downloadable artifact.
- Contact rate limiting now persists in Durable Object storage, so limits survive the object being evicted.
- Extra security headers (COOP, `form-action`), security.txt and no-store API responses.
- Rebuilt around a page generator (`src/site/`) as the single source of truth.
- Added standalone-site links to svartsecurity.org, jaethetech.com, Grey Signal and GitHub from the home, projects and project pages.
- Added the JAE project page and real Grey Signal artwork.
- Brand-matched accents for Svart (indigo) and Grey Signal (orange).
- Worker now uses Cloudflare static assets so images are served correctly; added link/CSP checks and Worker tests to CI.
- Removed the one-off import workflows.
- Home and About now lead with who I am and what I do, then all projects.
- Reorganised the code into public/ (deployed files) and src/site/ (page generator).
- Grey Signal is now described as self-hosted at an open IP (no full site or domain yet).

- Deployed to Cloudflare and verified live. Turned off workers.dev preview URLs. Contact form needs the sender domain onboarded in Email Service.

## v0.2.0 — 14 October 2026
- Redesigned the portfolio with a restrained dark editorial visual system.
- Split projects, expertise, background, contact and changelog into real independent pages and nested subpages.
- Added detailed case studies for Svart Security, JaeTheTech, Grey Signal and hands-on PC hardware experience.
- Added project filtering, responsive navigation, breadcrumbs and 404 handling.
- Expanded page-specific SEO metadata, social previews and XML sitemap.
- Added route validation and Wrangler Worker deployment documentation.

## v0.1.0 — 14 October 2026
- Initial dark portfolio foundation, first technical project overviews, metadata and changelog.




