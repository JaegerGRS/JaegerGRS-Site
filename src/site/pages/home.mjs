import { SITE, GREY, SVART, JTT, LI, XJ, FB } from '../config.mjs';
import { ext, int, links, sectionHead, cta } from '../components.mjs';

export default [
{
  file: 'index.html', section: 'home',
  title: 'Jaeger Stratton | IT Technician, PC Builder & Developer',
  desc: 'Jaeger George Richard Stratton: 13 years of interest in IT, PC building since 2016, Windows support, and five independent projects: Grey Signal (gaming content) and JaeTheTech (tech content), Svart Security (privacy tools), JAE and YouTube AI Story (AI). Based in Peterborough, UK.',
  schema: `\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Jaeger George Richard Stratton","url":"${SITE}/","jobTitle":"IT Technician and Independent Developer","knowsAbout":["PC building","Hardware troubleshooting","Windows installation","Web development","Technical support"],"sameAs":["${FB}","${LI}","${XJ}","${SVART}","${JTT}"]}</script>`,
  body: `
<section class="container hero">
<div><p class="eyebrow"><span class="status-dot"></span>Based in the United Kingdom · Open to remote, hybrid and international IT opportunities</p>
<h1>Hi, I'm Jaeger.<br><span class="gradient">I build and fix things.</span></h1>
<p class="lead">Self-taught PC builder, troubleshooter and developer, open to IT technician, PC assembly and support roles. I was introduced to tech at 13, built my first websites at 14 and my first PC at 16. IT has been an interest for half my life (self-taught, not paid employment), and today I build my own websites, privacy tools and local AI software alongside hands-on hardware and Windows support.</p>
<div class="actions"><a class="btn primary" href="{up}contact/">Get in touch <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/">See my projects</a><a class="btn secondary" href="{up}about/">About me</a></div>
<div class="hero-stats"><span><b data-years-since="2013">13</b><small>Years of interest in IT</small></span><span><b>7</b><small>Independent projects</small></span><span><b>UK-based</b><small>Remote, hybrid, international</small></span></div></div>
<div class="terminal" aria-hidden="true"><div class="terminal-bar"><i></i><i></i><i></i><span>jaeger@jaegergrs ~</span></div>
<div class="terminal-body"><div><span class="p">$</span> whoami</div><div class="d">jaeger — builder, tinkerer, troubleshooter</div><div><span class="p">$</span> cat skills</div><div class="o">hardware · windows · web · security</div><div><span class="p">$</span> ls projects/</div><div class="o">hardware rig-api svart-security jae grey-signal<br>jaethetech story-ai</div><div><span class="p">$</span> <span class="caret"></span></div></div></div>
</section>

<section class="section container">
${sectionHead('What I do', 'Hands-on technical work.', 'The practical skills I bring, and where you can see them in action.')}
<div class="grid g3">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><span class="icon">▣</span><h3>Hardware &amp; Windows</h3><p>Choosing components, building PCs, installing and configuring Windows, cooling, and tracking down faults methodically.</p><span class="go">Hardware expertise →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><span class="icon">⌘</span><h3>Web &amp; software</h3><p>Responsive websites, Node.js tools, desktop apps with Tauri, and Cloudflare hosting, built from scratch without heavy frameworks.</p><span class="go">Development expertise →</span></a>
<a class="card t-svart reveal" href="{up}projects/svart-security/"><span class="icon">⛨</span><h3>Privacy &amp; security</h3><p>Encrypted, no-tracking tools designed around keeping your data on your device. Security is the focus of Svart Security.</p><span class="go">See Svart Security →</span></a>
</div></section>

<section class="section muted"><div class="container">
${sectionHead('Selected work', 'Projects I build and run.', 'Each has its own site or repository. Open the real thing, or read how I built it.')}
<div class="grid g5">
<a class="card t-hw reveal" href="{up}projects/hardware/"><div class="card-top"><span class="icon">▣</span><span class="tag">Active</span></div><h3>PC hardware</h3><p>Assembly, Windows setup and methodical troubleshooting, since 2016.</p><span class="go">Case study →</span></a>
<a class="card t-rig reveal" href="{up}projects/rig-api/"><div class="card-top"><span class="icon">API</span><span class="tag">Released</span></div><h3>Rig API</h3><p>Live PC specs and load for a website, with a small Windows tray app and a Cloudflare Worker.</p><span class="go">Case study →</span></a>
<a class="card t-svart reveal" href="{up}projects/svart-security/"><div class="card-top"><span class="icon">S</span><span class="tag">In development</span></div><h3>Svart Security</h3><p>Privacy tools designed around keeping data on your device.</p><span class="go">Case study →</span></a>
<a class="card t-ae reveal" href="{up}projects/jae/"><div class="card-top"><span class="icon">AE</span><span class="tag">Prototype</span></div><h3>JAE</h3><p>A little AI: a local-first desktop app made with Tauri, source on GitHub.</p><span class="go">Case study →</span></a>
<a class="card t-grey reveal" href="{up}projects/grey-signal/"><div class="card-top"><span class="icon">G</span><span class="tag">Active</span></div><h3>Grey Signal</h3><p>A gaming content channel, plus the site, app and rig page I built for it.</p><span class="go">Case study →</span></a>
</div><div class="spaced">${links(ext(SVART, 'svartsecurity.org', 'Open Svart Security'), ext(GREY, 'Grey Signal (self-hosted)', 'Open the live site'), ext(JTT, 'jaethetech.com', 'Open JaeTheTech'), ext('https://github.com/JaegerGRS/JAE', 'JAE on GitHub', 'Source and releases'), int('projects/story-ai/', 'YouTube AI Story', 'AI for story content'))}</div>
<p class="fine"><a class="text-link inline" href="{up}projects/">See all projects, including JaeTheTech and YouTube AI Story →</a></p>
</div></section>

<section class="section container"><div class="feature">
<div><p class="kicker">About me</p><h2 class="title">Learn by building.<br>Improve by testing.</h2><p class="lead lead-sm mt-icon">I started with PC builds and tutorials, then taught myself to diagnose faults, work with Windows and systems, and write code. I'm interested in IT support, PC assembly and technician roles, as well as development projects, in the UK and abroad.</p><div class="actions"><a class="btn primary" href="{up}about/">Read my story</a><a class="btn secondary" href="{up}about/journey/">Timeline</a></div></div>
<div class="art t-hw reveal" aria-hidden="true"><small>Build / Configure / Test</small><b><span data-rig-live="cpuUpper">5950X</span><em data-rig-live="gpuUpper">RTX 3070 TI</em></b><small>Workstation · <span data-rig-live="ram">64 GB</span> · Building since 2016</small></div>
</div></section>

${cta('Have a role or project<br>in mind?', "I'm open to IT technician, PC assembly and technical support roles, ideally remote or hybrid, and relevant development projects.")}`,
},
];
