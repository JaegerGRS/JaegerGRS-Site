import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards, rigPanel } from '../components.mjs';

export default [
{
  file: 'projects/hardware/index.html', section: 'projects', theme: 't-hw',
  title: 'PC Hardware', desc: 'PC building, Windows setup and methodical troubleshooting since 2015, plus the Ryzen 9 5950X / RTX 3070 Ti workstation.',
  crumbs: [['Projects', 'projects/'], ['PC Hardware']],
  body: `${hero('Project · Hardware · 2015 — present', 'PC <span class="c">hardware.</span>', 'Real experience with assembly, diagnosing faults and keeping systems useful.', `<div class="actions"><a class="btn primary" href="{up}expertise/hardware/">Hardware expertise <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig telemetry</a></div>`)}
${facts(['Started', '2015'], ['Focus', 'PC systems'], ['Experience', 'Hands-on'], ['Current rig', '<span data-rig-live="line">Ryzen 9 5950X · RTX 3070 Ti</span>'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">Where it began.</h2></div>
<div class="prose"><p>PC building is where my technical work began in 2015. I have hands-on experience selecting components, assembling machines, configuring Windows and investigating performance and stability problems.</p><p>Most of this experience comes from independently maintained systems and personal builds, documented as practical technical work.</p><div class="chips"><span>Desktop PCs</span><span>Component selection</span><span>Windows</span><span>Drivers</span><span>Diagnostics</span><span>Thermals</span></div></div></div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">The work</p><h2 class="title">From idea to iteration.</h2></div>
<div class="timeline"><div><b>01</b><h3>Plan the machine</h3><p>Choose compatible components for workload, thermals, expansion and price.</p></div><div><b>02</b><h3>Build and configure</h3><p>Assemble, set up the OS, and check drivers, cooling and stability.</p></div><div><b>03</b><h3>Troubleshoot methodically</h3><p>Isolate symptoms, verify assumptions and retest after each change.</p></div></div></div></div></section>
<section class="section container">${sectionHead('The rig', '<span data-rig-live="fullLine">Ryzen 9 5950X · 64 GB · RTX 3070 Ti</span>.', 'The workstation I build, test, game and stream on.')}
<div class="note">Live data comes from a small program on my PC that connects to this site with a private key. It shares hardware details only: no personal information, files or network details.</div>
${rigPanel()}
${links(ext(GREY + '/rig.html', 'Live rig page', 'Specs and telemetry'), int('projects/grey-signal/', 'Grey Signal', 'The project behind it'), int('expertise/hardware/', 'Hardware expertise', 'How I work'))}</section>
${back}`,
},
];
