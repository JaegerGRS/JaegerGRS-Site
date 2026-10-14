import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
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
},
];
