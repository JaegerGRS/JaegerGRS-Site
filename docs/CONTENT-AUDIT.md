# Content accuracy audit and maintenance (October 2026)

## Where facts live

Recurring facts are defined once in `src/site/facts.mjs` and imported by the pages:

| Fact | Constant | Used on |
|---|---|---|
| Name, job title, location, availability | `PROFILE` | Home (text and Person schema), About |
| Interest in IT, first websites, PC building dates | `PROFILE.interestSince`, `.firstWebsites`, `.pcBuildingSince` | Home, About, Hardware |
| Main workstation as listed | `WORKSTATION` (marked `verified: false`) | Hardware |
| Project lifecycle status | `STATUS` | Home cards, Projects cards, each project's facts strip |
| Project count | `PROJECT_COUNT` | Home, Projects |
| GitHub profile and repositories | `GITHUB`, `REPOS` | Home, Projects, JAE, JaeTheTech, footer |
| Email address | `CONTACT_EMAIL` (via `MAIL` in `config.mjs`) | Contact, links |
| External sites and social profiles | `config.mjs` (`GREY`, `SVART`, `JTT`, `LI`, `XJ`, `FB`) | Throughout |
| CV | `CV` (currently `null`, so no download is shown) | Not yet used |

To change a date, status or link, edit that one file and run `npm run verify`. The generated HTML under `public/` must be committed with it, because CI regenerates it and fails on a difference. The site check also now fails if a page leaks an unresolved placeholder or the word "undefined".

Not centralised, deliberately: the narrative text on case-study pages, the Rig API prices, and project-specific stack lists. They are specific to one page, and a shared structure would add complexity without removing a real contradiction. A "last updated" value is not stored because the changelog already carries dated releases.

## Items that need your verification

Nothing below was changed, and none of it was replaced with a guess.

1. **Interest in IT versus paid employment.** The site says "interested in IT since around 2013", "self-taught" and "I do not claim formal employment". That is consistent, but "13 years" is no longer used anywhere. Confirm 2013 is right and that you want the phrasing "interested", not "experience".
2. **PC building start date.** 2016 appears on Home, About, Hardware, Expertise and the Journey timeline. Confirm it is the year of your first build, not only your first PC. Also confirm the 2014 first-websites date and the unexplained 2015 "researching more" entry.
3. **Current workstation.** The Hardware page lists a Ryzen 9 5950X, 64 GB and an RTX 3070 Ti as your own description. The live panel reports a different PC (Core i7-9700, GTX 980 Ti, 16 GB). Confirm the main machine, or replace the entry with the machine you actually use.
4. **Release state of each application.** Rig API is labelled Released, Svart Security In development, JAE Prototype, Grey Signal and JaeTheTech Active, YouTube AI Story and Personal AI In development. Check each against what a visitor can actually download or use. JAE has no GitHub release, Svart has no released tool, and the Rig API has no public download page.
5. **Security and encryption claims.** Svart pages describe encryption, no-logs and zero-knowledge as plans only. Confirm nothing on svartsecurity.org states them as fact. The Rig API pages describe the pairing key and rate limits; see `docs/SECURITY-REVIEW.md` for the implementation check and the gaps.
6. **Privacy and data processing.** The contact page privacy notice was written from the Worker code. Confirm Cloudflare's log retention and your mail provider's retention, and that the wording still matches once `GUARD_SALT` is set and Turnstile is decided on.
7. **CI, health-check and build pipeline claims.** JAE engineering says 3 workflows, 14 CI runs (latest passed), an hourly health check (latest passed) and an MSI workflow that has never run. These were checked against the repository on the day they were written, and run counts change. Re-check before relying on them, or remove the counts.
8. **Quantitative claims.** Re-check any count or measurement: the Rig API agent size (25.5 KB) and memory figure (one PC, one sample), the Grey Signal source counts, "10 tools planned" for Svart, and the project count. Measured performance figures in the changelog are lab results, not field data.
9. **Supported operating systems.** JAE is stated as Windows 10 and 11 only, from its README. The Rig API tray app is stated as Windows 10 and 11 (in its structured data); I could not confirm it was tested on both. Confirm the minimum Windows versions you have actually tested.
10. **Pricing and support terms.** The Rig API pages show £29, £49 and £79, one-off, with "updates for v0.x included". Confirm the prices, what "updates included" promises and for how long, any licence terms for the 5-site licence, and that the repository `LICENSE` (all rights reserved) matches what a purchaser would receive. No payment or checkout component exists, and none was added.

## Other open content items

- CV: set `CV` in `facts.mjs` and add a download link once a verified CV is supplied. A draft file, `Jaeger_Stratton_CV_2026_Revised.docx`, is in the repository root but has not been published or checked.
- Professional email: `contact@jaegergrs.com` is not used until the mailbox exists.
- The Grey Signal link is still plain HTTP; see `docs/GREY-SIGNAL-HTTPS-MIGRATION.md`.
