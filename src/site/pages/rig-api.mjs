import { sectionHead, hero, cta, back, facts, fourCards } from '../components.mjs';

export default [
{
  file: 'projects/rig-api/index.html', section: 'projects',
  title: 'Rig API', desc: 'Rig API and Windows tray app by Jaeger Stratton: show your PC or server specs and live load on your own website. For small sites and servers.',
  crumbs: [['Projects', 'projects/'], ['Rig API']],
  body: `${hero('Product · For sale · v0.3', 'Rig <span class="gradient">API.</span>', 'Show your own PC or server on your website: specs, CPU, GPU and RAM load, all live. A tiny Windows app plus a Cloudflare Worker API, sold together.', '<div class="actions"><a class="btn primary" href="{up}contact/">Enquire about buying <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/hardware/">See it running live</a></div>')}
<section class="section container"><div class="note"><strong>Made for small site owners and servers.</strong> The Rig API has not been designed or tested for large servers, big fleets of machines or high-traffic sites yet. It reports one machine to one site. If you need more than that, ask first.</div></section>
${facts(['Type', 'API + Windows app'], ['App size', 'About 24 KB'], ['Footprint', '~40 MB RAM, near-zero CPU'], ['Runs on', 'Cloudflare Workers'])}
${fourCards('', [['1', 'Pair', 'Key-based pairing', 'The site creates a private pairing key and hands it to the app once. Only a PC holding that key can post updates.'], ['2', 'Report', 'Lightweight app', 'A background tray app that starts with Windows and sends hardware names and load numbers only.'], ['3', 'Show', 'Live panel', 'Drop-in front-end script and markup that updates your page every few seconds and handles offline gracefully.'], ['4', 'Protect', 'Built-in safeguards', 'Rate limits, strict headers, input cleaning and no personal data, files or network details ever leave the PC.']])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Install</p><h2 class="title">One line. No coding.</h2><p class="lead lead-sm">Add this single tag to your page and the live panel appears by itself. It updates every few seconds and works on phones and TVs.</p></div>
<div><pre class="code"><code>&lt;script src="/embed/rig-embed.js" defer&gt;&lt;/script&gt;</code></pre>
<ul class="ticks"><li><span>Want it in a certain spot? Add <code>&lt;div data-jgrs-rig&gt;&lt;/div&gt;</code> where it should go. Otherwise it floats in the corner.</span></li><li><span>Options on the tag: <code>data-title</code>, <code>data-theme="light"</code>, <code>data-api</code>.</span></li><li><span>On your PC: run the app, click <strong>Get key from site</strong>, done. No key to copy.</span></li></ul></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Price', 'Simple, one-off pricing.')}
<div class="grid g2">
<div class="card reveal"><h3>Single site</h3><p class="lead lead-sm"><strong>£29</strong> one-off</p><p>The Worker API, JaegerRigAgent.exe, the one-line embed and the setup guide for one website. Updates for v0.x included.</p></div>
<div class="card reveal"><h3>Done for you</h3><p class="lead lead-sm"><strong>£59</strong> one-off</p><p>Everything above, plus I deploy it to your Cloudflare account and pair your PC with you over a call or chat.</p></div>
</div><p class="fine">Prices are my starting point and may change. Similar hosted monitoring tools charge about £6 to £20 a month for small plans; this is pay once and you keep it.</p></div></section>
<section class="section container pt0"><div class="two">
<div><p class="kicker">What you get</p><h2 class="title">The whole kit.</h2></div>
<div><ul class="ticks"><li><span>The Worker API (GET snapshot, key-protected POST) and Durable Object, ready to deploy to your own Cloudflare account.</span></li><li><span>JaegerRigAgent.exe, the Windows tray app with Start with Windows and an encrypted key.</span></li><li><span>The front-end live panel: one script tag, no coding.</span></li><li><span>A setup guide and help getting it running.</span></li></ul>
<div class="note"><strong>Limits, stated plainly:</strong> one PC reports to one site. Windows only for the app (NVIDIA GPU stats need nvidia-smi). It is not built for large servers, many machines or heavy traffic yet, and it comes without a guarantee of uptime or support level beyond what we agree when you buy.</div></div></div></section>
${cta('Want the Rig API<br>for your site?', 'Tell me about your site or server and I will say whether it is a good fit, then send the details and price.')}
${back}`,
},
];
