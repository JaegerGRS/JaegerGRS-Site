import { SITE } from '../config.mjs';
import { hero, cta, back, backTo, more, int, facts, faq, steps, sectionHead, img, rigPanel } from '../components.mjs';

const row = (...c) => `<tr>${c.map((x, i) => (i === 0 ? `<th scope="row">${x}</th>` : `<td>${x}</td>`)).join('')}</tr>`;

export default [
{
  file: 'projects/rig-api/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API case study', desc: 'Rig API case study by Jaeger Stratton: a Windows tray app, an authenticated Cloudflare Worker API and an embeddable live hardware panel, with architecture, security review and limits.',
  crumbs: [['Projects', 'projects/'], ['Rig API']],
  schema: `\n<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Rig API',
    applicationCategory: 'DeveloperApplication', operatingSystem: 'Windows 10, Windows 11',
    description: 'Live PC specs and load for a website: a Cloudflare Worker API, a Windows tray app and an embeddable panel. For small sites and servers.',
    author: { '@type': 'Person', name: 'Jaeger Stratton', url: SITE + '/' },
    offers: [['Single site', '29'], ['Done for you', '49'], ['5-site licence', '79']].map(([name, price]) => ({ '@type': 'Offer', name, price, priceCurrency: 'GBP' })),
  })}</script>`,
  body: `${hero('Project · Case study', 'Rig <span class="gradient">API.</span>', 'A small Windows tray app reports a PC\'s hardware and load to an authenticated Cloudflare Worker, and a web panel shows it live. It is the code behind the live panel on this site, and it can also be bought.', '<div class="actions"><a class="btn primary" href="#live">See it running <span aria-hidden="true">↓</span></a><a class="btn secondary" href="#security">Security review</a></div>')}
<section class="section container"><div class="note"><strong>Scope, stated plainly.</strong> One PC reports to one site. It is built and tested for a small personal site, not for fleets of machines or heavy traffic. Nothing here has been independently audited.</div></section>
${facts(['Type', 'Windows app + Worker API + embed'], ['Agent size', '25.5 KB (26,112 bytes)'], ['Agent memory, measured', 'About 11 MB working set, 31 MB private, one PC, one sample'], ['Runs on', 'Cloudflare Workers + Durable Objects'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Why</p><h2 class="title">The problem.</h2></div>
<div><p>I wanted visitors to see the computer behind my projects as it really is, rather than a list of specifications I typed once and let go stale. A static page cannot know whether my PC is on, so the data has to be pushed from the PC, stored somewhere always available and read safely by a public page.</p>
<p>The constraints I set: a tiny background app, no inbound ports opened on my home network, no personal data leaving the PC, and a public page that stays honest when the PC is switched off.</p></div></div></section>
<section class="section container pt0">${sectionHead('Architecture', 'How data flows.', 'Checked against the source in <code>agent/app/RigAgent.cs</code>, <code>src/worker.mjs</code> and <code>src/rig-hub.mjs</code>.')}
<figure class="media reveal"><svg viewBox="0 0 760 140" role="img" aria-labelledby="ra-t ra-d" width="760" height="140"><title id="ra-t">Rig API architecture</title><desc id="ra-d">A Windows agent sends authenticated POST requests to the Worker. The Worker validates them and stores state in a Durable Object. A public GET endpoint, cached for two seconds, serves the snapshot to a website widget, which polls it.</desc>
<defs><marker id="raa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8c97a4"/></marker></defs>
<rect x="150" y="14" width="455" height="118" rx="8" fill="none" stroke="#263140" stroke-dasharray="5 4"/>
<g fill="#131b25" stroke="#263140"><rect x="5" y="40" width="130" height="70" rx="6"/><rect x="160" y="40" width="130" height="70" rx="6"/><rect x="315" y="40" width="130" height="70" rx="6"/><rect x="470" y="40" width="130" height="70" rx="6"/><rect x="625" y="40" width="130" height="70" rx="6"/></g>
<g stroke="#8c97a4" fill="none" stroke-width="1.5" marker-end="url(#raa)"><path d="M135 75H158"/><path d="M290 75H313"/><path d="M468 75H447"/><path d="M623 75H602"/></g>
<g fill="#e8edf2" font-family="system-ui,sans-serif" font-size="12.5" text-anchor="middle"><text x="70" y="70">Windows agent</text><text x="225" y="70">Authenticated API</text><text x="380" y="70">State storage</text><text x="535" y="70">Public read API</text><text x="690" y="70">Website widget</text></g>
<g fill="#8c97a4" font-family="system-ui,sans-serif" font-size="10.5" text-anchor="middle"><text x="70" y="90">tray app · DPAPI key</text><text x="225" y="90">POST /api/rig · Bearer</text><text x="380" y="90">Durable Object</text><text x="535" y="90">GET /api/rig · 2 s cache</text><text x="690" y="90">polls every 3 s</text><text x="377" y="29">Cloudflare Worker</text></g></svg>
<figcaption class="fine">The agent pushes; the widget pulls. The agent opens only outbound HTTPS connections, so nothing on the home network is exposed.</figcaption></figure></section>
<section class="section container pt0"><div class="grid g3">
<div class="card reveal"><h3>The tray app</h3><p>A native C# app (about 25 KB) that samples CPU and memory through Windows kernel calls, hardware names through WMI and NVIDIA GPU figures through <code>nvidia-smi</code>. It samples every 5 seconds when someone is watching the site and every 15 seconds when nobody is, and backs off after errors. AMD and Intel GPU load is not reported.</p></div>
<div class="card reveal"><h3>Pairing</h3><p>While setup is switched on in Cloudflare, the app presses <strong>Get key from site</strong> and the Worker returns a random pairing key once. The app stores it with Windows DPAPI for the current user. The key is never shown on a web page. An owner can instead set a key as a Cloudflare secret.</p></div>
<div class="card reveal"><h3>Authenticated updates</h3><p>Every update carries <code>Authorization: Bearer &lt;key&gt;</code>. The Worker hashes both sides and compares them in constant time, answers 401 on a mismatch and never accepts keys shorter than 32 characters.</p></div>
<div class="card reveal"><h3>Invalid data</h3><p>Bodies over 8 KB get 413. Only whitelisted fields are kept, numbers are range-checked and text is cleaned and length-limited. If neither the specs nor the live figures survive, the Worker answers 422. Updates faster than one a second get 429.</p></div>
<div class="card reveal"><h3>If the PC is off</h3><p>The Worker treats the PC as online only if the last update was under 25 seconds ago. After that it still returns the last known specs, flagged offline, and the panel hides load and temperature rather than showing old numbers as live.</p></div>
<div class="card reveal"><h3>The panel</h3><p>This site\'s panel and the third-party embed both poll the public snapshot. Each shows loading, online, offline and unavailable states. Only the status line is announced to screen readers; the changing figures are not.</p></div>
</div></section>
<section class="section container pt0" id="live">${sectionHead('Live demonstration', 'Running now.', 'This is the real panel, reading the real Worker. If my PC is off you will see the last known specs, clearly marked.')}${rigPanel()}</section>
<section class="section container pt0"><div class="grid g2">
<figure class="media reveal">${img('rig-live-online.webp', 'The live panel showing the status Online now with this PC\'s specifications and CPU, GPU and memory meters.', 937, 477)}<figcaption class="fine">Online. Captured from jaegergrs.com on 15 October 2026 while the agent was running.</figcaption></figure>
<figure class="media reveal">${img('rig-live-offline.webp', 'The live panel showing the status Offline with last known specifications and no live meters.', 937, 573)}<figcaption class="fine">Offline. Captured from a local test copy of the Worker after updates stopped. It uses this PC\'s real specifications but is a test instance, not the production site.</figcaption></figure>
</div></section>
<section class="section container pt0" id="security">${sectionHead('Security review', 'What the code actually does.', 'Reviewed from the implementation, not the marketing. A gap is a gap even when it is acceptable for a small personal site.')}
<div class="compare-wrap reveal" tabindex="0" role="region" aria-label="Security review table"><table class="compare"><caption class="sr-only">Security controls, what the code does and known gaps</caption><thead><tr><th scope="col">Area</th><th scope="col">Implemented</th><th scope="col">Gaps and caveats</th></tr></thead><tbody>
${row('Pairing key', '36 bytes from <code>crypto.getRandomValues</code>, base64url (288 bits). Issued once to the agent, only while <code>RIG_SETUP</code> is on.', 'The claim endpoint has no rate limit. With <code>open</code> the first caller wins; if <code>rotate</code> is left on, anyone could replace the key. Turn setup off after pairing.')}
${row('Secret storage', 'Agent: DPAPI (current user, with entropy) in <code>%APPDATA%</code>. Worker: a Cloudflare secret if <code>RIG_TOKEN</code> is set.', 'A site-generated key sits unhashed in Durable Object storage. Malware running as the same Windows user could use DPAPI to read the agent key.')}
${row('Authentication', 'Bearer key of 32+ characters, hashed and compared in constant time. 401 with <code>WWW-Authenticate</code>.', 'One shared key, no per-device identity, and no lock-out after repeated failures. Brute force is impractical for generated keys, but a short owner-chosen <code>RIG_TOKEN</code> is only as strong as its owner.')}
${row('Rate limiting', 'One accepted update per second, then 429.', 'Applied after authentication and shared globally. Not applied to the claim endpoint or to failed attempts. Reads are only protected by a 2 second edge cache.')}
${row('Data validation', 'Field whitelist, numeric ranges, cleaned and length-limited strings, 8 KB cap, 422 on junk.', 'When a request has no <code>Content-Length</code>, the body is read before the size limit is applied.')}
${row('State management', 'One Durable Object holds the latest snapshot and specs.', 'A single global instance for a single machine. No history is kept.')}
${row('Error responses', 'Short JSON codes, no stack traces.', '<code>not_configured</code> and <code>already_claimed</code> reveal whether a key has been set.')}
${row('Cross-origin access', 'None by default. An optional <code>RIG_EMBED_ORIGINS</code> setting allows named sites (or <code>*</code>) to read the public GET snapshot. POST never gets CORS headers.', 'Found during this review: without it the embed was blocked by the browser on any other site. Fixed in this pass and tested. The snapshot is public, so listing origins controls who can read it from a browser, not who can read it at all.')}
${row('Logging', 'The Rig code path logs no keys or request bodies.', 'Cloudflare observability is switched on for the Worker and records request metadata. I have not audited exactly what it retains.')}
${row('Transport', 'HTTPS through Cloudflare with HSTS. The agent refuses plain <code>http://</code> except for localhost.', 'No certificate pinning.')}
${row('Replay and brute force', 'TLS protects a request in transit. A replayed request could only submit already-sanitised readings, within the rate limit.', 'No nonce or timestamp, so a stolen key stays valid until it is rotated.')}
</tbody></table></div>
<p class="fine">Automated checks for most of these controls are in <code>scripts/test-worker.mjs</code> (run by <code>npm test</code>). No penetration test or third-party audit has been carried out.</p></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">Limits</p><h2 class="title">Current scale and limits.</h2></div>
<div><ul class="ticks"><li><span>One machine to one site, through one global Durable Object.</span></li><li><span>The agent is Windows only. GPU load, temperature, clock, power and fan come from <code>nvidia-smi</code>, so only NVIDIA GPUs report them.</span></li><li><span>Published specs include CPU, GPU and driver, memory, board maker and model, operating system build and storage totals. No files, network details or personal data are sent.</span></li><li><span>Tested with the Worker test script, a local agent dry run and the live site. Not load tested.</span></li><li><span>Memory and CPU figures are a single measurement on one PC, not a benchmark.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="note"><strong>Also available as a product.</strong> The same code can be set up for your own small site. That is secondary to this case study. See the <a class="text-link inline" href="{up}projects/rig-api/install/">install guide</a>, <a class="text-link inline" href="{up}projects/rig-api/what-you-get/">what you get</a> and <a class="text-link inline" href="{up}projects/rig-api/pricing/">pricing</a>.</div></section>
${more('More on the Rig API.', int('projects/rig-api/install/', 'Install', 'Deploy, pair and embed'), int('projects/rig-api/what-you-get/', 'What you get', 'The kit, and its limits'), int('projects/rig-api/pricing/', 'Pricing', 'Secondary: enquiry only'))}
${cta('Questions about<br>the Rig API?', 'Ask about the design, the code or whether it suits your site.')}
${back}`,
},
{
  file: 'projects/rig-api/install/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API install guide', desc: 'How to deploy the Rig API Worker, pair the Windows tray app and embed the live panel on a separate website, including the CORS setting and an absolute script address.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['Install']],
  body: `${hero('Rig API · Install', 'Deploy, pair, <span class="gradient">embed.</span>', 'The panel script lives on your Worker, not on your website, so the install has a few steps that matter. They are written here in the order to do them.')}
<section class="section container"><div class="note"><strong>Honest status.</strong> The Worker is the one that runs this site and has not yet been split into a standalone package. Deploying it to your own Cloudflare account needs Wrangler and some comfort with configuration, which is what the done-for-you option covers. Cloudflare\'s own plan limits and charges apply to your account.</div></section>
${steps('Order of work', 'Six steps.', 'Deploy the Worker to your Cloudflare account with the bindings below.', 'Set <code>RIG_SETUP</code> to <code>open</code> and <code>RIG_EMBED_ORIGINS</code> to your website\'s address, then deploy again.', 'Run <strong>JaegerRigAgent.exe</strong> on the PC to show, enter your Worker address and press <strong>Get key from site</strong>.', 'Remove <code>RIG_SETUP</code> and deploy again, so nobody else can pair.', 'Add the script tag to your website using the <strong>full</strong> Worker address.', 'Open your website. The panel shows <strong>Online</strong> within a few seconds. Switch the PC off and check it shows <strong>Offline</strong> after about 25 seconds.')}
<section class="section container pt0"><div class="two">
<div><p class="kicker">1 and 2</p><h2 class="title">Worker settings.</h2></div>
<div><pre class="code" tabindex="0" role="region" aria-label="Wrangler configuration"><code>[[durable_objects.bindings]]
name = "RIG_HUB"
class_name = "RigHub"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["RigHub"]

[vars]
RIG_SETUP = "open"                          # remove after pairing
RIG_EMBED_ORIGINS = "https://your-site.example"</code></pre>
<ul class="ticks"><li><span><code>RIG_EMBED_ORIGINS</code> takes a comma-separated list of website origins, or <code>*</code> to allow any. It is off by default. Without it, browsers block the panel on your website.</span></li><li><span>Prefer a Cloudflare secret named <code>RIG_TOKEN</code> (32+ characters) if you would rather set the key yourself. It takes priority and switches off site-generated keys.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">5</p><h2 class="title">The script tag.</h2></div>
<div><pre class="code" tabindex="0" role="region" aria-label="Embed code"><code>&lt;div data-jgrs-rig&gt;&lt;/div&gt;
&lt;script src="https://YOUR-WORKER-DOMAIN/embed/rig-embed.js" defer&gt;&lt;/script&gt;</code></pre>
<ul class="ticks"><li><span><strong>Use the full address.</strong> A relative path such as <code>/embed/rig-embed.js</code> resolves to your own website, where the file does not exist, so nothing appears.</span></li><li><span>The optional <code>div</code> marks where the panel goes. Without it the panel floats in the corner. Options on the script tag: <code>data-title</code>, <code>data-theme="light"</code> and <code>data-api</code>.</span></li><li><span>If your website sets a Content Security Policy, allow script, style and connect requests to the Worker domain.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">Tray icon</p><h2 class="title">Reading the colours.</h2></div>
<div><ul class="ticks"><li><span><strong>Green:</strong> online and reporting.</span></li><li><span><strong>Orange:</strong> cannot reach the site, or the site has no key yet. Retrying.</span></li><li><span><strong>Red:</strong> the key was rejected. Choose Change key and pair again.</span></li><li><span><strong>Grey:</strong> starting up.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">Testing</p><h2 class="title">What was tested.</h2></div>
<div><ul class="ticks"><li><span><strong>Tested on 15 October 2026:</strong> a local Worker on one port and a separate website on another. Without <code>RIG_EMBED_ORIGINS</code> the browser blocked the data request. With the website listed, the panel loaded and showed live values. A relative script path was not used because it cannot resolve to the Worker.</span></li><li><span><strong>Not tested:</strong> a deployment on a fresh Cloudflare account, other browsers, or customer websites with strict Content Security Policies.</span></li></ul></div></div></section>
${faq('Install questions.', ['What happens when my PC is off?', 'The panel shows Offline after about 25 seconds without an update. It keeps the last known specs, labels them as such and hides load and temperature.'], ['Why does the panel not appear on my website?', 'Check three things: the script address is the full Worker address, your website is listed in RIG_EMBED_ORIGINS, and your website\'s Content Security Policy allows the Worker domain.'], ['Is it safe to leave setup open?', 'No. Remove RIG_SETUP once the PC is paired. While it is on, anyone who finds the claim address first can pair, and with the rotate setting they can replace your key.'])}
${backTo('projects/rig-api/', 'Rig API case study')}`,
},
{
  file: 'projects/rig-api/pricing/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API pricing', desc: 'Rig API pricing: £29 for one site, £49 done-for-you setup, £79 for a five-site licence. One-off payment, enquiry only.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['Pricing']],
  body: `${hero('Rig API · Price', 'One-off <span class="gradient">pricing.</span>', 'Pay once for the kit. There is no subscription from me. Cloudflare\'s own plan limits and charges, if any, apply separately to your account.')}
<section class="section container"><div class="note">The Rig API is first a portfolio project. Read the <a class="text-link inline" href="{up}projects/rig-api/">case study</a> to see how it works and where its limits are before you enquire.</div></section>
<section class="section container pt0"><h2 class="sr-only">Licences</h2><div class="grid g3">
<div class="card reveal"><h3>Single site</h3><p class="lead lead-sm"><strong>£29</strong> one-off</p><p>The Worker API, JaegerRigAgent.exe, the embed files and the setup guide for one website. Updates for v0.x included.</p></div>
<div class="card reveal"><h3>Done for you</h3><p class="lead lead-sm"><strong>£49</strong> one-off</p><p>Everything above for one site, plus I deploy it to your Cloudflare account and pair your PC with you over chat.</p></div>
<div class="card reveal"><h3>5-site licence</h3><p class="lead lead-sm"><strong>£79</strong> one-off</p><p>Use it on up to five of your own sites. Good for small agencies and people with several projects.</p></div>
</div></section>
<section class="section container pt0"><div class="compare-wrap reveal" tabindex="0" role="region" aria-label="Plans table"><table class="compare"><caption class="sr-only">Plans compared</caption><thead><tr><th scope="col">Plan</th><th scope="col">Sites</th><th scope="col">Setup</th><th scope="col">Price</th></tr></thead><tbody>
${row('Single site', '1', 'Self-serve with the guide', '£29')}
${row('Done for you', '1', 'I deploy and pair it with you', '£49')}
${row('5-site licence', 'Up to 5 of your own', 'Self-serve with the guide', '£79')}</tbody></table></div></section>
${faq('Before you enquire.', ['Is there a subscription?', 'Not from me. It is a one-off payment. Your own Cloudflare account has its own limits and pricing.'], ['Will it work for my large server or busy site?', 'Probably not yet. It is made for small sites and servers and reports one machine to one site. Ask first if you need more.'], ['How do I pay?', 'Online payment is not set up. Send an enquiry from the contact page and I will reply with the details.'])}
${cta('Interested?', 'Tell me about your site or server and I will say whether it is a good fit, then send the details.')}
${backTo('projects/rig-api/', 'Rig API case study')}`,
},
{
  file: 'projects/rig-api/what-you-get/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API: what you get and limits', desc: 'What the Rig API kit contains: Worker source, Windows tray app and embed files, plus its security properties and limits for small sites and servers.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['What you get']],
  body: `${hero('Rig API · The kit', 'The kit and <span class="gradient">its limits.</span>', 'What is included, how it protects the connection, and what it does not do.')}
<section class="section container"><div class="two">
<div><p class="kicker">Included</p><h2 class="title">What you get.</h2></div>
<div><ul class="ticks"><li><span>The Worker source: a key-protected POST endpoint, a public GET snapshot and a Durable Object that stores the latest state.</span></li><li><span>JaegerRigAgent.exe, the Windows tray app, with Start with Windows and a key stored using Windows DPAPI.</span></li><li><span><code>rig-embed.js</code> and <code>rig-embed.css</code>, the one-tag panel.</span></li><li><span>The setup guide, and help getting it running as agreed when you enquire.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">Security</p><h2 class="title">What it does.</h2></div>
<div><ul class="ticks"><li><span>Only a PC holding the pairing key can post updates. The Worker compares keys in constant time. On the PC the key is encrypted with Windows DPAPI for your account.</span></li><li><span>Updates are size limited and rate limited, and every value is whitelisted and cleaned before it is stored.</span></li><li><span>Specs sent: CPU, GPU and driver, memory, board maker and model, operating system build and storage totals, plus load figures. No files, personal data or network details.</span></li><li><span>Strict security headers on responses. Setup mode must be switched off by you after pairing, because it is not closed automatically.</span></li></ul>
<p class="fine">The full review, including the gaps, is in the <a class="text-link inline" href="{up}projects/rig-api/#security">case study</a>.</p></div></div></section>
<section class="section container pt0"><div class="note"><strong>Limits, stated plainly:</strong> one PC reports to one site. The app is Windows only, and GPU statistics need an NVIDIA card with <code>nvidia-smi</code>. It is not built for large servers, many machines or heavy traffic, and it has not been independently audited. There is no uptime guarantee, and support is what we agree when you enquire.</div></section>
${backTo('projects/rig-api/', 'Rig API case study')}`,
},
];
