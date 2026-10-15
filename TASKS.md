# Task tracker

Tick a box with `[x]` and update the percentages. **Owner**: **Me** = Copilot can do it now, **You** = needs your account, device or decision.

**Overall: 14 of 26 done = 54%**

## 1. Site and design: 6 of 9 = 67%
- [x] Multi-page site with a generator, one source file per page
- [x] Mobile, tablet, desktop and TV layouts
- [x] Dynamic years of experience (since 2015)
- [x] SEO: titles, canonical, sitemap, Open Graph, Twitter card, social image
- [x] Black, grey and white theme
- [x] Images compressed, cache headers added
- [ ] **Me**: screenshot every page on the new theme (phone, tablet, desktop, TV) and fix anything off
- [ ] **Me**: self-host the Manrope and DM Sans fonts (removes the Google Fonts request, faster and more private)
- [ ] **You**: decide the home-page hardware text. It says Ryzen 9 5950X / RTX 3070 Ti / 64 GB, but this PC is an i7-9700 / GTX 980 Ti / 16 GB

## 2. Security and contact form: 3 of 6 = 50%
- [x] Security headers and a strict content-security policy
- [x] Contact API with validation, spam trap and rate limits
- [x] Tests for all of the above (`npm run verify`)
- [ ] **You**: set up email sending in Cloudflare (Email Service or a `RESEND_API_KEY` secret)
- [ ] **Me**: test the contact form against the real site once it is deployed
- [ ] **You**: put Grey Signal behind HTTPS (it is plain HTTP at 94.0.68.77)

## 3. Rig API and tray app: 4 of 7 = 57%
- [x] Worker API, live panel and one-tag embed
- [x] Tray app `JaegerRigAgent.exe`, starts with Windows, light on resources
- [x] Pairing key created by the site ("Get key from site")
- [x] Product page with pricing (£29 / £49 / £79)
- [ ] **You**: click through the tray app window, menu and Start-with-Windows toggle (never tested by hand)
- [ ] **You**: choose a payment provider (Stripe, Gumroad or Lemon Squeezy) so I can add buy buttons
- [ ] **You**: make the paid code private or add a licence (the repo is public, so the code is free to read)

## 4. Going live: 1 of 4 = 25%
- [x] GitHub repo, CI and local preview (`npm run dev`, `npm run selfhost`)
- [ ] **You**: in GitHub, set the variable `CLOUDFLARE_DEPLOY_ENABLED=true` and the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- [ ] **Me**: check CI on the latest commit and confirm the live site and `/api/rig` respond after deploy
- [ ] **Me**: tidy leftover test processes (self-host, notes server, test exe)

## Next step
Section 4 unlocks most of the rest: once deploy is enabled, I can test the contact form and the live Rig API.
