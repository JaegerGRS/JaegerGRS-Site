// Generates every HTML page and sitemap.xml. Run: node scripts/generate-pages.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = '0.3.0';
const DATE = '2026-10-15';
const SITE = 'https://jaegergrs.com';

// Standalone sites. GREY is a self-hosted site at an open IP (no domain yet); swap it when one exists.
const GREY = 'http://94.0.68.77';
const SVART = 'https://svartsecurity.org';
const JTT = 'https://jaethetech.com';
const YT = 'https://www.youtube.com/@Grey_Signal';
const TWITCH = 'https://www.twitch.tv/grey_signal';
const LI = 'https://www.linkedin.com/in/jaegergrs/';
const XJ = 'https://x.com/JaegerGRS';
const FB = 'https://www.facebook.com/JaegerGRStratton';
const MAIL = 'mailto:jaegergrstratton@gmail.com';

const NAV = [
  ['home', 'Home', ''],
  ['projects', 'Projects', 'projects/'],
  ['expertise', 'Expertise', 'expertise/'],
  ['about', 'About', 'about/'],
];

const ext = (href, label, sub) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="ar">↗</span></a>`;
const int = (href, label, sub) =>
  `<a href="{up}${href}"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="ar">→</span></a>`;
const links = (...items) => `<div class="link-row">${items.join('')}</div>`;
const sectionHead = (kicker, title, p = '') =>
  `<div class="section-heading"><div><p class="kicker">${kicker}</p><h2 class="title">${title}</h2></div>${p ? `<p>${p}</p>` : ''}</div>`;

function page({ file, title, desc, section, theme = '', body, crumbs = [], schema = '' }) {
  const depth = file.split('/').length - 1;
  const up = '../'.repeat(depth);
  const urlPath = file.replace(/index\.html$/, '');
  const nav = NAV.map(([k, label, href]) =>
    `<a href="${up}${href || 'index.html'}"${section === k ? ' aria-current="page"' : ''}>${label}</a>`).join('') +
    `<a class="nav-contact" href="${up}contact/"${section === 'contact' ? ' aria-current="page"' : ''}>Contact <span aria-hidden="true">↗</span></a>`;
  const crumbHtml = crumbs.length
    ? `<div class="container crumb-wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${up}index.html">Home</a>${crumbs.map(([l, h]) => `<span>/</span>${h ? `<a href="${up}${h}">${l}</a>` : l}`).join('')}</nav></div>`
    : '';
  const fullTitle = file === 'index.html' ? title : `${title} | Jaeger Stratton`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0a0e13">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<meta name="author" content="Jaeger George Richard Stratton">
<link rel="canonical" href="${SITE}/${urlPath}">
<meta property="og:type" content="website"><meta property="og:title" content="${fullTitle}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${SITE}/${urlPath}"><meta property="og:image" content="${SITE}/assets/img/grey-signal-welcome.jpg">
<link rel="icon" href="${up}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@500;700;800&display=swap">
<link rel="stylesheet" href="${up}assets/styles.css">${schema}
</head>
<body class="${theme}">
<a class="skip" href="#main">Skip to main content</a>
<header class="topbar"><div class="container nav"><a class="wordmark" href="${up}index.html" aria-label="Jaeger Stratton home"><span class="mark">J<span class="accent">.</span></span><span>JAEGER<span class="soft">GRS</span></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">Menu <span aria-hidden="true">☰</span></button><nav id="site-nav" aria-label="Main navigation">${nav}</nav></div></header>
<main id="main">
${crumbHtml}${body.replace(/\{up\}/g, up)}
</main>
<footer class="footer"><div class="container">
<div class="footer-grid">
<div><a class="wordmark" href="${up}index.html"><span class="mark">J<span class="accent">.</span></span><span>JAEGER<span class="soft">GRS</span></span></a><p>Independent technical work: PCs, systems, web and privacy-focused software. Peterborough, UK.</p></div>
<div><h4>Explore</h4><a href="${up}projects/">Projects</a><a href="${up}expertise/">Expertise</a><a href="${up}about/">About</a><a href="${up}contact/">Contact</a></div>
<div><h4>Live sites</h4><a href="${SVART}" target="_blank" rel="noopener noreferrer">Svart Security ↗</a><a href="${JTT}" target="_blank" rel="noopener noreferrer">JaeTheTech ↗</a><a href="${GREY}" target="_blank" rel="noopener noreferrer">Grey Signal ↗</a><a href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">JAE on GitHub ↗</a></div>
<div><h4>Elsewhere</h4><a href="${LI}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="${XJ}" target="_blank" rel="noopener noreferrer">X</a><a href="${FB}" target="_blank" rel="noopener noreferrer">Facebook</a><a href="${up}changelog/">Changelog</a></div>
</div>
<div class="footer-bottom"><small>© <span id="year">2026</span> Jaeger George Richard Stratton</small><small>v${VERSION}</small></div>
</div></footer>
<script src="${up}assets/main.js" defer></script>
</body></html>
`;
}

