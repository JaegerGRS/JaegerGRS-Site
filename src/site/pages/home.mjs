import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
  file: 'index.html', section: 'home',
  title: 'Jaeger Stratton | IT, Hardware & Software Projects',
  desc: 'Jaeger George Richard Stratton: PC building and troubleshooting since 2015, Windows support, web and software projects. Based in Peterborough, UK.',
  schema: `\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Jaeger George Richard Stratton","url":"${SITE}/","jobTitle":"Independent Developer","knowsAbout":["PC building","Hardware troubleshooting","Windows installation","Web development","Technical support"],"sameAs":["${FB}","${LI}","${XJ}","${SVART}","${JTT}"]}</script>`,
  body: `
<section class="container hero">
<div><p class="eyebrow"><span class="status-dot"></span>Independent technical work · Peterborough, UK</p>
<h1>Built on curiosity.<br><span class="gradient">Backed by experience.</span></h1>
<p class="lead">I'm Jaeger. I've been building, upgrading and troubleshooting PCs since 2015. Now I also build websites, system monitoring, local AI and privacy-focused software.</p>
<div class="actions"><a class="btn primary" href="{up}projects/">Explore my work <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}contact/">Get in touch</a></div>
<div class="hero-stats"><span><b>2015</b><small>Started with PC hardware</small></span><span><b>4</b><small>Independent projects</small></span><span><b>UK / Global</b><small>Open to opportunities</small></span></div></div>
<div class="terminal" aria-hidden="true"><div class="terminal-bar"><i></i><i></i><i></i><span>jaeger@jaegergrs ~</span></div>
<div class="terminal-body"><div><span class="p">$</span> whoami</div><div class="d">jaeger — builder, tinkerer, troubleshooter</div><div><span class="p">$</span> ls projects/</div><div class="o">svart-security/ grey-signal/ jaethetech/ jae/</div><div><span class="p">$</span> cat rig.spec</div><div class="d">Ryzen 9 5950X · RTX 3070 Ti</div><div><span class="p">$</span> <span class="caret"></span></div></div></div>
</section>

<section class="section muted"><div class="container">
${sectionHead('Live sites', 'Four projects. Visit them yourself.', 'Each one stands on its own. Open the real site, or read the case study first.')}
<div class="grid g4">
<a class="card t-svart reveal" href="{up}projects/svart-security/"><div class="card-top"><span class="icon">S</span><span class="tag">Privacy</span></div><h3>Svart Security</h3><p>Encrypted, no-tracking privacy tools built by one developer.</p><span class="go">Case study →</span></a>
<a class="card t-grey reveal" href="{up}projects/grey-signal/"><div class="card-top"><span class="icon">G</span><span class="tag">Gaming</span></div><h3>Grey Signal</h3><p>A tactical-shooter channel with a self-hosted site and live rig telemetry.</p><span class="go">Case study →</span></a>
<a class="card t-jae reveal" href="{up}projects/jaethetech/"><div class="card-top"><span class="icon">J</span><span class="tag">Tech</span></div><h3>JaeTheTech</h3><p>Code, machines and security, plus a local-first Personal AI.</p><span class="go">Case study →</span></a>
<a class="card t-hw reveal" href="{up}projects/jae/"><div class="card-top"><span class="icon">AE</span><span class="tag">AI</span></div><h3>JAE</h3><p>Jaeger Adaptive Engine: a local-first AI desktop app built with Tauri.</p><span class="go">Case study →</span></a>
</div>
<div class="spaced">${links(ext(SVART, 'svartsecurity.org', 'Open Svart Security'), ext(GREY, 'Grey Signal (self-hosted)', 'Open the live site'), ext(JTT, 'jaethetech.com', 'Open JaeTheTech'), ext('https://github.com/JaegerGRS/JAE', 'JAE on GitHub', 'Source and releases'))}</div>
</div></section>

<section class="section container"><div class="feature">
<div class="t-hw"><p class="kicker">Hardware</p><h2 class="title">PCs, built and understood.</h2><p class="lead lead-sm">Component selection, assembly, cooling, Windows installs and fault-finding, plus a live look at the rig I game and stream on.</p><div class="actions"><a class="btn primary" href="{up}expertise/hardware/">Hardware expertise</a><a class="btn secondary" href="{up}projects/hardware/">PC hardware project</a></div></div>
<div class="art t-hw reveal" aria-hidden="true"><small>Build / Configure / Test</small><b>5950X<em>RTX 3070 TI</em></b><small>Workstation · Since 2015</small></div>
</div></section>

${cta('Have an opportunity<br>or project in mind?', "I'm open to IT technician, PC assembly and technical support roles, and relevant development projects.")}`,
},
];
