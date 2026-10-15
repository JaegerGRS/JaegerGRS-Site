import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
  file: 'projects/jaethetech/index.html', section: 'projects', theme: 't-jae',
  title: 'JaeTheTech', desc: 'JaeTheTech: my personal tech site on writing code, building machines and breaking security, including the local-first Personal AI project.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech']],
  body: `${hero('Project · Personal tech site', 'Jae<span class="c">The</span>Tech.', 'My personal tech home: full-stack code written from scratch, PC builds, and security work through Svart Security. No React, no Tailwind, no Bootstrap.', `<div class="actions"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">Visit jaethetech.com <span aria-hidden="true">↗</span></a><a class="btn secondary" href="https://github.com/JaeTheTech" target="_blank" rel="noopener noreferrer">GitHub</a></div>`)}
<section class="section container"><div class="grid g3">
<div class="card reveal"><span class="icon">{ }</span><h3>Write code</h3><p>Full-stack, zero frameworks. HTML, CSS, JS, Node and Rust, built from scratch where possible.</p></div>
<div class="card reveal"><span class="icon">⌘</span><h3>Build machines</h3><p>Building PCs from scratch since 2015. Currently a <span data-rig-live="fullLine">Ryzen 9 5950X / 64 GB / RTX 3070 Ti</span> workstation.</p></div>
<div class="card reveal"><span class="icon">◈</span><h3>Break security</h3><p>Network hardening, privacy tools and poking holes in things that shouldn't have them, via Svart Security.</p></div>
</div></section>
<section class="section muted"><div class="container"><div class="two">
<div><p class="kicker">Featured</p><h2 class="title">Personal AI.</h2></div>
<div class="prose"><p>A self-editing AI assistant that handles coding, live market data, news and daily tasks. It runs entirely on local AI through Ollama, is built from scratch with no UI frameworks, and works as a desktop app (Tauri) or a PWA on any device.</p>
<div class="chips"><span>AI-powered code editor</span><span>Live gold &amp; crypto</span><span>Multi-source news</span><span>Personal dashboard</span><span>Network privacy layer</span><span>WebSocket sync</span></div>
<div class="chips"><span>Node.js</span><span>Express</span><span>WebSocket</span><span>PWA</span><span>Service workers</span><span>Ollama</span></div>
<p>It's closely related to <a class="text-link inline" href="{up}projects/jae/">JAE, the Jaeger Adaptive Engine</a>, my local-first desktop AI project on GitHub.</p></div></div></div></section>
<section class="section container">${sectionHead('Explore the site', 'Every page, one click.')}
${links(ext(JTT, 'Home', 'jaethetech.com'), ext(JTT + '/projects', 'Projects', 'Personal AI and more'), ext(JTT + '/development', 'Development', 'How I build'), ext(JTT + '/platforms', 'Platforms', 'Where to find me'), ext(JTT + '/about', 'About', 'Who I am'), ext('https://github.com/JaeTheTech/JaeTheTech.com', 'Site source', 'GitHub repo'))}</section>
${back}`,
},
];
