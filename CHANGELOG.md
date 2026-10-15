# Version history

All dates reflect work that actually shipped or was prepared as a release. No fabricated earlier commits.

## v0.3.0 - 15 October 2026

- Performance pass, measured on production with Chromium. Unthrottled: LCP 0.35-0.55 s, CLS 0, 72-79 KB per page transferred. Throttled to a slow mobile profile (390px, 4x CPU, about 1.6 Mbps, 150 ms latency): LCP 1.4-1.6 s on the main pages, CLS 0, slowest interaction (menu open and close) 24-40 ms. These are lab measurements, not field data from real visitors.
- Found and fixed one failure: the Grey Signal channel page had a throttled-mobile LCP of 3.0 s because its lead image (192 KB, 1400px wide) was lazy-loaded and shown at about 340px. It now has a 700px srcset candidate (72 KB), `fetchpriority="high"` and is not lazy; LCP is now 1.4 s. The Grey Signal banner and site-home images also got smaller srcset candidates.
- Checked and left as they were: fonts are self-hosted (60 KB, preloaded) with no third-party requests; one small CSS file and no render-blocking scripts; Brotli compression; static assets cached for an hour to a week; every other image is WebP, lazy-loaded with width and height set; the live panel polls every 3 s only while the tab is visible and backs off on errors, with no animation libraries.
- Not measured: real-user INP (needs field data), Lighthouse (no Chrome installed here) and non-Chromium browsers.

- Responsive pass. Every page (25) was loaded at 320, 375, 390, 768, 1024, 1440, 2560 and 844x390 landscape in a browser and checked for page-level horizontal overflow (none found), content clipped without a scrollbar (none), distorted images (none) and header or menu problems (none). Screenshots of the code blocks, live panel and contact form at 320px were reviewed.
- Fixed: breadcrumb links and the "All projects" / "back" links were 16-22px tall, under the 24px minimum in WCAG 2.2 (target size). They now have a 24px minimum, and 44px on touch screens.
- Landscape phones: the header no longer stays fixed on screens under 480px tall, so it stops covering a sixth of the view.
- Not tested: real devices, browsers other than Chromium, and text zoom at 200% in a real browser UI.

- SEO pass, keeping the existing foundations (titles, descriptions, canonicals, Open Graph, robots.txt, sitemap, BreadcrumbList) and adding no dependencies. Homepage title and description updated to the agreed wording. Over-long descriptions on Grey Signal, YouTube AI Story and the changelog tightened. The 404 page is now `noindex`. Person and WebSite structured data now share linked `@id`s. No ratings, reviews or employment schema was added.
- Social cards: pages can now set their own image and its alt text. The Rig API case study uses a card built from a real screenshot of the live panel on the brand background; every other page keeps the global card. The Rig API screenshot used on the page was recaptured, because the previous one was badly framed.
- Site checker now also fails on invalid JSON-LD, titles over 70 characters, descriptions over 200, a `noindex` on a normal page, a missing `noindex` on the 404 page, and any indexable page missing from the sitemap.

- Changelog page rebuilt: each release now has a semantic date, a version and changes grouped as Features, Improvements, Fixes, Security and Documentation. The v0.3.0 entry, which previously still described the earlier redesign, now summarises this release and links to this file. Dates were not altered or backdated.
- The version number was removed from every page footer; it now appears on the changelog page only. The footer already links to the changelog.

