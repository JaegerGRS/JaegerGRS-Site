# PC agent

Sends this PC's specs and live load to jaegergrs.com so the **Live from my PC** panel on the hardware page updates in real time. It is the same idea as Grey Signal: a small app on the PC that connects to the site using a secret key.

Needs Node 18+ on Windows. No packages to install.

## Set up

1. Make a pairing key: `node agent/rig-agent.mjs --gen-token`
2. Give the same key to Cloudflare: `npx wrangler secret put RIG_TOKEN`
3. Save it on this PC: `node agent/rig-agent.mjs setup` (site address `https://jaegergrs.com`, then the key). The key is encrypted with Windows DPAPI, so only your Windows account can read it. It is stored in `%APPDATA%\JaegerGRS\rig-agent.json`, outside the repo.
4. Run it: `node agent/rig-agent.mjs`

To start it with Windows, run `powershell -ExecutionPolicy Bypass -File agent\install-startup.ps1` once.

## Other commands

| Command | What it does |
| --- | --- |
| `--dry-run` | Prints exactly what would be sent and sends nothing |
| `--once` | Sends one sample and exits |
| `--gen-token` | Prints a new random key |

## What is shared

Only hardware names and load numbers: CPU, GPU, RAM, board, OS, storage totals, loads, temperatures. Never the PC name, username, IP, serial numbers, files or anything else. The Worker re-filters everything on arrival.

## Safety

- Without the correct key the site answers 401 and stores nothing.
- Keys are compared in constant time. Samples are limited to one per second.
- If the key is ever exposed, run `--gen-token`, set the new value with `wrangler secret put RIG_TOKEN`, then run `setup` again.
- The agent slows down to a sample every 15 seconds when nobody is viewing the site.
