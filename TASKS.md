# Task tracker

Tick a box with `[x]` and update the percentages. **Owner**: **Me** = Copilot can do it now, **You** = needs your account, device or decision.

> **Status, 15 October 2026:** this tracker is older than the 2026 portfolio brief. The current plan, acceptance table and open owner decisions are in `docs/IMPLEMENTATION-PLAN.md`. The site now has 25 routes plus the 404 page (this file's "24 pages" is out of date).
>
> **Lighthouse (production, lab, mobile defaults, Chromium via Playwright):** Accessibility 100 and SEO 100 on `/`, `/projects/`, `/projects/rig-api/` and `/contact/`. Performance 99 on `/`, `/about/` and `/contact/` in clean runs (LCP 1.9 s, CLS 0, TBT 0 ms). One noisy run scored 76 on the home page, so repeat runs before trusting a single number. Best practices 93: Cloudflare injects an inline script that our CSP blocks (a console error, not a site fault). Lab results are not field Core Web Vitals.
>
> `GUARD_SALT` is now set as a Worker secret, so contact rate-limit hashes are salted.

**Overall: 24 of 26 done = 92% (as of the earlier tracker; see the note above)**

## 1. Site and design: 9 of 9 = 100%
- [x] Multi-page site with a generator, one source file per page
- [x] Mobile, tablet, desktop and TV layouts
- [x] Dynamic years of experience (since 2015)
- [x] SEO: titles, canonical, sitemap, Open Graph, Twitter card, social image
- [x] Black, grey and white theme
- [x] Images compressed, cache headers added
- [x] Checked all 24 pages for sideways overflow, one h1 and broken images (the 8 sub pages at phone and desktop widths)
- [x] Fonts self-hosted, Google removed from the CSP
- [x] Home-page hardware text: kept as is (the owner has a second PC with that hardware)

## 2. Security and contact form: 4 of 6 = 67%
- [x] Security headers and a strict content-security policy
- [x] Contact API with validation, spam trap and rate limits
- [x] Tests for all of the above (`npm run verify`)
- [ ] **You**: set up email sending in Cloudflare (Email Service or a `RESEND_API_KEY` secret)
- [x] **Me**: tested the contact form on the live site: validation, origin check and rate limit work; sending returns 502 until Cloudflare Email has a verified sender (see the email task)
- [ ] **You**: put Grey Signal behind HTTPS (it is plain HTTP at 94.0.68.77)

## 3. Rig API and tray app: 7 of 7 = 100%
- [x] Worker API, live panel and one-tag embed
- [x] Tray app `JaegerRigAgent.exe`, starts with Windows, light on resources
- [x] Pairing key created by the site ("Get key from site")
- [x] Product page with pricing (£29 / £49 / £79)
- [x] Tray app paired on this PC: "Get key from site" worked, the live panel shows this PC online, setup is closed again (403), and Start-with-Windows is on. The right-click tray menu has not been tested by hand
- [x] Payment provider: none for now; the Rig API pages use a "contact to buy" button
- [x] Added an all-rights-reserved `LICENSE` (make the repo private too if you want the code hidden)

## 4. Going live: 3 of 4 = 75%
- [x] GitHub repo, CI (passing on the latest push) and local preview (`npm run dev`, `npm run selfhost`)
- [ ] **You**: in GitHub, set the variable `CLOUDFLARE_DEPLOY_ENABLED=true` and the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [x] **Me**: confirmed the live site, security headers and `/api/rig` respond after the manual deploy
- [x] Tidied the leftover test tray app and notes server

## Next step
Section 4 unlocks most of the rest: once deploy is enabled, I can test the contact form and the live Rig API.




