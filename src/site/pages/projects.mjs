import { GREY, SVART, JTT } from '../config.mjs';
import { sectionHead, hero, cta, img } from '../components.mjs';

export default [
{
  file: 'projects/index.html', section: 'projects',
  title: 'Projects', desc: 'Five independent projects by Jaeger Stratton: Grey Signal and JaeTheTech (content creation), Svart Security (privacy tools), JAE and YouTube AI Story (AI), plus PC hardware.',
  crumbs: [['Projects']],
  body: `${hero('Projects', 'Five projects, <span class="gradient">one builder.</span>', 'Two content creation accounts, a set of privacy tools and two AI projects. Each has a case study here, and most have a standalone site or repository to open.')}
<section class="section container">${sectionHead('The five', 'What I am working on.', 'Content creation, privacy tools and AI.')}
<div class="grid g3">
<div class="card t-grey reveal"><div class="card-top"><span class="num">01</span><span class="tag">Content creation</span></div>${img('grey-signal-logo.webp', 'Grey Signal logo', 160, 160, 'logo-badge mt-icon')}<h3>Grey Signal</h3><p>A tactical-shooter and FPS content creation account, plus the website, Windows app and live rig page I built for it.</p><div class="chips"><span>YouTube · Twitch</span><span>C# · Node</span><span>Live telemetry</span></div><div class="stack"><a class="btn primary" href="${GREY}" target="_blank" rel="noopener noreferrer">Self-hosted site <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/grey-signal/">Read the case study →</a></div></div>
<div class="card t-jae reveal"><div class="card-top"><span class="num">02</span><span class="tag">Tech content</span></div><span class="icon mt-icon">J</span><h3>JaeTheTech</h3><p>A tech content creation account about writing code, building machines and breaking security.</p><div class="chips"><span>Node.js</span><span>PC builds</span><span>Security</span></div><div class="stack"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">jaethetech.com <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/jaethetech/">Read the case study →</a></div></div>
<div class="card t-svart reveal"><div class="card-top"><span class="num">03</span><span class="tag">Privacy tools</span></div><span class="icon mt-icon">S</span><h3>Svart Security</h3><p>Encrypted privacy tools: browser, AI, passwords, notes, chat, email and VPN. No tracking, no ads.</p><div class="chips"><span>AES-256-GCM</span><span>Privacy</span><span>10 tools planned</span></div><div class="stack"><a class="btn primary" href="${SVART}" target="_blank" rel="noopener noreferrer">svartsecurity.org <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/svart-security/">Read the case study →</a></div></div>
<a class="card t-ae reveal" href="{up}projects/jae/"><div class="card-top"><span class="num">04</span><span class="tag">Little AI</span></div><span class="icon mt-icon">AE</span><h3>JAE</h3><p>A little AI I am building: a private, local-first desktop app made with Tauri, with source on GitHub.</p><div class="chips"><span>Tauri</span><span>Local AI</span><span>MSI builds</span></div><span class="go">Read more →</span></a>
<a class="card t-story reveal" href="{up}projects/story-ai/"><div class="card-top"><span class="num">05</span><span class="tag">In development</span></div><span class="icon mt-icon">▶</span><h3>YouTube AI Story</h3><p>An AI tool for story-style content, from short-form clips to long videos, running on my own PC.</p><div class="chips"><span>Python</span><span>Tauri</span><span>GPU rendering</span></div><span class="go">Read more →</span></a>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Supporting work', 'Hardware and the Rig API.', 'Skills and a product that grew out of the projects above.')}
<div class="grid g3">
<a class="card t-hw reveal" href="{up}projects/hardware/"><div class="card-top"><span class="tag">2016 — present</span></div><span class="icon mt-icon">▣</span><h3>PC hardware</h3><p>Assembly, Windows setup and methodical troubleshooting, plus the <span data-rig-live="line">Ryzen 9 / RTX 3070 Ti</span> workstation.</p><span class="go">Read more →</span></a>
<a class="card t-rig reveal" href="{up}projects/rig-api/"><div class="card-top"><span class="tag">For sale</span></div><span class="icon mt-icon">API</span><h3>Rig API + app</h3><p>Live PC specs and load for your own website, with a tiny Windows app. It grew out of Grey Signal's rig page.</p><span class="go">Read more →</span></a>
</div></div></section>
${cta('Want to talk about<br>any of these?', 'Happy to go deeper on how anything here was built.')}`,
},
];
