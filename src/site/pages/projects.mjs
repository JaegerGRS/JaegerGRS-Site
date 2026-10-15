import { GREY, SVART, JTT } from '../config.mjs';
import { sectionHead, hero, cta, img } from '../components.mjs';

export default [
{
  file: 'projects/index.html', section: 'projects',
  title: 'Projects', desc: 'Independent projects by Jaeger Stratton: Svart Security, Grey Signal, JaeTheTech, JAE and PC hardware.',
  crumbs: [['Projects']],
  body: `${hero('Projects', 'Projects with <span class="gradient">purpose.</span>', 'Independent projects, each with a case study here and a standalone site or repository you can open and explore.')}
<section class="section container">${sectionHead('Standalone sites', 'Open the real thing.', 'These open in a new tab on their own websites.')}
<div class="grid g3">
<div class="card t-svart reveal"><div class="card-top"><span class="num">01</span><span class="tag">Live</span></div><span class="icon mt-icon">S</span><h3>Svart Security</h3><p>Encrypted privacy tools: browser, AI, passwords, notes, chat, email and VPN. No tracking, no ads.</p><div class="chips"><span>AES-256-GCM</span><span>Privacy</span><span>10 tools planned</span></div><div class="stack"><a class="btn primary" href="${SVART}" target="_blank" rel="noopener noreferrer">svartsecurity.org <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/svart-security/">Read the case study →</a></div></div>
<div class="card t-grey reveal"><div class="card-top"><span class="num">02</span><span class="tag">Live</span></div>${img('grey-signal-logo.png', 'Grey Signal logo', 160, 160, 'logo-badge mt-icon')}<h3>Grey Signal</h3><p>Tactical-shooter and FPS channel with videos, ops and a live PC rig page.</p><div class="chips"><span>HTML · CSS · JS</span><span>Live telemetry</span><span>YouTube · Twitch</span></div><div class="stack"><a class="btn primary" href="${GREY}" target="_blank" rel="noopener noreferrer">Self-hosted site <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/grey-signal/">Read the case study →</a></div></div>
<div class="card t-jae reveal"><div class="card-top"><span class="num">03</span><span class="tag">Live</span></div><span class="icon mt-icon">J</span><h3>JaeTheTech</h3><p>Write code, build machines, break security. Includes the Personal AI project.</p><div class="chips"><span>Node.js</span><span>Tauri</span><span>Ollama</span></div><div class="stack"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">jaethetech.com <span aria-hidden="true">↗</span></a><a class="text-link" href="{up}projects/jaethetech/">Read the case study →</a></div></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('More work', 'Code and hardware.')}
<div class="grid g3">
<a class="card t-ae reveal" href="{up}projects/jae/"><div class="card-top"><span class="num">04</span><span class="tag">Source on GitHub</span></div><span class="icon mt-icon">AE</span><h3>JAE: Jaeger Adaptive Engine</h3><p>A private, local-first AI desktop app built with Tauri, with MSI builds and a validated GitHub update pipeline.</p><span class="go">Read more →</span></a>
<a class="card t-hw reveal" href="{up}projects/hardware/"><div class="card-top"><span class="num">05</span><span class="tag">2015 — present</span></div><span class="icon mt-icon">▣</span><h3>PC hardware</h3><p>Assembly, Windows setup and methodical troubleshooting, plus the <span data-rig-live="line">Ryzen 9 / RTX 3070 Ti</span> workstation.</p><span class="go">Read more →</span></a>
<a class="card t-rig reveal" href="{up}projects/rig-api/"><div class="card-top"><span class="num">06</span><span class="tag">For sale</span></div><span class="icon mt-icon">API</span><h3>Rig API + app</h3><p>Live PC specs and load for your own website, with a tiny Windows app. Made for small sites and servers.</p><span class="go">Read more →</span></a>
</div></div></section>
${cta('Want to talk about<br>any of these?', 'Happy to go deeper on how anything here was built.')}`,
},
];
