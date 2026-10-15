# Task tracker

Tick a box with `[x]` and update the percentages. **Owner**: **Me** = Copilot can do it now, **You** = needs your account, device or decision.

**Overall: 20 of 27 done = 74%**

## 1. Site and design: 8 of 9 = 89%
- [x] Multi-page site with a generator, one source file per page
- [x] Mobile, tablet, desktop and TV layouts
- [x] Dynamic years of experience (since 2015)
- [x] SEO: titles, canonical, sitemap, Open Graph, Twitter card, social image
- [x] Black, grey and white theme
- [x] Images compressed, cache headers added
- [x] Checked all 24 pages for sideways overflow, one h1 and broken images (the 8 sub pages at phone and desktop widths)
- [x] Fonts self-hosted, Google removed from the CSP
- [ ] **You**: decide the home-page hardware text. It says Ryzen 9 5950X / RTX 3070 Ti / 64 GB, but this PC is an i7-9700 / GTX 980 Ti / 16 GB

## 2. Security and contact form: 4 of 8 = 50%
- [x] Security headers and a strict content-security policy
- [x] Contact API with validation, spam trap and rate limits
- [x] Tests for all of the above (`npm run verify`)
- [x] Live tests: cross-origin contact is blocked (403), setup claim is closed (403), `POST /api/rig` without a key is refused (503)
- [ ] **You**: Cloudflare dashboard, Compute > Email Service > Email Sending > onboard `jaegergrs.com` (live form currently returns 502 `E_SENDER_DOMAIN_NOT_CONFIGURED`). Or set a `RESEND_API_KEY` secret instead
- [ ] **Me**: re-test the contact form after the sender domain is onboarded
- [ ] **You**: put Grey Signal behind HTTPS (it is plain HTTP at 94.0.68.77)

## 3. Rig API and tray app: 4 of 7 = 57%
- [x] Worker API, live panel and one-tag embed
- [x] Tray app `JaegerRigAgent.exe`, starts with Windows, light on resources
- [x] Pairing key created by the site ("Get key from site")
- [x] Product page with pricing (£29 / £49 / £79)
- [ ] **You**: click through the tray app window, menu and Start-with-Windows toggle (never tested by hand)
- [ ] **You**: choose a payment provider (Stripe, Gumroad or Lemon Squeezy) so I can add buy buttons
- [ ] **You**: make the paid code private or add a licence (the repo is public, so the code is free to read)

## 4. Going live: 4 of 5 = 80%
- [x] Worker deployed to jaegergrs.com; new pages, `/api/rig`, headers and 404 confirmed live; preview URLs turned off
- [x] GitHub repo, CI (passing on the latest push) and local preview (`npm run dev`, `npm run selfhost`)
- [ ] **You**: in GitHub, set the variable `CLOUDFLARE_DEPLOY_ENABLED=true` and the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [x] Tidied the leftover test tray app and notes server

## Next step
Onboard the sending domain in Cloudflare so the contact form works. Then pair the tray app (set `RIG_SETUP=open`, press "Get key from site", delete the variable).
