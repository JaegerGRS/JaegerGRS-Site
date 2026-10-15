# Site email inbox

Status on 15 October 2026: implementation and D1 schema are prepared, and the empty remote D1 database has been created and migrated. The Worker has **not** been deployed, Cloudflare Access is not configured, the sender is not verified, and inbound Email Routing/MX records have not been changed. The current production contact form therefore still uses its existing email-only path.

## What it will do

- Store contact-form submissions in a private D1 inbox and send an email notification to the current address in `CONTACT_TO`.
- Receive mail addressed to `contact@jaegergrs.com` through Cloudflare Email Routing, store plain-text messages in the same inbox and notify `CONTACT_TO`.
- Let the owner read, reply, mark read, archive, restore and permanently delete messages at `/inbox/`.
- Store replies in the conversation and send them from the configured Cloudflare Email Service sender. When inbound routing is active, recipients' replies go back to the site inbox.

The inbox is restricted twice: Cloudflare Access should protect `/inbox*` and `/api/inbox*`, and the Worker independently verifies the Access JWT signature, issuer, audience, expiration and exact allowed email. State-changing requests also require a same-origin `Origin`. The Worker fails closed if Access or D1 is unavailable.

The system does not accept attachments. It rejects inbound emails larger than 128 KiB or with more than 8 KiB of plain-text content. Form submissions retain their existing field limits and rate limits. Archived messages remain stored; use Delete to remove a message and its replies from D1. There is no automatic deletion schedule.

## Cloudflare setup still required

1. In Cloudflare Zero Trust, create a self-hosted Access application covering `jaegergrs.com/inbox*` and `jaegergrs.com/api/inbox*`. Add an allow policy for only `jaegergrstratton@gmail.com` (or another address you explicitly choose).
2. Set `ACCESS_TEAM_DOMAIN` to the exact HTTPS team domain (for example, `https://<team>.cloudflareaccess.com`) and `ACCESS_AUD` to the Access application's audience tag in `[vars]` in `wrangler.toml`. `INBOX_ALLOWED_EMAIL` is currently set there to the existing contact destination. Keep the Access policy and Worker allowlist consistent; don't set these only in the dashboard, because the CI deploy uses the checked-in Wrangler configuration.
3. In Cloudflare Email Service, onboard `jaegergrs.com` and verify `website@jaegergrs.com` as a permitted sender. This is required for notifications and replies; a previous production send attempt failed because the sender was unverified.
4. In Cloudflare Email Routing, configure `contact@jaegergrs.com` to route to the `jaegergrs-portfolio` Worker, then add `INBOX_REPLY_TO = "contact@jaegergrs.com"` to `[vars]` in `wrangler.toml`. Public DNS currently has no MX record. Email Routing may request MX and other records; review and explicitly approve those changes before applying them. No DNS records have been changed.
5. After Access, Email Service and Email Routing are configured, deploy the Worker and site with `npm run verify` followed by the approved Cloudflare deployment process. The D1 database binding and migrations are already in `wrangler.toml`; database `jaegergrs-inbox` is in WEUR, with migrations `0001_inbox.sql` and `0002_inbound_email.sql` applied.
6. Test using a mailbox you control. Confirm a form submission appears in `/inbox/` and sends a notification, send an email to `contact@jaegergrs.com`, reply from the inbox, reply to that email from the test mailbox, and delete the test conversation. Do not use real recruiter messages as test data.

The existing public direct-email link and notification destination remain the configured Gmail address; no unconfigured custom address has replaced it.

## Local checks

Run `npm run verify`. The Worker tests exercise form storage and notification, Access JWT verification with a generated test key, inbox access controls, replies, archiving/restoring/deletion, inbound MIME parsing, duplicate Message-ID handling and oversized-mail rejection. They do not send real email or change DNS.
