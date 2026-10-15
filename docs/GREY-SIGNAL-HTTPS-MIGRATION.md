# Grey Signal: moving off the public HTTP IP address

Status: plan only. Nothing here has been done. Do not change DNS, tunnels, firewall rules or the production deployment until the owner approves each step.

## Current state

- The Grey Signal engine runs on the owner's PC and serves the channel site over plain HTTP at `http://94.0.68.77`, via Caddy on port 80 and the engine on `127.0.0.1:8080`.
- Browsers show "not secure". The portfolio links to this address.
- A Cloudflare Worker version of the site exists but is not switched on.

## Recommended option: Cloudflare Tunnel

A tunnel makes an outbound connection from the PC to Cloudflare, so no inbound port needs to stay open and the home IP address is no longer public.

1. Pick a hostname, for example `grey.jaegergrs.com` (needs owner approval).
2. Install `cloudflared` on the PC and authenticate it to the account.
3. Create the tunnel and route the hostname to `http://127.0.0.1:8080`.
4. Run `cloudflared` as a Windows service.
5. Test the hostname alongside the existing IP address: page loads, the live rig page, forms, and the HTTPS certificate.
6. Update the portfolio link and the Grey Signal pages only after step 5 passes.
7. Once stable for a week, close port 80 on the router and firewall.

Trade-offs: the site is down when the PC is off (as it is now), and Cloudflare terminates TLS, so it can see traffic.

## Alternatives

- Caddy with a real domain and automatic HTTPS: needs ports 80 and 443 open and the home IP exposed.
- Docker on a rented server: costs money and needs new hosting.
- The existing Worker version: no PC dependency, but loses the self-hosted engine features.

## Rollback

Steps 1-5 do not touch the existing setup, so rollback before step 6 means stopping the tunnel. After step 6, revert the link commit and re-enable port 80 if it was closed. Keep the old IP route working until the tunnel has been stable.

## Checks before and after

- `curl -I https://grey.jaegergrs.com` returns 200 with a valid certificate.
- `npm run verify` passes.
- The live rig page still updates.
- An outside port scan confirms only intended ports are open.
