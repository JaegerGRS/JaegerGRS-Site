# JaegerGRS Portfolio

Initial release of the personal technical portfolio intended for **https://jaegergrs.com**.

## Run locally

Open `index.html` in a browser. No build tools required. Alternatively run `python -m http.server 8000` from this directory and visit http://localhost:8000.

## Cloudflare Pages

1. Push this folder's contents to a GitHub repository (root contains `index.html`).
2. In Cloudflare, create a Pages project and connect the repository.
3. Framework preset: **None**. Build command: leave blank. Output directory: `/` or the repository root (use `.` if Cloudflare requires a value).
4. Add `jaegergrs.com` in the Pages project's Custom domains and follow Cloudflare DNS prompts.
5. Verify HTTPS and both apex/www redirects, then submit the sitemap to Google Search Console.

## Change management

- Update `CHANGELOG.md` and `changelog.html` with actual shipped changes.
- Follow semantic versioning pragmatically: 0.1.1 for corrections, 0.2.0 for new features, 1.0.0 for a stable public launch.
- Update the version in the site footer after each release.
- Do not imply earlier releases existed unless supported by Git history.

## Before launch

- Check that LinkedIn URL resolves to the intended profile; the guide identifies the handle but does not certify the full destination.
- Add original PC-build photography and genuine project screenshots after review.
- Consider using a dedicated email alias at the domain instead of the personal Gmail address.
- Review which personal details and social accounts should be public.
- Replace the graphic project placeholders only when approved assets are available.
