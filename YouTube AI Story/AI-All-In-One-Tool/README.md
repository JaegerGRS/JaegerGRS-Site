# YouTube AI Video Creator Tool + Channel

**Your mission:** Build an AI-powered YouTube channel that automatically generates Shorts + Longform content, grows to 500k+ subscribers, and generates £100k+/month recurring revenue.

**Timeline:** 3 years to £100k+/month (or sell if insane offer)

**Core concept:**
- AI generates video ideas + scripts (using free models)
- Your PC renders videos with GPU acceleration
- Plagiarism detector ensures originality (ideas OK, exact copies NOT OK)
- Automated uploading to YouTube
- You grow audience, YouTube generates revenue

---

## Quick Status

| Component | Status | Details |
|-----------|--------|---------|
| **Tool Architecture** | 📋 TODO | Build AI + rendering + plagiarism check |
| **Channel Launch** | 📋 TODO | TBD niche, start creating content |
| **Content Pipeline** | 📋 TODO | 5-10 Shorts/day, 1-2 Longform/week |
| **Growth Strategy** | 📋 TODO | Viral content, trending sounds, audience building |
| **Monetization** | 📋 TODO | Month 6+: AdSense, Month 12+: Sponsorships |

---

## The Business Model

**Year 1 Goal:** Reach 100k subscribers, £5-10k/month revenue  
**Year 2 Goal:** Reach 500k subscribers, £50-100k/month revenue  
**Year 3 Goal:** Decide: Keep running (recurring £100k+/month) or sell (if offer > £2m)

---

## Files in This Project

- **INDEX.md** - Navigation hub (start here)
- **YOUTUBE-AI-ROADMAP.md** - Month-by-month 3-year plan
- **YOUTUBE-AI-ARCHITECTURE.md** - Tech stack + system design
- **PLAGIARISM-DETECTION-SYSTEM.md** - How it ensures originality
- **CONTENT-STRATEGY.md** - What to make, how to grow
- **FOLDER-STRUCTURE.md** - Project file organization

---

## Start Here

→ Read **[INDEX.md](INDEX.md)** for the complete roadmap.

---

## Desktop App Direction

The product is being migrated to a Tauri desktop application. Tauri is the only approved desktop-app shell for this studio and its future products; Electron and Python GUI shells are not used. The legacy Python files remain until the Tauri migration replaces their features.

The Tauri app will use the same local workspace folders:

- `assets/` for local voice, music, and B-roll assets
- `output/` for rendered videos and thumbnails
- `db/` for local references, configuration, and project manifests

After each rendered project, the app writes a JSON record in `db/project_manifests/` with the local creation time, input details, and SHA-256 file hashes. This supports creation records and file-integrity checks; it is not a substitute for formal copyright registration or legal advice.

Some optional research features make requests only when a user configures and uses a third-party provider such as YouTube Data API or a Google Trends provider. API keys are not saved by the dashboard when entered for an individual research request.

### Local Storage And Connections

The Tauri app will store workspace data locally by default. Optional user-approved services, such as YouTube Data API and Google Trends providers, make network requests only when a user connects them with their own credentials.

- Stripe checkout and subscription management
- authentication and user dashboard
- the single workflow that actually saves the buyer time or money
- analytics for activation and conversion
- optional native wrapper later only if the browser stops being enough
