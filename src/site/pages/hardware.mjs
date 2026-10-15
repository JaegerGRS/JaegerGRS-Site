import { GREY } from '../config.mjs';
import { PROFILE as P, WORKSTATION as W } from '../facts.mjs';
import { ext, int, links, sectionHead, hero, back, facts, rigPanel } from '../components.mjs';

export default [
{
  file: 'projects/hardware/index.html', section: 'projects', theme: 't-hw',
  title: 'PC Hardware', desc: `PC building, Windows setup and methodical troubleshooting since ${P.pcBuildingSince}, with a documented workstation and a live telemetry panel.`,
  crumbs: [['Projects', 'projects/'], ['PC Hardware']],
  body: `${hero('Project · Hardware · ' + P.pcBuildingSince + ' — present', 'PC <span class="c">hardware.</span>', 'Real experience with assembly, diagnosing faults and keeping systems useful.', `<div class="actions"><a class="btn primary" href="{up}expertise/hardware/">Hardware expertise <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${GREY}/rig.html" target="_blank" rel="noopener noreferrer">Live rig telemetry</a></div>`)}
${facts(['Started', P.pcBuildingSince], ['Focus', 'PC systems'], ['Experience', 'Hands-on'], ['Workstation', 'Listed below'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">Where it began.</h2></div>
<div class="prose"><p>PC building is where my technical work began in ${P.pcBuildingSince}, when I got my own PC. I have hands-on experience selecting components, assembling machines, configuring Windows and investigating performance and stability problems.</p><p>Most of this experience comes from independently maintained systems and personal builds, documented as practical technical work.</p><div class="chips"><span>Desktop PCs</span><span>Component selection</span><span>Windows</span><span>Drivers</span><span>Diagnostics</span><span>Thermals</span></div></div></div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">The work</p><h2 class="title">From idea to iteration.</h2></div>
<div class="timeline"><div><b>01</b><h3>Plan the machine</h3><p>Choose compatible components for workload, thermals, expansion and price.</p></div><div><b>02</b><h3>Build and configure</h3><p>Assemble, set up the OS, and check drivers, cooling and stability.</p></div><div><b>03</b><h3>Troubleshoot methodically</h3><p>Isolate symptoms, verify assumptions and retest after each change.</p></div></div></div></div></section>
<section class="section container">${sectionHead('Evidence', 'Photographs.', 'Real photographs of systems I have built or maintained.')}
<div class="gallery">
<div class="ph"><b>Photo needed</b>Complete system</div>
<div class="ph"><b>Photo needed</b>Internal layout and cable management</div>
<div class="ph"><b>Photo needed</b>Cooling installation</div>
<div class="ph"><b>Photo needed</b>Storage and upgrade work</div>
</div>
<p class="fine">These are placeholders. Only real photographs of my own work will go here, with before-and-after pairs where I have them.</p></section>
<section class="section muted"><div class="container">${sectionHead('Repairs and upgrades', 'Case studies.', 'Each will follow one format, and only genuine jobs will be published.')}
<dl class="cs">
<dt>Problem</dt><dd>What was observed.</dd><dt>Investigation</dt><dd>Checks and tools used.</dd><dt>Cause</dt><dd>What was established.</dd><dt>Solution</dt><dd>What was changed.</dd><dt>Verification</dt><dd>How the result was confirmed.</dd><dt>Outcome</dt><dd>What actually improved.</dd>
</dl>
<p class="fine">No repair case studies are published yet. They will be added from real jobs, not examples.</p></div></section>
<section class="section container">${sectionHead('Workstation', 'Specifications.', 'Listed separately so nothing is mixed up.')}
<div class="specs-cols">
<div><h3>Main workstation (as listed)</h3><p>${W.cpu}, ${W.ram} RAM, ${W.gpu}. This is my own description of my main machine. It is not read from the live panel below.</p></div>
<div><h3>Previous configurations</h3><p>None documented yet.</p></div>
<div><h3>Planned upgrades</h3><p>None published.</p></div>
</div>
<div class="note">The live panel below shows whichever PC is currently running my tray app. That may be a different machine from the one listed above, so the two can differ.</div></section>
<section class="section container pt0">${sectionHead('Live telemetry', 'Live from a real PC.', 'A working demonstration of the Rig API.')}
${rigPanel()}
<div class="note">The tray app shares hardware details only: no personal information, files or network details.</div>
${links(ext(GREY + '/rig.html', 'Live rig page', 'Specs and telemetry'), int('projects/rig-api/', 'Rig API case study', 'How the panel works'), int('projects/grey-signal/', 'Grey Signal', 'The project behind it'), int('expertise/hardware/', 'Hardware expertise', 'How I work'))}</section>${back}`,
},
];
