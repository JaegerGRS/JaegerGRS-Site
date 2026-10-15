import { GREY, YT, TWITCH } from '../config.mjs';
import { ext, int, links, sectionHead, hero, back, backTo, more, facts, img, faq, steps } from '../components.mjs';

const GS_LOGO = img('grey-signal-logo.webp', 'Grey Signal logo', 160, 160, 'logo-badge hero-logo');

export default [
{
  file: 'projects/grey-signal/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal', desc: 'The engineering behind the Grey Signal gaming channel: a self-hosted website, C# Windows control app, MSI installer, Node.js engine and live PC telemetry.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal']],
  body: `${hero('Project · Website, app and infrastructure · 2026', 'Grey <span class="c">Signal.</span>', 'The engineering built around my gaming channel: a self-hosted multipage website, a C# Windows control app, an installer, a Node.js site engine, a Cloudflare Worker version and live PC telemetry.', `<div class="actions"><a class="btn primary" href="{up}projects/grey-signal/build/">How it is built</a><a class="btn secondary" href="${GREY}" target="_blank" rel="noopener noreferrer">Open the site (HTTP) <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig page</a></div>`, GS_LOGO)}
<section class="section container"><figure class="media reveal">${img('grey-signal-banner.webp', 'Grey Signal channel banner: tactical operator, helicopter and mountains with the GS logo', 1920, 520)}</figure></section>
${facts(['Type', 'Engineering project'], ['Status', 'Active'], ['Role', 'Designer and developer'], ['Hosting today', 'Self-hosted · HTTP only'])}
<section class="section container pt0">${sectionHead('What I built', 'The engineering behind a channel.')}<div class="grid g3">
<div class="card reveal"><span class="icon">⌘</span><h3>Self-hosted website</h3><p>A multipage site: home, videos, ops, a live rig page, about and contact.</p></div>
<div class="card reveal"><span class="icon">▣</span><h3>C# Windows control app</h3><p>Runs and manages the site engine on my PC and reports the PC's specs and load.</p></div>
<div class="card reveal"><span class="icon">◧</span><h3>Windows installer</h3><p>An .msi installer for the app, built with WiX.</p></div>
<div class="card reveal"><span class="icon">{ }</span><h3>Node.js site engine</h3><p>Serves the site, handles the contact form, stores data in SQLite and has a local-only admin area.</p></div>
<div class="card reveal"><span class="icon">☁</span><h3>Cloudflare Worker version</h3><p>The same site on Workers with a D1 database and email. Prepared, not live (see below).</p></div>
<div class="card reveal"><span class="icon">◔</span><h3>Live rig telemetry</h3><p>Specs, load and temperatures that grew into the <a class="text-link inline" href="{up}projects/rig-api/">Rig API</a>.</p></div>
<div class="card reveal"><span class="icon">✎</span><h3>Guides and security notes</h3><p>Six written guides covering local running, Cloudflare, security and hosting options.</p></div>
<div class="card reveal"><span class="icon">◐</span><h3>Branding and graphics</h3><p>Logo, banner, welcome art and channel panels, shown on the channel page.</p></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Working and prepared', 'What is live, and what is not.', 'Kept separate so nothing prepared is mistaken for something deployed.')}
<div class="specs-cols">
<div><h3>Working today</h3><p>The Node.js engine running on my PC and serving the site over plain HTTP at a public IP address, the live rig page, the Windows app, and a built MSI installer.</p></div>
<div><h3>Prepared, not live</h3><p>The Cloudflare Worker version, hosting through a Cloudflare Tunnel, home hosting with HTTPS, and a Docker setup for a rented server. The code and guides exist; none is switched on.</p></div>
</div>
<div class="note">The live site is served over plain HTTP, so browsers show "not secure". Moving it to HTTPS is planned and documented on the build page. Nothing has been changed yet.</div></div></section>
${more('More on Grey Signal.', int('projects/grey-signal/build/', 'Architecture and build', 'Diagram, screenshots, decisions, HTTPS plan'), int('projects/grey-signal/channel/', 'The channel', 'Supporting creative work'))}
<section class="section container">${sectionHead('Explore the site', 'Every page, one click.')}
${links(ext(GREY, 'Home', 'Grey Signal'), ext(GREY + '/videos.html', 'Transmissions', 'Videos'), ext(GREY + '/ops.html', 'Ops', 'Operations'), ext(GREY + '/rig.html', 'Rig', 'Live specs and telemetry'), ext(GREY + '/about.html', 'About Grey', 'FAQ'), ext(GREY + '/contact.html', 'Contact', 'Get in touch'), ext(YT + '/videos', 'YouTube videos', '@Grey_Signal'), ext(YT + '/shorts', 'YouTube shorts', '@Grey_Signal'), ext(TWITCH, 'Twitch', 'grey_signal'))}</section>
${back}`,
},
{
  file: 'projects/grey-signal/build/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal: how it is built', desc: 'How the Grey Signal website is built: a multi-page site, a live rig page, a C# Windows control app, a Node.js engine and a Cloudflare Worker version.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal', 'projects/grey-signal/'], ['Build']],
  body: `${hero('Grey Signal · The build', 'What’s in <span class="c">the site.</span>', 'Architecture, technical decisions and evidence for a self-hosted website with its own Windows control app, Node engine and a prepared Cloudflare version.', '', GS_LOGO)}
<section class="section container"><div class="two">
<div><p class="kicker">Features</p><h2 class="title">Built end to end.</h2></div>
<div><ul class="ticks"><li><span>Multi-page layout: home, transmissions, ops, rig, about and contact.</span></li><li><span>A rig page that refreshes itself with specs, load and temperatures.</span></li><li><span>Responsive design, metadata, social cards and accessibility basics.</span></li><li><span>A Windows app (C#) that runs and manages the site, with an .msi installer.</span></li><li><span>A Node.js site engine for a PC or VPS, plus a Cloudflare Worker version (D1, email, live stats) ready for a future domain.</span></li></ul>
<div class="note">The rig page shares hardware details only: no personal information, files or network details. The self-hosted site runs over plain HTTP at an open IP address, so your browser may show a "not secure" notice.</div></div></div></section>
${facts(['Authored source', '91 files, about 8,500 lines'], ['Parts', 'C# app · Node engine · Cloudflare Worker · site · installer'], ['File dates', '7 to 14 October 2026'], ['Guides', '6 written guides'])}
<section class="section container pt0"><p class="fine">Counted from my source backup, excluding generated bundles, lockfiles, images and fonts. An earlier version of this page said "130+ files, about 62,000 lines"; that figure included generated files and was wrong. Line counts show size, not quality. File dates are a rough guide to the build period.</p></section>
<section class="section container pt0">${sectionHead('Architecture', 'How the parts connect.', 'Solid arrows are working today. Dashed arrows are prepared but not switched on.')}
<figure class="media reveal"><svg viewBox="0 0 720 330" role="img" aria-labelledby="gs-arch-t gs-arch-d" width="720" height="330"><title id="gs-arch-t">Grey Signal architecture</title><desc id="gs-arch-d">The C# Windows app runs the Node.js engine on my PC and collects rig telemetry, which the engine receives. The engine serves the website and stores data in SQLite. Visitors reach it over HTTP at a public IP address. A Cloudflare Worker with D1 (an alternative host) and a Cloudflare Tunnel (to the engine) are prepared, drawn dashed.</desc>
<defs><marker id="gsa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8c97a4"/></marker></defs>
<g fill="#131b25" stroke="#263140"><rect x="10" y="20" width="200" height="70" rx="6"/><rect x="260" y="20" width="200" height="70" rx="6"/><rect x="510" y="20" width="200" height="70" rx="6"/><rect x="260" y="140" width="200" height="70" rx="6"/><rect x="10" y="140" width="200" height="70" rx="6"/><rect x="510" y="140" width="200" height="70" rx="6" stroke-dasharray="5 4"/><rect x="510" y="250" width="200" height="60" rx="6" stroke-dasharray="5 4"/></g>
<g fill="#e8edf2" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle"><text x="110" y="52">C# Windows app</text><text x="360" y="52">Node.js engine</text><text x="610" y="52">Website (visitors)</text><text x="360" y="172">SQLite data</text><text x="110" y="172">Rig telemetry</text><text x="610" y="172">Cloudflare Worker</text><text x="610" y="278">Cloudflare Tunnel</text></g>
<g fill="#8c97a4" font-family="system-ui,sans-serif" font-size="12" text-anchor="middle"><text x="110" y="72">runs and manages</text><text x="360" y="72">serves site, contact form, admin</text><text x="610" y="72">HTTP, public IP address</text><text x="360" y="192">on this PC</text><text x="110" y="192">specs and load</text><text x="610" y="192">+ D1 database, email</text><text x="610" y="298">HTTPS without open ports</text></g>
<g stroke="#8c97a4" fill="none" stroke-width="1.5" marker-end="url(#gsa)"><path d="M210 55H258"/><path d="M460 55H508"/><path d="M360 90V138"/><path d="M110 92V138"/><path d="M210 175H258"/></g>
<g stroke="#8c97a4" fill="none" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#gsa)"><path d="M610 140V92"/><path d="M460 80H485V280H508"/></g></svg>
<figcaption class="fine">Diagram drawn from the project's code and guides. It shows relationships only, with no figures.</figcaption></figure></section>
<section class="section muted"><div class="container">${sectionHead('Decisions', 'Why these technologies.')}<div class="grid g3">
<div class="card reveal"><h3>C# for the Windows app</h3><p>It uses the compiler that ships with Windows, so building the app needs no extra tools, and it can read hardware details through Windows management interfaces.</p></div>
<div class="card reveal"><h3>Node.js for the engine</h3><p>One language across the engine and the web pages, with the built-in SQLite module, so there are only a few dependencies.</p></div>
<div class="card reveal"><h3>Cloudflare for reach</h3><p>Workers, D1 and a Tunnel provide HTTPS, and 24/7 availability for the Worker version, without opening router ports.</p></div>
</div></div></section>
<section class="section container">${sectionHead('Evidence', 'Screenshots.', 'Real captures of the running site. Others are still needed.')}<div class="grid g2">
<figure class="reveal">${img('gs-site-home.webp', 'The Grey Signal site home page running locally, with the dark orange channel theme', 1200, 750)}<figcaption class="fine">Website home page.</figcaption></figure>
<figure class="reveal">${img('gs-site-rig.webp', 'The Grey Signal live rig page listing processor, graphics and memory specifications', 1200, 750)}<figcaption class="fine">Live rig page.</figcaption></figure>
</div>
<div class="gallery"><div class="ph"><strong>Photo needed</strong><span>Windows app window</span></div><div class="ph"><strong>Photo needed</strong><span>Installer screens</span></div><div class="ph"><strong>Photo needed</strong><span>Configuration screen</span></div><div class="ph"><strong>Photo needed</strong><span>Deployment workflow</span></div></div></section>
${steps('Hosting', 'Three ways to run it.', '<strong>On this PC (live, over HTTP):</strong> free and private. The guides also describe showing it through a Cloudflare Tunnel; that is prepared, not switched on.', '<strong>On Cloudflare (prepared):</strong> the Worker version with D1, email and live stats, online 24/7.', '<strong>On a rented server (prepared):</strong> the Node engine in Docker behind Caddy, for a VPS.')}
<section class="section muted"><div class="container">${sectionHead('Security', 'Plan: move to HTTPS.', 'A plan only. No infrastructure has been changed.')}<ol class="steps-list"><li>Document the current setup (above) and keep a working copy of the backup.</li><li>Create a Cloudflare Tunnel on a test hostname such as grey.jaegergrs.com, pointing at the engine on this PC (the guides already support this).</li><li>Test the pages, contact form, rig page and admin lock-down through the tunnel. The admin area must not be reachable from the internet.</li><li>Only then update the links on this site from the IP address to the HTTPS hostname.</li><li>Keep the old address working until the new one passes, so it can be rolled back.</li></ol><div class="note">This needs my approval and a Cloudflare setup step. It also keeps the PC and app on for the site to be up.</div></div></section>
${faq('Build questions.', ['Why is the live site not on HTTPS yet?', 'It is self-hosted at an open IP address over plain HTTP. A tested Cloudflare Tunnel replacement is planned; see Security above.'], ['Does the rig page share personal data?', 'No. It shares hardware names and load numbers only: no personal information, files or network details.'])}
<section class="section container pt0">${links(ext(GREY, 'Open the site', 'Self-hosted Grey Signal'), ext(GREY + '/rig.html', 'Live rig telemetry', 'Specs and load'), int('projects/rig-api/', 'Rig API', 'The same idea, for your own site'))}</section>
${backTo('projects/grey-signal/', 'Grey Signal')}`,
},
{
  file: 'projects/grey-signal/channel/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal: the channel', desc: 'Grey Signal is a tactical-shooter and FPS channel on YouTube and Twitch: operations, teamwork and games that punish overconfidence.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal', 'projects/grey-signal/'], ['Channel']],
  body: `${hero('Grey Signal · The channel', 'Come for <span class="c">the game.</span>', 'Tactical shooters, FPS games and operations. If it rewards teamwork and punishes overconfidence, it’s probably on the list.', `<div class="actions"><a class="btn secondary" href="${YT}" target="_blank" rel="noopener noreferrer">YouTube <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${TWITCH}" target="_blank" rel="noopener noreferrer">Twitch <span aria-hidden="true">↗</span></a></div>`, GS_LOGO)}
<section class="section container"><figure class="media reveal">${img('grey-signal-welcome.webp', 'Welcome to Grey Signal: tactical shooters and FPS games', 1400, 788)}</figure>
<p class="fine">Content may include fictional violence, warfare, blood and strong language. Viewer discretion advised.</p></section>
<section class="section container pt0">${sectionHead('Channel panels', 'The Grey Signal look.')}<div class="panels reveal">${img('gs-panel-about.webp', 'About Grey: operator profile covering tactical FPS, extraction shooters and solo operations', 350, 190)}${img('gs-panel-rules.webp', 'Stream rules: be respectful, no hate or slurs, no spoilers or backseating, no self-promo or NSFW', 350, 190)}${img('gs-panel-support.webp', 'Support: subs, bits and tips are optional, and watching helps the most', 350, 190)}${img('gs-panel-socials.webp', 'Socials: all links attached, follow for updates', 350, 190)}</div></section>
<section class="section container pt0">${links(ext(YT + '/videos', 'YouTube videos', '@Grey_Signal'), ext(YT + '/shorts', 'YouTube shorts', '@Grey_Signal'), ext(TWITCH, 'Twitch', 'grey_signal'))}</section>
${backTo('projects/grey-signal/', 'Grey Signal')}`,
},
];