- Contact page: headline "Let's discuss an opportunity.", with the form described as welcoming IT recruitment, technical roles and relevant project discussions. Email, LinkedIn, fields and the working form are kept; the gmail address is unchanged and no unconfigured custom-domain mailbox was added. Privacy wording replaced: the old "keeps no message database" was true but incomplete. The notice now states what the Worker code actually does: the message is emailed to the owner's inbox through Cloudflare, the email includes the visitor's country, a salted shortened IP hash and message timestamps are kept up to 24 hours for rate limiting, Cloudflare request logs exist with retention not configured, and third-party providers handle the data. The personal sentence in the form note was left word-for-word.
- Form script: own accessible validation (per-field `aria-invalid`, message tied to the field, focus moved to the field, "Problem:" prefix so errors are not colour-only), server error codes mapped to the right field, a clearer network-failure message that keeps what was typed, and a bug fix: the send button stayed disabled after a successful send. Tested in a browser with mocked responses (no real message was sent): empty, bad email, too-fast, triple-click (one request), network failure, 422, 429, success and a second send, at 320px, with axe clean at 320px and 1280px.
- Not done: Cloudflare Turnstile (needs a site key and secret from the owner's account; the current spam protection is a honeypot, a timing check in the browser only, an origin check and per-visitor rate limits).

- About and Journey rewritten for stronger positioning. The fixed age ("I'm 26", "13 years", "half my life") and age labels are gone: the timeline now uses years and the six stages (early interest, first websites, first independent builds, systems experience, independent development, present capabilities), with the same years on the hardware page. The "never good in classrooms" framing is replaced by what practical experimentation developed (troubleshooting, documentation, persistence, judgement), and the page says plainly that no formal employment or qualifications are claimed. Peterborough is removed from the page copy, which now says UK-based and open to international work (the footer already said so). New professional working-style cards (written communication, defined tasks, structured documentation, flexible working). Skills card corrected to the languages actually shipped (Rust removed). A CV and education section states that nothing is listed until verified documents are supplied, so there is no dead download button.
- The personal disclosure cards on About, the contact-page note and one sentence on the Journey page were deliberately left word-for-word, pending the owner's decision.

- Expertise pages reorganised into four areas (Hardware & Systems, IT Support & Windows, Software Development, Privacy, Security & Infrastructure) without adding navigation: the four areas map onto the landing page plus two existing pages, with anchors. Skills are shown as links to the projects that demonstrate them, split into demonstrated, used in experimental projects and currently learning (left unpublished until confirmed). No percentages or ratings. The hardware page gains a diagnostic and verification method and states that no case studies are published yet; the development page covers decisions, problem-solving examples from the code, testing, deployment and limits, and uses the same layout. No compliance, certification or audit claims.

- Rig API restructured as an engineering case study first, with the commercial pages secondary. Adds a verified architecture diagram (Windows agent, authenticated API, Durable Object state, public read API, widget), pairing, offline and invalid-data behaviour, a live demonstration, online and offline screenshots (the offline one is from a local test Worker and is labelled so) and a security review table that lists gaps as well as controls. Facts corrected: agent memory measured at about 11 MB (was "~40 MB"), size 25.5 KB, "For sale · v0.3" label removed because no product version exists in the code. Pricing: figures unchanged, unsupported competitor-price comparison removed, "no per-visitor fees" reworded because Cloudflare's own limits apply, no checkout added. What-you-get: "setup mode is closed after pairing" corrected, because the owner must remove `RIG_SETUP`.
- Worker: new opt-in `RIG_EMBED_ORIGINS` variable (default off) that sends CORS headers on GET `/api/rig` only. Found by testing the embed on a separate origin: without it the browser blocked the data request, so the documented third-party install could not work. Tests added. The embed now uses a full Worker address (a relative path resolves to the customer's site), its figures no longer announce to screen readers and its status line does. Tested locally on two origins only; not on a fresh Cloudflare account.

- YouTube AI Story rewritten as a technical system from the local project source (not published, and gitignored). Adds an architecture diagram, a stage-by-stage status diagram (Research partial, Idea to Check built, Upload planned) and the evidence: local Ollama and XTTS models with template fallbacks, GPU encoder detection, three-take retries, SHA-256 manifests, no background jobs, one MSI build log for the early Tauri shell. The originality checker is described by method (script, frame-hash, audio and keyword checks against saved references only) with explicit limits and no guarantee of originality or copyright compliance. States there are no tests or benchmarks, and uses screenshot and benchmark placeholders. The business and revenue goals in the project's own README were deliberately left out.

- JaeTheTech and Personal AI rewritten from the public repository and jaethetech.com. JaeTheTech now leads with the engineering (a Cloudflare Worker with email-code and GitHub sign-in, KV sessions, roles and rate limiting), architecture trade-offs without claiming frameworks are inferior, two real website screenshots and the source link. Personal AI now separates local inference from external market and news data, says storage and the desktop build are unconfirmed, notes there is no public repository or release, and states that the site's own Personal AI visual is a mock-up. The directory card for JaeTheTech was reworded to match.

- Accessibility pass targeting WCAG 2.2 AA (compliance is not claimed). Fixed heading order on all pages, the logo link's accessible name, a focusable code block, footer headings, a skip link that now moves focus to the main content, and contact form status roles, required-field note and keyboard focus on submit. Tested: axe-core on 25 pages at 1280px and 320px (no violations, including contrast and target size), keyboard order, mobile menu, 200% text size, 320px reflow and reduced motion. Not yet tested: screen readers, real browser zoom, Lighthouse.

- JAE rewritten from the GitHub repository: current state (backend, models, backups, 16 interface pages in source), architecture diagram, known limitations (no release, placeholder model manifest, no UI tests) and screenshot placeholders. The engineering page now lists only workflows confirmed in the repo, adds a pipeline diagram showing which stages are proven, and notes the MSI workflow has never run. Relationship to Personal AI clarified: separate codebases with a shared aim. No badges added.

- Svart Security reworked around evidence: purpose, role, what exists versus what does not, approach, security principles labelled as design goals or policy, known limitations, and labelled placeholders for screenshots, threat model, encryption workflow and testing. The ten tools now use the standard status labels (two In development, eight Planned), each with an evidence note. Unverified wording (AES-256-GCM, X25519, no-logs, end-to-end, zero-knowledge, 750 free requests) was removed or reworded as intent.

- Grey Signal reframed as engineering work: the main page now leads with the website, C# app, installer, Node engine, Cloudflare Worker and telemetry, with "working today" and "prepared, not live" kept separate. The channel page's subscribe button is now secondary.
- Build page: corrected the source claim. "130+ files, about 62,000 lines" counted generated files; authored source is 91 files and about 8,500 lines. Added an architecture diagram, technology decisions, two real screenshots, labelled placeholders for the rest, and a documented (not yet applied) HTTPS migration plan.

- **Hardware page:** labelled photo placeholders and repair case-study format (no invented jobs); workstation specs now listed separately from live data (main as listed / previous / planned) and no longer overwritten by telemetry. **Live panel:** loading, online, stale (with age), offline and error states, CPU and GPU temperature, metrics no longer announced to screen readers, short how-it-works note with a Rig API link.

- **Homepage rewrite:** new hero (label, name, supporting headline, introduction, two actions, availability), dated facts instead of the years stat, featured projects with category, role, verified tech, status and case-study link, a real-evidence links section, short background and CTA. Peterborough removed from the description.

- **Projects directory restructure:** new intro ('Selected technical work'), one data-driven card list with status tags and verified tech chips, a status key, a progressive category filter (all cards visible without JavaScript), real Grey Signal logo, no mock screenshots. Fixed horizontal overflow of the code block on the Rig API install page at 360px.

- **Navigation:** menu button's accessible name now matches its visible text; Contact in the nav no longer shows an external-link arrow; footer adds GitHub and external-link markers.

- **Visual refresh (premium technical minimalism):** charcoal/slate palette with a teal default accent; project colours now only tint tags, icons and a thin card edge; removed glows, gradient text, background gradients, scanlines, pulsing dot, card lift and blinking caret; calmer reveal motion; mono font for tags and labels; 68ch reading width; the home terminal now shows real profile facts instead of fake commands. All text and accent colours checked at 5.6:1 or higher on panels.

- **Identity wording:** home and footer use the agreed availability statement (UK-based, open to remote, hybrid and international IT opportunities); home title leads with IT technician; project stat reads 7.

- **Portfolio brief stages 0-9 (first pass):** home and projects reordered (Hardware, Rig API, Svart, JAE, Grey Signal; JaeTheTech and YouTube AI Story as extras) with one status vocabulary; wording changed to 13 years of interest in IT; Svart claims labelled as design goals or policy; Rig API embed uses an absolute script URL; accurate contact privacy note; WebSite and BreadcrumbList schema; muted text contrast raised to meet AA; fixed a stray character in the CSS; Story AI typos and caveats.
- Wording: "content creation" replaced with "gaming content" (Grey Signal) and "tech content" (JaeTheTech) for readability.`n- Five projects: Grey Signal and JaeTheTech framed as content creation accounts, Svart Security as privacy tools, JAE as a little AI, and new YouTube AI Story pages (overview and pipeline). Grey Signal page lists what I built for it. Home and projects pages show all five; hardware and Rig API are supporting work.`n- About page: new "Working with me" section (autism, depression, remote/hybrid preference, not suited to classroom settings). Home, contact and journey wording updated to match.`n- Grey Signal logo now shows in the header of all three Grey Signal pages (hero takes an optional logo).`n- About, journey, home and hardware pages now tell the real story: tech at 13, websites at 14, YouTube on the side, research at 15, own PC and builds at 16, age 26, 13 years in IT (half my life). "Since 2015" corrected to 2016.`n- Grey Signal build page now shows project facts (size, parts, build dates, guides). The local Grey Signal source folder was removed from the project (backup kept outside the repo).`n- Speed: Grey Signal images are now WebP (banner 194 to 125 KB, welcome 266 to 192 KB, logo 41 to 6 KB; about 180 KB less per visit). Removed the unused public/_headers (the Worker sets all headers).
- Code tidy-up: scanned for unused exports, imports, variables and CSS (none found), added .editorconfig, and documented the conventions and the new-page checklist in the README.
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






