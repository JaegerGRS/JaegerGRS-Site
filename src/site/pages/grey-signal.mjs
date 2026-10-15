import { GREY, YT, TWITCH } from '../config.mjs';
import { ext, int, links, sectionHead, hero, back, backTo, more, facts, img, faq, steps } from '../components.mjs';

export default [
{
  file: 'projects/grey-signal/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal', desc: 'Grey Signal: a tactical-shooter and FPS channel with its own multi-page website and live PC telemetry, built by Jaeger Stratton.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal']],
  body: `${hero('Project · Web & gaming · 2026', 'Grey <span class="c">Signal.</span>', 'A tactical-shooter and FPS channel with its own self-hosted website: a Windows control app, a Node site engine, live rig telemetry, and a Cloudflare version prepared for a future domain.', `<div class="actions"><a class="btn primary" href="${GREY}" target="_blank" rel="noopener noreferrer">Open the self-hosted site <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig telemetry</a><a class="btn secondary" href="${YT}" target="_blank" rel="noopener noreferrer">YouTube</a></div>`)}
<section class="section container"><figure class="media reveal">${img('grey-signal-banner.webp', 'Grey Signal channel banner: tactical operator, helicopter and mountains with the GS logo', 1920, 520)}</figure></section>
${facts(['Type', 'Self-hosted site + channel'], ['Stack', 'C# · Node · Cloudflare'], ['Feature', 'Live telemetry'], ['Role', 'Design &amp; build'])}
<section class="section container pt0"><div class="note">Grey Signal does not have a full public site yet: it is self-hosted on my own server at an open IP address over plain HTTP, so your browser may show a "not secure" notice. A proper domain is planned.</div></section>
${more('More on Grey Signal.', int('projects/grey-signal/build/', 'How the site is built', 'C# app, Node engine, Cloudflare version'), int('projects/grey-signal/channel/', 'The channel', 'Tactical shooters and FPS games'))}
<section class="section container">${sectionHead('Explore the site', 'Every page, one click.')}
${links(ext(GREY, 'Home', 'Grey Signal'), ext(GREY + '/videos.html', 'Transmissions', 'Videos'), ext(GREY + '/ops.html', 'Ops', 'Operations'), ext(GREY + '/rig.html', 'Rig', 'Live specs and telemetry'), ext(GREY + '/about.html', 'About Grey', 'FAQ'), ext(GREY + '/contact.html', 'Contact', 'Get in touch'), ext(YT + '/videos', 'YouTube videos', '@Grey_Signal'), ext(YT + '/shorts', 'YouTube shorts', '@Grey_Signal'), ext(TWITCH, 'Twitch', 'grey_signal'))}</section>
${back}`,
},
{
  file: 'projects/grey-signal/build/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal: how it is built', desc: 'How the Grey Signal website is built: a multi-page site, a live rig page, a C# Windows control app, a Node.js engine and a Cloudflare Worker version.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal', 'projects/grey-signal/'], ['Build']],
  body: `${hero('Grey Signal · The build', 'What’s in <span class="c">the site.</span>', 'A self-hosted website with its own Windows control app, Node engine and a Cloudflare version prepared for a future domain.')}
<section class="section container"><div class="two">
<div><p class="kicker">Features</p><h2 class="title">Built end to end.</h2></div>
<div><ul class="ticks"><li><span>Multi-page layout: home, transmissions, ops, rig, about and contact.</span></li><li><span>A rig page that refreshes itself with specs, load and temperatures.</span></li><li><span>Responsive design, metadata, social cards and accessibility basics.</span></li><li><span>A Windows app (C#) that runs and manages the site, with an .msi installer.</span></li><li><span>A Node.js site engine for a PC or VPS, plus a Cloudflare Worker version (D1, email, live stats) ready for a future domain.</span></li></ul>
<div class="note">The rig page shares hardware details only: no personal information, files or network details. The self-hosted site runs over plain HTTP at an open IP address, so your browser may show a "not secure" notice.</div></div></div></section>
${steps('Hosting', 'Three ways to run it.', '<strong>On this PC:</strong> free and private, and it can be shown to the world through a Cloudflare Tunnel that hides the home address.', '<strong>On Cloudflare:</strong> the Worker version with D1, email and live stats, online 24/7.', '<strong>On a rented server:</strong> the Node engine in Docker behind Caddy, for a VPS.')}
${faq('Build questions.', ['Why is the live site not on HTTPS yet?', 'It is self-hosted at an open IP address over plain HTTP while a proper domain is set up, so browsers show a not secure notice.'], ['Does the rig page share personal data?', 'No. It shares hardware names and load numbers only: no personal information, files or network details.'])}
<section class="section container pt0">${links(ext(GREY, 'Open the site', 'Self-hosted Grey Signal'), ext(GREY + '/rig.html', 'Live rig telemetry', 'Specs and load'), int('projects/rig-api/', 'Rig API', 'The same idea, for your own site'))}</section>
${backTo('projects/grey-signal/', 'Grey Signal')}`,
},
{
  file: 'projects/grey-signal/channel/index.html', section: 'projects', theme: 't-grey',
  title: 'Grey Signal: the channel', desc: 'Grey Signal is a tactical-shooter and FPS channel on YouTube and Twitch: operations, teamwork and games that punish overconfidence.',
  crumbs: [['Projects', 'projects/'], ['Grey Signal', 'projects/grey-signal/'], ['Channel']],
  body: `${hero('Grey Signal · The channel', 'Come for <span class="c">the game.</span>', 'Tactical shooters, FPS games and operations. If it rewards teamwork and punishes overconfidence, it’s probably on the list.', `<div class="actions"><a class="btn primary" href="${YT}?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Subscribe on YouTube <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${TWITCH}" target="_blank" rel="noopener noreferrer">Twitch</a></div>`)}
<section class="section container"><figure class="media reveal">${img('grey-signal-welcome.webp', 'Welcome to Grey Signal: tactical shooters and FPS games', 1400, 788)}</figure>
<p class="fine">Content may include fictional violence, warfare, blood and strong language. Viewer discretion advised.</p></section>
<section class="section container pt0">${sectionHead('Channel panels', 'The Grey Signal look.')}<div class="panels reveal">${img('gs-panel-about.webp', 'About Grey: operator profile covering tactical FPS, extraction shooters and solo operations', 350, 190)}${img('gs-panel-rules.webp', 'Stream rules: be respectful, no hate or slurs, no spoilers or backseating, no self-promo or NSFW', 350, 190)}${img('gs-panel-support.webp', 'Support: subs, bits and tips are optional, and watching helps the most', 350, 190)}${img('gs-panel-socials.webp', 'Socials: all links attached, follow for updates', 350, 190)}</div></section>
<section class="section container pt0">${links(ext(YT + '/videos', 'YouTube videos', '@Grey_Signal'), ext(YT + '/shorts', 'YouTube shorts', '@Grey_Signal'), ext(TWITCH, 'Twitch', 'grey_signal'))}</section>
${backTo('projects/grey-signal/', 'Grey Signal')}`,
},
];
