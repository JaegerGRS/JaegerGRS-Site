import { JTT } from '../config.mjs';
import { ext, int, links, sectionHead, hero, back, backTo, more, faq } from '../components.mjs';

export default [
{
  file: 'projects/jaethetech/index.html', section: 'projects', theme: 't-jae',
  title: 'JaeTheTech', desc: 'JaeTheTech is my tech content channel: videos and a site on writing code, building machines and breaking security, plus the local-first Personal AI project.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech']],
  body: `${hero('Project · Tech content', 'Jae<span class="c">The</span>Tech.', 'JaeTheTech is my tech content channel. It is where I share what I learn about writing code, building PCs and security, with a site written from scratch: no React, no Tailwind, no Bootstrap.', `<div class="actions"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">Visit jaethetech.com <span aria-hidden="true">↗</span></a><a class="btn secondary" href="https://github.com/JaeTheTech" target="_blank" rel="noopener noreferrer">GitHub</a></div>`)}
<section class="section container"><div class="grid g3">
<div class="card reveal"><span class="icon">{ }</span><h3>Write code</h3><p>Full-stack, zero frameworks. HTML, CSS, JS, Node and Rust, built from scratch where possible.</p></div>
<div class="card reveal"><span class="icon">⌘</span><h3>Build machines</h3><p>Building PCs from scratch since 2016. My workstation is documented on the hardware page.</p></div>
<div class="card reveal"><span class="icon">◈</span><h3>Break security</h3><p>Network hardening, privacy tools and poking holes in things that shouldn't have them, via Svart Security.</p></div>
</div></section>
${more('Featured project.', int('projects/jaethetech/personal-ai/', 'Personal AI', 'Self-editing local AI assistant, built from scratch'), int('projects/jae/', 'JAE', 'The local-first desktop AI engine'))}
<section class="section container">${sectionHead('Explore the site', 'Every page, one click.')}
${links(ext(JTT, 'Home', 'jaethetech.com'), ext(JTT + '/projects', 'Projects', 'Personal AI and more'), ext(JTT + '/development', 'Development', 'How I build'), ext(JTT + '/platforms', 'Platforms', 'Where to find me'), ext(JTT + '/about', 'About', 'Who I am'), ext('https://github.com/JaeTheTech/JaeTheTech.com', 'Site source', 'GitHub repo'))}</section>
${back}`,
},
{
  file: 'projects/jaethetech/personal-ai/index.html', section: 'projects', theme: 't-jae',
  title: 'Personal AI', desc: 'Personal AI: a self-editing, local-first AI assistant for coding, live market data, news and daily tasks. Runs on Ollama, built from scratch as a Tauri app or PWA.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech', 'projects/jaethetech/'], ['Personal AI']],
  body: `${hero('JaeTheTech · Featured', 'Personal <span class="c">AI.</span>', 'A self-editing AI assistant that handles coding, live market data, news and daily tasks. It runs entirely on local AI through Ollama and is built from scratch with no UI frameworks.', `<div class="actions"><a class="btn primary" href="${JTT}/projects" target="_blank" rel="noopener noreferrer">See it on jaethetech.com <span aria-hidden="true">↗</span></a></div>`)}
<section class="section container"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">What it does.</h2></div>
<div class="prose"><p>It works as a desktop app (Tauri) or a PWA on any device, and keeps everything local by default.</p>
<div class="chips"><span>AI-powered code editor</span><span>Live gold &amp; crypto</span><span>Multi-source news</span><span>Personal dashboard</span><span>Network privacy layer</span><span>WebSocket sync</span></div>
<div class="chips"><span>Node.js</span><span>Express</span><span>WebSocket</span><span>PWA</span><span>Service workers</span><span>Ollama</span></div>
<p>It shares its aim with <a class="text-link inline" href="{up}projects/jae/">JAE, the Jaeger Adaptive Engine</a>, my local-first desktop AI prototype on GitHub, but they are separate codebases: this one uses Node.js and Ollama, JAE uses Python and llama.cpp.</p></div></div></section>
${faq('About Personal AI.', ['Does my data leave my machine?', 'No. It runs on local AI through Ollama and keeps everything local by default.'], ['Is it a desktop app or a web app?', 'Both. It works as a Tauri desktop app or as a PWA on any device.'], ['Which frameworks does it use?', 'None for the interface. It is built from scratch, with Node.js, Express and WebSockets behind it.'])}
${backTo('projects/jaethetech/', 'JaeTheTech')}`,
},
];
