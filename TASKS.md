# Task tracker

Tick a box with `[x]` and update the percentages. **Owner**: **Me** = Copilot can do it now, **You** = needs your account, device or decision.

**Overall: 20 of 26 done = 77%**

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

## 2. Security and contact form: 4 of 6 = 67%
- [x] Security headers and a strict content-security policy
- [x] Contact API with validation, spam trap and rate limits
- [x] Tests for all of the above (`npm run verify`)
- [ ] **You**: set up email sending in Cloudflare (Email Service or a `RESEND_API_KEY` secret)
- [x] **Me**: tested the contact form on the live site: validation, origin check and rate limit work; sending returns 502 until Cloudflare Email has a verified sender (see the email task)
- [ ] **You**: put Grey Signal behind HTTPS (it is plain HTTP at 94.0.68.77)

## 3. Rig API and tray app: 4 of 7 = 57%
- [x] Worker API, live panel and one-tag embed
- [x] Tray app `JaegerRigAgent.exe`, starts with Windows, light on resources
- [x] Pairing key created by the site ("Get key from site")
- [x] Product page with pricing (£29 / £49 / £79)
- [ ] **You**: click through the tray app window, menu and Start-with-Windows toggle (never tested by hand)
- [ ] **You**: choose a payment provider (Stripe, Gumroad or Lemon Squeezy) so I can add buy buttons
- [ ] **You**: make the paid code private or add a licence (the repo is public, so the code is free to read)

## 4. Going live: 3 of 4 = 75%
- [x] GitHub repo, CI (passing on the latest push) and local preview (`npm run dev`, `npm run selfhost`)
- [ ] **You**: in GitHub, set the variable `CLOUDFLARE_DEPLOY_ENABLED=true` and the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [x] **Me**: confirmed the live site, security headers and `/api/rig` respond after the manual deploy
- [x] Tidied the leftover test tray app and notes server

## Next step
Section 4 unlocks most of the rest: once deploy is enabled, I can test the contact form and the live Rig API.


