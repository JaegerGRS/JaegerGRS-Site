# JaegerGRS.com

Independent IT and development portfolio by Jaeger G.R. Stratton.

**Live URL:** https://jaegergrs.com/  
**Hosting:** Cloudflare Worker `jaegergrs-portfolio` (custom domains `jaegergrs.com`, `www.jaegergrs.com`).  
**Source:** Static HTML/CSS/JavaScript; no framework or runtime dependencies for visitors.

## Information architecture

- `/` — overview
- `/projects/` — searchable/filterable project index
- `/projects/svart-security/` — privacy tooling case study
- `/projects/jaethetech/` — personal developer platform case study
- `/projects/grey-signal/` — frontend and monitoring case study
- `/projects/hardware/` — PC building and diagnostics case study
- `/expertise/` — skill overview, with `/hardware/` and `/development/` subpages
- `/about/` — background, with `/journey/` timeline
- `/changelog/` — genuine release history
- `/contact/` — business contact
- `/404.html` — accessible not-found page

## Run and test

```bash
python -m http.server 8000
# Folder-based URLs work in a static server that resolves index.html.
node scripts/build-worker.mjs
node --check dist/worker.mjs
node scripts/test-worker.mjs
```

## Deploy to Cloudflare

Cloudflare Pages native Git integration returned `8000011` for this account; the live production site instead uses an independently deployed Worker. **Do not attach the domain to an empty Pages project.** The repository has a Wrangler workflow for shipping changes without native Pages Git integration.

1. Create a scoped Cloudflare API token with **Workers Scripts Edit** for the correct account. Never commit it.
2. Add GitHub repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Set GitHub repository Actions variable `CLOUDFLARE_DEPLOY_ENABLED` to `true`.
4. Push or merge to `main`; the Action builds, tests and deploys.
5. Verify the two custom domains, HTTPS and the sitemap after each deployment.

## Content notes

The site distinguishes independent practical experience from formal employment, and separates published products from development concepts. The Grey Signal case study deliberately does not link directly to a public residential IP address. Verify external social media URLs before a final job-application campaign.

## Accessibility and SEO

The site includes per-page descriptions, canonical URLs, breadcrumbs, semantic headings, alt labels where relevant, reduced-motion styling, keyboard navigation, a 404 route, sitemap and robots directives.
