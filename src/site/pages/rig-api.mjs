import { SITE } from '../config.mjs';
import { hero, cta, back, backTo, more, int, facts, fourCards, faq, steps } from '../components.mjs';

export default [
{
  file: 'projects/rig-api/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API', desc: 'Rig API and Windows tray app by Jaeger Stratton: show your PC or server specs and live load on your own website. For small sites and servers.',
  crumbs: [['Projects', 'projects/'], ['Rig API']],
  schema: `\n<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Rig API',
    applicationCategory: 'DeveloperApplication', operatingSystem: 'Windows 10, Windows 11',
    description: 'Live PC and server specs and load for your own website: a Cloudflare Worker API, a Windows tray app and a one-line embed. For small sites and servers.',
    author: { '@type': 'Person', name: 'Jaeger Stratton', url: SITE + '/' },
    offers: [['Single site', '29'], ['Done for you', '49'], ['5-site licence', '79']].map(([name, price]) => ({ '@type': 'Offer', name, price, priceCurrency: 'GBP' })),
  })}</script>`,
  body: `${hero('Product · For sale · v0.3', 'Rig <span class="gradient">API.</span>', 'Show your own PC or server on your website: specs, CPU, GPU and RAM load, all live. A tiny Windows app plus a Cloudflare Worker API, sold together.', '<div class="actions"><a class="btn primary" href="{up}contact/">Enquire about buying <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/hardware/">See it running live</a></div>')}
<section class="section container"><div class="note"><strong>Made for small site owners and servers.</strong> The Rig API has not been designed or tested for large servers, big fleets of machines or high-traffic sites yet. It reports one machine to one site. If you need more than that, ask first.</div></section>
${facts(['Type', 'API + Windows app'], ['App size', 'About 24 KB'], ['Footprint', '~40 MB RAM, near-zero CPU'], ['Runs on', 'Cloudflare Workers'])}
${fourCards('How it works', [['1', 'Pair', 'Key-based pairing', 'The site creates a private pairing key and hands it to the app once. Only a PC holding that key can post updates.'], ['2', 'Report', 'Lightweight app', 'A background tray app that starts with Windows and sends hardware names and load numbers only.'], ['3', 'Show', 'Live panel', 'Drop-in front-end script and markup that updates your page every few seconds and handles offline gracefully.'], ['4', 'Protect', 'Built-in safeguards', 'Rate limits, strict headers, input cleaning and no personal data, files or network details ever leave the PC.']])}
${more('Everything about the Rig API.', int('projects/rig-api/install/', 'Install', 'One script tag, no coding'), int('projects/rig-api/pricing/', 'Pricing', 'From £29, one-off'), int('projects/rig-api/what-you-get/', 'What you get', 'The kit, and its limits'))}
${cta('Want the Rig API<br>for your site?', 'Tell me about your site or server and I will say whether it is a good fit, then send the details and price.')}
${back}`,
},
{
  file: 'projects/rig-api/install/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API install guide', desc: 'Install the Rig API live panel with one script tag, then pair your Windows PC with the Get key from site button. No coding needed.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['Install']],
  body: `${hero('Rig API · Install', 'One line. <span class="gradient">No coding.</span>', 'Add a single tag to your page and the live panel appears by itself. It updates every few seconds and works on phones and TVs.')}
<section class="section container"><div class="two">
<div><p class="kicker">On your site</p><h2 class="title">Add the tag.</h2></div>
<div><pre class="code" tabindex="0" role="region" aria-label="Embed code"><code>&lt;script src="https://YOUR-WORKER-DOMAIN/embed/rig-embed.js" defer&gt;&lt;/script&gt;</code></pre>
<ul class="ticks"><li><span>Want it in a certain spot? Add <code>&lt;div data-jgrs-rig&gt;&lt;/div&gt;</code> where it should go. Otherwise it floats in the corner.</span></li><li><span>Replace <code>YOUR-WORKER-DOMAIN</code> with the domain your Rig API Worker runs on (a relative path would point at your own site and fail). Options on the tag: <code>data-title</code>, <code>data-theme="light"</code>, <code>data-api</code>.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">On your PC</p><h2 class="title">Pair the app.</h2></div>
<div><ul class="ticks"><li><span>Run <strong>JaegerRigAgent.exe</strong>. It lives in the tray and can start with Windows.</span></li><li><span>Click <strong>Get key from site</strong>. No key to copy or paste.</span></li><li><span>Your PC appears on the panel within a few seconds.</span></li></ul></div></div></section>
${steps('Pairing', 'Set up in four steps.', 'Deploy the Worker to your Cloudflare account (or ask for the done-for-you option).', 'Add the one script tag to your site.', 'Run JaegerRigAgent.exe on the PC you want to show and press <strong>Get key from site</strong>.', 'Open your site. The panel shows <strong>Online</strong> within a few seconds.')}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Status colours</p><h2 class="title">Reading the tray icon.</h2></div>
<div><ul class="ticks"><li><span><strong>Green:</strong> online and reporting.</span></li><li><span><strong>Orange:</strong> cannot reach the site, retrying.</span></li><li><span><strong>Red:</strong> the key was rejected. Press Change key and pair again.</span></li><li><span><strong>Grey:</strong> starting up.</span></li></ul></div></div></section>
${faq('Install questions.', ['Do I need to write any code?', 'No. One script tag is the whole install on your site. The app pairs itself with a button.'], ['What happens when my PC is off?', 'The panel shows Offline after about 25 seconds without an update and keeps the last known specs, so visitors never see an error.'], ['Can I put it in a specific place on the page?', 'Yes. Add the small data-jgrs-rig placeholder where you want it. Without it, the panel floats in the corner.'])}
${backTo('projects/rig-api/', 'Rig API')}`,
},
{
  file: 'projects/rig-api/pricing/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API pricing', desc: 'Rig API pricing: £29 for one site, £49 done-for-you setup, £79 for a five-site licence. One-off payment, no subscription.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['Pricing']],
  body: `${hero('Rig API · Price', 'Simple, <span class="gradient">one-off pricing.</span>', 'Pay once and keep it. No subscription, no per-visitor fees.')}
<section class="section container"><h2 class="sr-only">Licences</h2><div class="grid g3">
<div class="card reveal"><h3>Single site</h3><p class="lead lead-sm"><strong>£29</strong> one-off</p><p>The Worker API, JaegerRigAgent.exe, the one-line embed and the setup guide for one website. Updates for v0.x included.</p></div>
<div class="card reveal"><h3>Done for you</h3><p class="lead lead-sm"><strong>£49</strong> one-off</p><p>Everything above for one site, plus I deploy it to your Cloudflare account and pair your PC with you over chat.</p></div>
<div class="card reveal"><h3>5-site licence</h3><p class="lead lead-sm"><strong>£79</strong> one-off</p><p>Use it on up to five of your own sites. Good for small agencies and people with several projects.</p></div>
</div><p class="fine">Similar scripts on marketplaces sell for about £10 to £40, and hosted monitoring tools charge £6 to £20 a month. This is pay once and you keep it.</p></section>
<section class="section container pt0"><div class="compare-wrap reveal"><table class="compare"><thead><tr><th>Plan</th><th>Sites</th><th>Setup</th><th>Price</th></tr></thead><tbody>
<tr><td>Single site</td><td>1</td><td>Self-serve with the guide</td><td>£29</td></tr>
<tr><td>Done for you</td><td>1</td><td>I deploy and pair it with you</td><td>£49</td></tr>
<tr><td>5-site licence</td><td>Up to 5 of your own</td><td>Self-serve with the guide</td><td>£79</td></tr></tbody></table></div></section>
${faq('Before you buy.', ['Is there a subscription?', 'No. It is a one-off payment and you keep the kit. Updates for v0.x are included.'], ['Will it work for my large server or busy site?', 'Probably not yet. It is made for small sites and servers and reports one machine to one site. Ask first if you need more.'], ['How do I pay?', 'Online payment is not set up yet. Send an enquiry from the contact page and I will reply with the details.'])}
${cta('Ready to buy?', 'Tell me about your site or server and I will say whether it is a good fit, then send the details and price.')}
${backTo('projects/rig-api/', 'Rig API')}`,
},
{
  file: 'projects/rig-api/what-you-get/index.html', section: 'projects', theme: 't-rig',
  title: 'Rig API: what you get and limits', desc: 'What is in the Rig API kit: Worker API, Windows tray app, one-line embed and setup help, plus the limits for small sites and servers.',
  crumbs: [['Projects', 'projects/'], ['Rig API', 'projects/rig-api/'], ['What you get']],
  body: `${hero('Rig API · The kit', 'The whole <span class="gradient">kit.</span>', 'Everything needed to show one PC or server on one small website.')}
<section class="section container"><div class="two">
<div><p class="kicker">Included</p><h2 class="title">What you get.</h2></div>
<div><ul class="ticks"><li><span>The Worker API (GET snapshot, key-protected POST) and Durable Object, ready to deploy to your own Cloudflare account.</span></li><li><span>JaegerRigAgent.exe, the Windows tray app with Start with Windows and an encrypted key.</span></li><li><span>The front-end live panel: one script tag, no coding.</span></li><li><span>A setup guide and help getting it running.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">Security</p><h2 class="title">How it stays safe.</h2></div>
<div><ul class="ticks"><li><span>Only a PC holding the pairing key can post updates. The key is compared in constant time and stored encrypted on the PC for your Windows account only.</span></li><li><span>Updates are rate limited and size limited, and every value is cleaned before it is stored.</span></li><li><span>Only hardware names and load numbers are sent: no files, personal data or network details.</span></li><li><span>Strict security headers on every response, and setup mode is closed after pairing.</span></li></ul></div></div></section>
<section class="section container pt0"><div class="note"><strong>Limits, stated plainly:</strong> one PC reports to one site. Windows only for the app (NVIDIA GPU stats need nvidia-smi). It is not built for large servers, many machines or heavy traffic yet, and it comes without a guarantee of uptime or support level beyond what we agree when you buy.</div></section>
${backTo('projects/rig-api/', 'Rig API')}`,
},
];