const hero = (eyebrow, h1, lead, extra = '') =>
  `<section class="page-hero"><div class="container"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lead">${lead}</p>${extra}</div></section>`;

const cta = (h, p) => `<section class="section tight"><div class="container"><div class="cta reveal"><p class="kicker">Get in touch</p><h2>${h}</h2><p>${p}</p><div class="actions"><a class="btn primary" href="{up}contact/">Contact me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/">Browse projects</a></div></div></div></section>`;

const back = `<section class="section tight container"><a class="text-link" href="{up}projects/">← All projects</a></section>`;
const facts = (...pairs) => `<section class="section container"><dl class="facts reveal">${pairs.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></section>`;
const img = (src, alt, w, h, cls = '') => `<img class="${cls}" src="{up}assets/img/${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">`;

const pages = [];

/* ───────── HOME ───────── */
pages.push({
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
});

/* ───────── PROJECTS ───────── */
pages.push({
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
<div class="grid g2">
<a class="card t-hw reveal" href="{up}projects/jae/"><div class="card-top"><span class="num">04</span><span class="tag">Source on GitHub</span></div><span class="icon mt-icon">AE</span><h3>JAE: Jaeger Adaptive Engine</h3><p>A private, local-first AI desktop app built with Tauri, with MSI builds and a validated GitHub update pipeline.</p><span class="go">Read more →</span></a>
<a class="card t-hw reveal" href="{up}projects/hardware/"><div class="card-top"><span class="num">05</span><span class="tag">2015 — present</span></div><span class="icon mt-icon">▣</span><h3>PC hardware</h3><p>Assembly, Windows setup and methodical troubleshooting, plus the Ryzen 9 / RTX 3070 Ti workstation.</p><span class="go">Read more →</span></a>
</div></div></section>
${cta('Want to talk about<br>any of these?', 'Happy to go deeper on how anything here was built.')}`,
});

/* ───────── SVART ───────── */
const tool = (icon, name, cat, status, cls, desc) =>
  `<div class="card reveal"><div class="card-top"><span class="icon">${icon}</span><span class="tag ${cls}">${status}</span></div><h3 class="h3s">${name}</h3><p>${desc}</p><span class="num">${cat}</span></div>`;
pages.push({
  file: 'projects/svart-security/index.html', section: 'projects', theme: 't-svart',
  title: 'Svart Security', desc: 'Svart Security: encrypted privacy tools built by one developer. No tracking, no telemetry, no ads. Case study and links to svartsecurity.org.',
  crumbs: [['Projects', 'projects/'], ['Svart Security']],
  body: `${hero('Project · Privacy · 2026 — present', 'Svart <span class="c">Security.</span>', 'Encrypted privacy tools built by one developer. I publish and maintain the website and build the software behind it.', `<div class="actions"><a class="btn primary" href="${SVART}" target="_blank" rel="noopener noreferrer">Visit svartsecurity.org <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${SVART}/tools" target="_blank" rel="noopener noreferrer">Browse the tools</a></div>`)}
${facts(['Status', 'Tools in development'], ['Website', 'Live'], ['Role', 'Solo developer'], ['Focus', 'Privacy, encryption'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Principles</p><h2 class="title">What it stands for.</h2></div>
<div><ul class="ticks">
<li><span><b>Encrypted by default.</b> AES-256-GCM, with data encrypted on the device before it leaves.</span></li>
<li><span><b>No tracking. No ads. Ever.</b> Zero telemetry, analytics, data collection or advertising.</span></li>
<li><span><b>Built for real people.</b> One developer, building tools that just work without setup guides.</span></li></ul>
<div class="note">The website is live; the tools are in active development and features may change before launch. Status labels below mirror svartsecurity.org.</div></div></div></section>
<section class="section muted"><div class="container">${sectionHead('The toolkit', 'Ten tools, one principle.', 'Planned and in-progress tools from the Svart roadmap.')}
<div class="grid g3">
${tool('🔒', 'Svart Browser', 'Web browsing', 'In development', '', 'Secure browser with built-in ad blocking, DNS privacy and AES-256 encryption.')}
${tool('🤖', 'Svart AI', 'AI assistant', 'Building now', '', 'AI chat, document analysis and knowledge training, AES-256-GCM encrypted.')}
${tool('🔑', 'SVART Passwords', 'Password security', 'Planned', '', 'Encrypted password vault with generator, master password and duress wipe.')}
${tool('📝', 'SVART Notes', 'Notes', 'Planned', '', 'Secure note-taking encrypted at rest. Notes never leave your device unencrypted.')}
${tool('📄', 'SVART Docs', 'Documents', 'Planned', '', 'Rich-text editor with encrypted storage, search and organisation.')}
${tool('💬', 'SVART Chat', 'Communication', 'Planned', '', 'Self-hosted encrypted chat using X25519 key exchange and AES-256-GCM.')}
${tool('✉️', 'Secure Email', 'Communication', 'Planned', '', 'End-to-end encrypted email with temporary addresses and anonymous forwarding.')}
${tool('🗂️', 'File Encryption', 'Security', 'Planned', '', 'Encrypt, decrypt and manage files with batch operations across platforms.')}
${tool('🛡️', 'Privacy Checker', 'Privacy', 'Planned', '', 'Scan and tune your privacy settings with guided fix tips.')}
${tool('🌐', 'VPN Service', 'Privacy', 'Planned', '', 'No-logs VPN in privacy-friendly jurisdictions, with a kill switch.')}
</div></div></section>
<section class="section container">${sectionHead('Explore the site', 'Jump straight in.')}
${links(ext(SVART, 'Home', 'svartsecurity.org'), ext(SVART + '/tools', 'Tools', 'Full toolkit'), ext(SVART + '/roadmap', 'Roadmap', 'What ships when'), ext(SVART + '/pricing', 'Pricing', 'Plans'), ext(SVART + '/about', 'About', 'Who builds it'), ext('https://x.com/SvartSecurity', 'Svart on X', '@SvartSecurity'))}</section>
${back}`,
});

/* ───────── GREY SIGNAL ───────── */
pages.push({
  file: 'projects/grey-signal/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal', desc: 'Grey Signal: a tactical-shooter and FPS channel with its own multi-page website and live PC telemetry, built by Jaeger Stratton.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal']],
  body: `${hero('Project · Web & gaming · 2026', 'Grey <span class="c">Signal.</span>', 'A tactical-shooter and FPS channel with its own self-hosted website: a Windows control app, a Node site engine, live rig telemetry, and a Cloudflare version prepared for a future domain.', `<div class="actions"><a class="btn primary" href="${GREY}" target="_blank" rel="noopener noreferrer">Open the self-hosted site <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig telemetry</a><a class="btn secondary" href="${YT}" target="_blank" rel="noopener noreferrer">YouTube</a></div>`)}
<section class="section container"><figure class="media reveal">${img('grey-signal-banner.jpg', 'Grey Signal channel banner: tactical operator, helicopter and mountains with the GS logo', 1920, 520)}</figure></section>
${facts(['Type', 'Self-hosted site + channel'], ['Stack', 'C# · Node · Cloudflare'], ['Feature', 'Live telemetry'], ['Role', 'Design &amp; build'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">The build</p><h2 class="title">What's in the site.</h2></div>
<div><ul class="ticks"><li><span>Multi-page layout: home, transmissions, ops, rig, about and contact.</span></li><li><span>A rig page that refreshes itself with specs, load and temperatures.</span></li><li><span>Responsive design, metadata, social cards and accessibility basics.</span></li><li><span>A Windows app (C#) that runs and manages the site, with an .msi installer.</span></li><li><span>A Node.js site engine for a PC or VPS, plus a Cloudflare Worker version (D1, email, live stats) ready for a future domain.</span></li></ul>
<div class="note">The rig page shares hardware details only: no personal information, files or network details. Grey Signal does not have a full public site yet: it is self-hosted on my own server at an open IP address over plain HTTP, so your browser may show a "not secure" notice. A proper domain is planned.</div></div></div></section>
<section class="section muted"><div class="container"><div class="feature">
<figure class="media reveal">${img('grey-signal-welcome.jpg', 'Welcome to Grey Signal: tactical shooters and FPS games', 1400, 788)}</figure>
<div><p class="kicker">The channel</p><h2 class="title">Come for the game.</h2><p class="lead lead-sm">Tactical shooters, FPS games and operations. If it rewards teamwork and punishes overconfidence, it's probably on the list.</p><p class="fine">Content may include fictional violence, warfare, blood and strong language. Viewer discretion advised.</p><div class="actions"><a class="btn primary" href="${YT}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Subscribe on YouTube <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${TWITCH}" target="_blank" rel="noopener noreferrer">Twitch</a></div></div>
</div></div></section>
<section class="section container">${sectionHead('Explore the site', 'Every page, one click.')}
${links(ext(GREY, 'Home', 'Grey Signal'), ext(GREY + '/videos.html', 'Transmissions', 'Videos'), ext(GREY + '/ops.html', 'Ops', 'Operations'), ext(GREY + '/rig.html', 'Rig', 'Live specs and telemetry'), ext(GREY + '/about.html', 'About Grey', 'FAQ'), ext(GREY + '/contact.html', 'Contact', 'Get in touch'), ext(YT + '/videos', 'YouTube videos', '@Grey_Signal'), ext(YT + '/shorts', 'YouTube shorts', '@Grey_Signal'), ext(TWITCH, 'Twitch', 'grey_signal'))}</section>
${back}`,
});

/* ───────── JAETHETECH ───────── */
pages.push({
  file: 'projects/jaethetech/index.html', section: 'projects', theme: 't-jae',
  title: 'JaeTheTech', desc: 'JaeTheTech: my personal tech site on writing code, building machines and breaking security, including the local-first Personal AI project.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech']],
  body: `${hero('Project · Personal tech site', 'Jae<span class="c">The</span>Tech.', 'My personal tech home: full-stack code written from scratch, PC builds, and security work through Svart Security. No React, no Tailwind, no Bootstrap.', `<div class="actions"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">Visit jaethetech.com <span aria-hidden="true">↗</span></a><a class="btn secondary" href="https://github.com/JaeTheTech" target="_blank" rel="noopener noreferrer">GitHub</a></div>`)}
<section class="section container"><div class="grid g3">
<div class="card reveal"><span class="icon">{ }</span><h3>Write code</h3><p>Full-stack, zero frameworks. HTML, CSS, JS, Node and Rust, built from scratch where possible.</p></div>
<div class="card reveal"><span class="icon">⌘</span><h3>Build machines</h3><p>Building PCs from scratch since 2015. Currently a Ryzen 9 5950X / 64 GB / RTX 3070 Ti workstation.</p></div>
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
});

/* ───────── JAE ───────── */
pages.push({
  file: 'projects/jae/index.html', section: 'projects', theme: 't-hw',
  title: 'JAE: Jaeger Adaptive Engine', desc: 'JAE (Jaeger Adaptive Engine): a private, local-first AI desktop app built with Tauri, with MSI builds and GitHub-based updates.',
  crumbs: [['Projects', 'projects/'], ['JAE']],
  body: `${hero('Project · Local-first AI · 2026', 'J<span class="c">A</span>E.', 'The Jaeger Adaptive Engine: a private, local-first AI desktop app built with Tauri. Local inference and local data by default.', `<div class="actions"><a class="btn primary" href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">View JAE on GitHub <span aria-hidden="true">↗</span></a></div>`)}
${facts(['Platform', 'Windows 10 / 11'], ['Shell', 'Tauri'], ['Backend', 'Python 3.12+'], ['Data', 'Local by default'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Focus</p><h2 class="title">What it's built around.</h2></div>
<div><ul class="ticks"><li><span>Native Windows desktop delivery through Tauri and MSI installers.</span></li><li><span>Local inference and local data: runtime data is never used as a cloud inference backend.</span></li><li><span>GitHub as the source, release and update pipeline.</span></li><li><span>A native-first design: frontend plus a local backend process managed by the Tauri runtime.</span></li></ul></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Engineering', 'Validated delivery.', 'The repository ships its own tooling.')}
<div class="grid g3">
<div class="card reveal"><h3 class="h3s">CI validation</h3><p>Workflows validate each change, with an hourly health check.</p></div>
<div class="card reveal"><h3 class="h3s">MSI releases</h3><p>A Windows MSI build workflow produces installers through Tauri.</p></div>
<div class="card reveal"><h3 class="h3s">Scripted setup</h3><p>Install, dev, run, build and clean scripts keep the workflow repeatable.</p></div>
</div></div></section>
<section class="section container">${links(ext('https://github.com/JaegerGRS/JAE', 'JAE repository', 'Source, workflows, scripts'), ext(JTT + '/projects', 'Personal AI', 'Related project on JaeTheTech'))}</section>
${back}`,
});

/* ───────── PC HARDWARE PROJECT ───────── */
pages.push({
  file: 'projects/hardware/index.html', section: 'projects', theme: 't-hw',
  title: 'PC Hardware', desc: 'PC building, Windows setup and methodical troubleshooting since 2015, plus the Ryzen 9 5950X / RTX 3070 Ti workstation.',
  crumbs: [['Projects', 'projects/'], ['PC Hardware']],
  body: `${hero('Project · Hardware · 2015 — present', 'PC <span class="c">hardware.</span>', 'Real experience with assembly, diagnosing faults and keeping systems useful.', `<div class="actions"><a class="btn primary" href="{up}expertise/hardware/">Hardware expertise <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig telemetry</a></div>`)}
${facts(['Started', '2015'], ['Focus', 'PC systems'], ['Experience', 'Hands-on'], ['Current rig', 'Ryzen 9 5950X · RTX 3070 Ti'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">Where it began.</h2></div>
<div class="prose"><p>PC building is where my technical work began in 2015. I have hands-on experience selecting components, assembling machines, configuring Windows and investigating performance and stability problems.</p><p>Most of this experience comes from independently maintained systems and personal builds, documented as practical technical work.</p><div class="chips"><span>Desktop PCs</span><span>Component selection</span><span>Windows</span><span>Drivers</span><span>Diagnostics</span><span>Thermals</span></div></div></div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">The work</p><h2 class="title">From idea to iteration.</h2></div>
<div class="timeline"><div><b>01</b><h3>Plan the machine</h3><p>Choose compatible components for workload, thermals, expansion and price.</p></div><div><b>02</b><h3>Build and configure</h3><p>Assemble, set up the OS, and check drivers, cooling and stability.</p></div><div><b>03</b><h3>Troubleshoot methodically</h3><p>Isolate symptoms, verify assumptions and retest after each change.</p></div></div></div></div></section>
<section class="section container">${sectionHead('The rig', 'Ryzen 9 5950X · 64 GB · RTX 3070 Ti.', 'The workstation I build, test, game and stream on.')}
<div class="note">Live specs and temperatures are published on the Grey Signal rig page. It shares hardware details only: no personal information, files or network details.</div>
${links(ext(GREY + '/rig.html', 'Live rig page', 'Specs and telemetry'), int('projects/grey-signal/', 'Grey Signal', 'The project behind it'), int('expertise/hardware/', 'Hardware expertise', 'How I work'))}</section>
${back}`,
});

/* ───────── EXPERTISE ───────── */
pages.push({
  file: 'expertise/index.html', section: 'expertise',
  title: 'Expertise', desc: 'Practical hardware, Windows, web and software skills from independent projects and hands-on practice.',
  crumbs: [['Expertise']],
  body: `${hero('Capabilities', 'Practical <span class="gradient">skill.</span>', 'I am most useful where systems, software and careful troubleshooting meet, grounded in independent projects and hands-on practice.')}
<section class="section container"><div class="grid g2">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><div class="card-top"><span class="icon">▣</span><span class="num">01 / Hardware</span></div><h3>Systems &amp; hardware</h3><p>PC builds, component compatibility, cooling, installation, diagnostics and testing.</p><span class="go">Dive deeper →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><div class="card-top"><span class="icon">{ }</span><span class="num">02 / Development</span></div><h3>Code &amp; delivery</h3><p>Custom websites, frontend logic, JavaScript, Node, Tauri and Cloudflare deployment.</p><span class="go">Dive deeper →</span></a>
</div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">Approach</p><h2 class="title">Measure twice.<br>Change once.</h2></div>
<div class="timeline"><div><b>01</b><h3>Understand the constraint</h3><p>What is failing, what actually matters, and what can't be broken in the process?</p></div><div><b>02</b><h3>Make the smallest useful change</h3><p>Prefer clarity and maintainability over another layer of complexity.</p></div><div><b>03</b><h3>Verify it behaves</h3><p>Test the outcome, check what changed and document it for next time.</p></div></div></div></div></section>
${cta('Have a problem<br>that needs solving?', "I'm interested in practical IT work, PC assembly, troubleshooting and thoughtful development projects.")}`,
});

const fourCards = (t, items) => `<section class="section container"><div class="grid g4">${items.map(([i, k, h, p], n) => `<div class="card reveal"><span class="icon">${i}</span><span class="num mt-icon">0${n + 1} / ${k}</span><h3 class="h3s">${h}</h3><p>${p}</p></div>`).join('')}</div></section>`;

pages.push({
  file: 'expertise/hardware/index.html', section: 'expertise', theme: 't-hw',
  title: 'Hardware & Systems', desc: 'Computer assembly, troubleshooting and practical Windows support since 2015.',
  crumbs: [['Expertise', 'expertise/'], ['Hardware & systems']],
  body: `${hero('Capability · Field notes', 'Hardware &amp; <span class="c">systems.</span>', 'Computer assembly, troubleshooting and practical Windows support. I have worked on my own machines and related systems since 2015, with an eye on compatibility, cooling, stability and a systematic repair process.', `<div class="actions"><a class="btn primary" href="{up}projects/hardware/">PC hardware project <span aria-hidden="true">↗</span></a></div>`)}
${fourCards('hw', [['▣', 'Builds', 'Component selection', 'Selecting CPUs, graphics cards, memory, cooling and storage that match actual requirements.'], ['▤', 'Windows', 'System preparation', 'Installing and configuring Windows, drivers, peripherals and common software.'], ['⌁', 'Diagnostics', 'Root-cause troubleshooting', 'Working through hardware, stability, temperatures and performance issues repeatably.'], ['✓', 'Testing', 'Verification', 'Checking that a repair or upgrade actually improves the situation.']])}
${cta('Need a hand with<br>a build or a fault?', "I'm interested in IT support, PC assembly and technician roles.")}`,
});

pages.push({
  file: 'expertise/development/index.html', section: 'expertise', theme: 't-jae',
  title: 'Web & Software', desc: 'Lean interfaces, custom frontend development and Git-based Cloudflare deployment workflows.',
  crumbs: [['Expertise', 'expertise/'], ['Web & software']],
  body: `${hero('Capability · Field notes', 'Web &amp; <span class="c">software.</span>', 'Lean interfaces, custom frontend development and deployment workflows. I build independent sites and software experiments with HTML, CSS, JavaScript and supporting tools.', `<div class="actions"><a class="btn primary" href="{up}projects/">See the projects <span aria-hidden="true">↗</span></a></div>`)}
${fourCards('dev', [['◧', 'Frontend', 'Design systems', 'Accessible responsive layouts, typography, reusable components and clear visual hierarchy.'], ['⚡', 'Functionality', 'Interactive behaviour', 'Navigation, validation, dashboard UI, APIs and progressive enhancement.'], ['⬡', 'Platforms', 'Software experimentation', 'Node.js, Rust, Tauri, local AI and tools that run on personal hardware.'], ['☁', 'Deployment', 'Publish &amp; improve', 'Git version history, Cloudflare hosting, monitoring and an honest changelog.']])}
${cta('Have a project<br>in mind?', 'Open to conversations about relevant development work.')}`,
});

/* ───────── ABOUT ───────── */
pages.push({
  file: 'about/index.html', section: 'about',
  title: 'About', desc: 'About Jaeger Stratton: self-taught PC builder and developer based in Peterborough, UK, open to opportunities worldwide.',
  crumbs: [['About']],
  body: `${hero('About', 'Learn by building.<br><span class="gradient">Improve by testing.</span>', "I'm Jaeger Stratton, based in Peterborough, UK, with a hands-on background in PCs, systems and web development.", `<div class="actions"><a class="btn primary" href="{up}about/journey/">My journey <span aria-hidden="true">↗</span></a></div>`)}
<section class="section container"><div class="two"><div class="prose"><p>I got into PC building in 2015. I started out following tutorials, then gradually learned how to diagnose faults, compare components and work through problems myself.</p><p>That interest grew into websites and applications. Today I develop and maintain independent projects including Svart Security, Grey Signal, JaeTheTech and JAE.</p><p>I'm interested in IT support, PC assembly and technician roles, and open to opportunities beyond the UK.</p><a class="text-link" href="${LI}" target="_blank" rel="noopener noreferrer">Professional profile ↗</a></div>
<div class="timeline"><div><b>2015</b><h3>First PC build</h3><p>Started with tutorials, then learned to diagnose and upgrade independently.</p></div><div><b>Since</b><h3>Windows &amp; systems</h3><p>Installations, configuration, cooling and performance testing.</p></div><div><b>2026</b><h3>Independent projects</h3><p>Svart Security, Grey Signal, JaeTheTech and JAE.</p></div><div><b>Now</b><h3>Open to opportunities</h3><p>IT technician, PC assembly and technical support roles.</p></div></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Find me', 'Elsewhere online.')}
${links(ext(LI, 'LinkedIn', 'Professional profile'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'), ext(JTT, 'JaeTheTech', 'jaethetech.com'), ext(SVART, 'Svart Security', 'svartsecurity.org'))}</div></section>
${cta("Let's work<br>on something.", 'Open to conversations about roles and relevant projects.')}`,
});

pages.push({
  file: 'about/journey/index.html', section: 'about',
  title: 'My Journey', desc: 'A practical technical journey from PC hardware experimentation into software, security and independent projects.',
  crumbs: [['About', 'about/'], ['My journey']],
  body: `${hero('Background · Timeline', 'The path <span class="gradient">so far.</span>', 'A practical technical journey, from hardware experimentation into software, security and independent projects.')}
<section class="section container"><div class="timeline">
<div><b>2015</b><h3>Learning with hardware</h3><p>Got started with PC assembly, upgrades, operating systems and fault-finding. Experience was built through repeated hands-on work, not a formal employer.</p></div>
<div><b>Later</b><h3>From components to code</h3><p>Explored websites, scripting, networking, systems and security, and how hardware choices and software behaviour affect one another.</p></div>
<div><b>2026</b><h3>Independent projects take shape</h3><p>Built the Svart Security website and toolkit plans, grew JaeTheTech, created Grey Signal's online identity and rig monitoring, and started JAE.</p></div>
<div><b>Next</b><h3>Keep shipping. Keep learning.</h3><p>Document practical outcomes, improve the projects and seek technical opportunities in the UK and internationally.</p></div>
</div></section>
${cta('Have a problem<br>that needs solving?', "I'm interested in practical IT work, PC assembly, troubleshooting and thoughtful development projects.")}`,
});

/* ───────── CONTACT ───────── */
pages.push({
  file: 'contact/index.html', section: 'contact',
  title: 'Contact', desc: 'Contact Jaeger Stratton about IT technician, PC assembly and technical support roles or development projects.',
  crumbs: [['Contact']],
  body: `${hero('Contact', 'Have an opportunity<br><span class="gradient">or project in mind?</span>', "I'm open to conversations about IT technician, PC assembly and technical support roles, and relevant development projects.", `<div class="actions"><a class="btn primary" href="${MAIL}">Email me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${LI}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>`)}
<section class="section container">${links(`<a href="${MAIL}"><span>Email<small>jaegergrstratton@gmail.com</small></span><span class="ar">↗</span></a>`, ext(LI, 'LinkedIn', '/in/jaegergrs'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'))}</section>`,
});

/* ───────── CHANGELOG ───────── */
pages.push({
  file: 'changelog/index.html', section: '',
  title: 'Changelog', desc: 'Version history and release notes for jaegergrs.com.',
  crumbs: [['Changelog']],
  body: `${hero('Release history', 'Changelog<span class="accent">.</span>', 'A public log of what changed and when. Versions represent actual releases, not a backdated history.')}
<section class="section container">
<div class="release reveal"><div><span class="version">v${VERSION}</span><span class="release-date">15 OCT 2026</span></div><div><h2>Redesign, real assets and standalone sites</h2><ul><li>New visual design with per-project accent colours, cards, breadcrumbs and reveal animations.</li><li>Added the real Grey Signal logo, banner and artwork, and direct links to every standalone site: Svart Security, Grey Signal, JaeTheTech and the JAE repository.</li><li>Added the Svart toolkit overview, the JaeTheTech Personal AI project and a JAE case study.</li><li>Worker now serves the whole site, including images, through Cloudflare static assets.</li></ul><span class="tag">Feature release</span></div></div>
<div class="release reveal"><div><span class="version">v0.2.0</span><span class="release-date">14 OCT 2026</span></div><div><h2>Multi-page portfolio</h2><p>Split the portfolio into Projects, Expertise, About and Contact sections with project case studies.</p><span class="tag">Feature release</span></div></div>
<div class="release reveal"><div><span class="version">v0.1.0</span><span class="release-date">14 OCT 2026</span></div><div><h2>Portfolio foundation</h2><p>First site implementation with a dark responsive interface, project descriptions, professional links, metadata and accessibility foundations.</p><span class="tag">Initial build</span></div></div>
</section>`,
});

/* ───────── 404 ───────── */
pages.push({
  file: '404.html', section: '', title: 'Page not found', desc: 'This page could not be found.',
  body: `${hero('Error 404', 'Signal <span class="gradient">lost.</span>', "That page doesn't exist or has moved.", `<div class="actions"><a class="btn primary" href="/">Back home</a><a class="btn secondary" href="/projects/">Projects</a></div>`)}`,
});

for (const p of pages) {
  const out = join(ROOT, p.file);
  mkdirSync(dirname(out), { recursive: true });
  let html = page(p);
  // The 404 page is served from any path, so it needs root-relative URLs.
  if (p.file === '404.html') html = html.replace(/(href|src)="(?!https?:|\/|#|mailto:)([^"]+)"/g, '$1="/$2"');
  writeFileSync(out, html);
}

const urls = pages.filter(p => p.file !== '404.html').map(p => `${SITE}/${p.file.replace(/index\.html$/, '')}`);
writeFileSync(join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => ` <url><loc>${u}</loc><lastmod>${DATE}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`${pages.length} pages written`);
