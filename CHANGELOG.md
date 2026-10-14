# Version history

All dates reflect work that actually shipped or was prepared as a release. No fabricated earlier commits.

## v0.3.0 - 15 October 2026
- Rebuilt around a page generator (scripts/generate-pages.mjs) as the single source of truth.
- Added standalone-site links to svartsecurity.org, jaethetech.com, Grey Signal and GitHub from the home, projects and project pages.
- Added the JAE project page and real Grey Signal artwork.
- Brand-matched accents for Svart (indigo) and Grey Signal (orange).
- Worker now uses Cloudflare static assets so images are served correctly; added link/CSP checks and Worker tests to CI.
- Removed the one-off import workflows.

## v0.2.0 — 14 October 2026
- Redesigned the portfolio with a restrained dark editorial visual system.
- Split projects, expertise, background, contact and changelog into real independent pages and nested subpages.
- Added detailed case studies for Svart Security, JaeTheTech, Grey Signal and hands-on PC hardware experience.
- Added project filtering, responsive navigation, breadcrumbs and 404 handling.
- Expanded page-specific SEO metadata, social previews and XML sitemap.
- Added route validation and Wrangler Worker deployment documentation.

## v0.1.0 — 14 October 2026
- Initial dark portfolio foundation, first technical project overviews, metadata and changelog.
