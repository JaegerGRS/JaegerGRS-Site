# JaegerGRS.com

Professional IT and software-project portfolio for Jaeger George Richard Stratton.

**Live website:** https://jaegergrs.com  
**GitHub source:** https://github.com/JaegerGRS/JaegerGRS-Site  
**Changelog:** https://jaegergrs.com/changelog.html

## Source and design
This is a lightweight, responsive, dark-theme website. Edit `index.html`, `changelog.html`, and files in `assets/`. No framework, database, or build dependencies are needed to develop the pages locally.

For a local preview, run `python -m http.server 8000` from the repository root, then open http://localhost:8000.

## Cloudflare hosting
The **production site is currently served by Cloudflare Worker `jaegergrs-portfolio`**, with custom hostnames `jaegergrs.com` and `www.jaegergrs.com`. The `www` hostname should permanently redirect to the apex domain on the next Worker deployment.

The Cloudflare Pages project `jaegergrs-site` is reserved for a potential future migration. It is **not** the production host. Cloudflare native Git integration failed with error 8000011, so it is not used for production.

- Account ID: `3efd2b3c0816c2935ed54d8d26b1807f`
- Zone ID: `b830a6895e679178f3621eda7b5f0929`
- Worker preview: https://jaegergrs-portfolio.imjaethetech.workers.dev

## Continuous integration and deployment
`.github/workflows/cloudflare-deploy.yml` runs source/build validation on pushes and pull requests.

`scripts/build-worker.mjs` generates `dist/worker.mjs` from the seven public website files. Test it locally using:

```bash
node scripts/build-worker.mjs
node --check dist/worker.mjs
```

Deployment is intentionally disabled until a scoped Cloudflare API token is stored as a **GitHub Actions secret**. Required secrets: `CLOUDFLARE_API_TOKEN` (Workers Scripts Edit) and `CLOUDFLARE_ACCOUNT_ID`. Set the Actions variable `CLOUDFLARE_DEPLOY_ENABLED` to `true` only once those secrets have been installed. Never commit tokens into the repository.

## Publishing checklist
1. Validate the Worker build and GitHub Actions result.
2. Deploy to Cloudflare using the approved token.
3. Verify https://jaegergrs.com, /changelog, /sitemap.xml, /robots.txt and assets.
4. Check mobile layout, HTTPS and the www-to-apex redirect.
5. Update both `CHANGELOG.md` and `changelog.html` for actual releases.

## Content accuracy
Keep independent PC-building experience separate from paid employment. Mark planned software distinctly from released features. Use genuine screenshots and only verified project claims.
