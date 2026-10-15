# PC agent

Sends this PC's specs and live load to jaegergrs.com so the **Live from my PC** panel updates in real time. Same idea as Grey Signal: an app on the PC that connects to the site with a secret key.

## The app (recommended): `JaegerRigAgent.exe`

A tiny native Windows tray app. No Node, no installer, nothing else to install.

**Get it**
- Build it yourself: `powershell -ExecutionPolicy Bypass -File agent\app\build.ps1` creates `agent\dist\JaegerRigAgent.exe` (about 24 KB, uses the .NET Framework compiler that ships with Windows), or
- Download the `JaegerRigAgent` artifact from the latest GitHub Actions run.

**Set up (once), the key created by your Cloudflare site (no copying)**
1. In Cloudflare: Workers & Pages, `jaegergrs-portfolio`, Settings, Variables, add a plain variable `RIG_SETUP` = `open`, and deploy.
2. Run `JaegerRigAgent.exe`, press **Get key from site**, tick **Start with Windows**, press **Save and start**. The site makes the key, sends it straight to the app (encrypted on disk, never shown on a page), and the site remembers it.
3. Delete the `RIG_SETUP` variable again. Setup is then closed and the key can't be fetched by anyone.

To replace the key later, set `RIG_SETUP` = `rotate`, press **Get key from site** again, then delete the variable. The old key stops working immediately.

**Alternative: your own key.** Make one with `node agent\rig-agent.mjs --gen-token` (or any 32 to 200 characters: letters, numbers, `-`, `_`), run `npx wrangler secret put RIG_TOKEN`, and paste the same key into the app. A `RIG_TOKEN` secret takes priority and turns site-generated keys off.

After that it lives in the system tray (green dot = online, orange = retrying, red = key rejected, grey = starting). Right-click for status, change key, start-with-Windows toggle, open site and exit. It starts quietly at sign-in with no window.

**How light it is**
- About 16 ms of CPU per 30 seconds and roughly 40 MB of memory, running at below-normal priority.
- CPU and RAM come from two kernel calls; GPU from one short `nvidia-smi` call per sample (skipped if there is no NVIDIA GPU).
- One small request every 5 seconds while someone is viewing the site, every 15 seconds when nobody is.
- It never records or scans files, and sends nothing but the fields below.

**What is shared:** hardware names, loads, temperatures, RAM, OS, storage totals. Never the PC name, username, IP, serials or files. The Worker filters everything again on arrival.

**Key safety**
- The key is encrypted with Windows DPAPI (only your Windows account can read it) in `%APPDATA%\JaegerGRS\rig-agent.dat`, outside the repo.
- The site only accepts a request carrying the exact key; anything else gets a 401 and nothing is stored.
- If the key leaks: make a new one, run `wrangler secret put RIG_TOKEN`, then right-click the tray icon, **Set or change key**.

`JaegerRigAgent.exe --dry-run` (from a terminal) prints what would be sent and sends nothing.

## The Node version (optional)

`node agent\rig-agent.mjs` does the same job from a terminal (Node 18+). Commands: `setup`, `--once`, `--dry-run`, `--gen-token`. `agent\install-startup.ps1` registers it to start at sign-in; the tray app does not need this because it has its own Start with Windows option.
