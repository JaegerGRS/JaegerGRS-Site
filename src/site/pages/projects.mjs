import { GREY, SVART, JTT } from '../config.mjs';
import { sectionHead, hero, cta, img } from '../components.mjs';

// Order follows the portfolio priority: practical IT first, content second.
// Only technologies already documented on the case-study pages are listed as chips.
const projects = [
  { cat: 'hardware', theme: 't-hw', status: 'Active', icon: '▣', title: 'PC hardware',
    text: 'Assembly, upgrades, Windows setup and methodical troubleshooting, with building experience since 2016.',
    chips: ['Assembly', 'Windows', 'Diagnostics'],
    links: '<a class="text-link" href="{up}projects/hardware/">Read the case study →</a>' },
  { cat: 'software systems', theme: 't-rig', status: 'Released', icon: 'API', title: 'Rig API',
    text: 'Live PC specs and load for a website: a small Windows tray app, a Cloudflare Worker and an embeddable panel. It powers the live panel on this site.',
    chips: ['C#', 'Cloudflare Workers', 'Durable Objects'],
    links: '<a class="text-link" href="{up}projects/rig-api/">Read the case study →</a>' },
  { cat: 'privacy software', theme: 't-svart', status: 'In development', icon: 'S', title: 'Svart Security',
    text: 'A planned set of privacy tools. The website is live; the tools are at different stages and none should be treated as finished.',
    chips: ['10 tools planned', 'Privacy by design'],
    links: `<a class="text-link" href="{up}projects/svart-security/">Read the case study →</a><a class="text-link" href="${SVART}" target="_blank" rel="noopener noreferrer">svartsecurity.org ↗</a>` },
  { cat: 'ai software', theme: 't-ae', status: 'Prototype', icon: 'AE', title: 'JAE',
    text: 'A little AI I am building: a private, local-first desktop app made with Tauri, with source on GitHub.',
    chips: ['Tauri', 'Local AI', 'MSI workflow'],
    links: '<a class="text-link" href="{up}projects/jae/">Read the case study →</a><a class="text-link" href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>' },
  { cat: 'systems creative', theme: 't-grey', status: 'Active', logo: true, title: 'Grey Signal',
    text: 'A tactical-shooter gaming content channel, plus the website, Windows app and live rig page I built for it.',
    chips: ['C#', 'Node', 'Live telemetry'],
    links: `<a class="text-link" href="{up}projects/grey-signal/">Read the case study →</a><a class="text-link" href="${GREY}" target="_blank" rel="noopener noreferrer">Self-hosted site ↗</a>` },
  { cat: 'creative', theme: 't-jae', status: 'Active', icon: 'J', title: 'JaeTheTech',
    text: 'A personal technical site in plain HTML, CSS and JavaScript, with a Cloudflare Worker for passwordless sign-in. It also describes the Personal AI project.',
    chips: ['HTML/CSS/JS', 'Cloudflare Workers', 'KV'],
    links: `<a class="text-link" href="{up}projects/jaethetech/">Read the case study →</a><a class="text-link" href="${JTT}" target="_blank" rel="noopener noreferrer">jaethetech.com ↗</a>` },
  { cat: 'ai creative', theme: 't-story', status: 'In development', icon: '▶', title: 'YouTube AI Story',
    text: 'A local Python pipeline: Ollama scripts, local text-to-speech, GPU-assisted rendering, similarity checks and file manifests. Early stage, not released.',
    chips: ['Python', 'Tauri', 'GPU rendering'],
    links: '<a class="text-link" href="{up}projects/story-ai/">Read the case study →</a>' },
];

const card = (p, i) => `<article class="card ${p.theme} proj" data-cat="${p.cat}"><div class="card-top"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="tag">${p.status}</span></div>${p.logo ? img('grey-signal-logo.webp', 'Grey Signal logo', 160, 160, 'logo-badge mt-icon') : `<span class="icon mt-icon">${p.icon}</span>`}<h3>${p.title}</h3><p>${p.text}</p><div class="chips">${p.chips.map(c => `<span>${c}</span>`).join('')}</div><div class="stack">${p.links}</div></article>`;

const REPO = 'https://github.com/JaegerGRS/JaegerGRS-Site';
const gh = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}<span class="sr-only"> (opens in a new tab)</span></a>`;

// What can be checked today, and what is still missing. Nothing here is a placeholder for evidence that does not exist.
const evidence = [
  { name: 'PC hardware', have: ['A written workstation specification, labelled as my own description and not read from a live machine.', 'The live Rig API panel, which reports the specifications of a real PC.'],
    todo: ['Photographs of my own builds: complete system, internal layout, cooling, storage work.', 'Repair and upgrade case studies from real jobs, with the diagnostic steps and how each fix was verified.', 'Confirm the workstation specification against the machine itself.'] },
  { name: 'Rig API', have: [`Source on GitHub: ${gh(REPO + '/tree/main/src', 'Worker')}, ${gh(REPO + '/tree/main/agent', 'tray app')}.`, 'An architecture diagram, a Wrangler configuration excerpt and the embed snippet.', `Online and offline screenshots, dated, with the offline one labelled as a local test copy.`, `An automated ${gh(REPO + '/blob/main/scripts/test-worker.mjs', 'Worker test script')} that CI runs, covering authentication, validation, rate limits, offline state and CORS.`, `A ${gh(REPO + '/blob/main/docs/SECURITY-REVIEW.md', 'security review')} listing what was checked and the gaps that remain.`],
    todo: ['Screenshots of the tray app and the pairing step.', 'A clean-machine test of the install instructions, written up with the result.'] },
  { name: 'Svart Security', have: ['The live website, svartsecurity.org.'],
    todo: ['No tool is released, so there is no application screenshot, repository or test result to show yet.', 'Add them per tool when each one exists.'] },
  { name: 'JAE', have: [`Public ${gh('https://github.com/JaegerGRS/JAE', 'source')} and ${gh('https://github.com/JaegerGRS/JAE/actions', 'GitHub Actions run history')}.`, 'Architecture and pipeline diagrams, with the known limitations listed.'],
    todo: ['Screenshots of the running application.', 'A first release and a run of the MSI workflow, with the result.'] },
  { name: 'Grey Signal', have: ['Screenshots of the site home page and the live rig page, and the channel artwork.', 'An architecture diagram and a written plan for moving off plain HTTP.'],
    todo: ['Screenshots of the Windows control app.', 'Installer test notes.', 'The HTTPS move itself, once approved.'] },
  { name: 'JaeTheTech', have: [`Public ${gh('https://github.com/JaeTheTech/JaeTheTech.com', 'repository')} and two site screenshots.`],
    todo: ['Screenshots and a description of the Personal AI features that exist today.', 'A measured performance result for the site.'] },
  { name: 'YouTube AI Story', have: ['Architecture and pipeline diagrams, with each stage marked as implemented, partial or planned.'],
    todo: ['Screenshots of the application.', 'Real run logs and measured timings from the pipeline. No benchmark is shown until one has been measured.', 'A repository link, if the code is made public.'] },
];

const evidenceCard = e => `<article class="card"><h3>${e.name}</h3><p class="kicker">Available now</p><ul class="ticks">${e.have.map(x => `<li><span>${x}</span></li>`).join('')}</ul><p class="kicker">Content tasks</p><ul class="ticks">${e.todo.map(x => `<li><span>${x}</span></li>`).join('')}</ul></article>`;

const statuses = [
  ['Released', 'Working and in use. It may still receive updates.'],
  ['Active', 'Running and maintained, with ongoing work.'],
  ['Prototype', 'Runs, but is early and incomplete.'],
  ['In development', 'Being built. Parts exist; it is not ready to rely on.'],
  ['Planned', 'An intention only. Nothing is built yet.'],
];

export default [
{
  file: 'projects/index.html', section: 'projects',
  title: 'Projects', desc: 'Selected technical work by Jaeger Stratton: PC hardware, the Rig API, Svart Security, JAE, Grey Signal, JaeTheTech and YouTube AI Story, each with a status and a case study.',
  crumbs: [['Projects']],
  body: `${hero('Projects', 'Selected <span class="gradient">technical work.</span>', 'An overview of the systems, applications and independent projects I have developed, maintained and tested. Each case study sets out what the project is for, how it was built and where it stands now.')}
<section class="section container">${sectionHead('Directory', 'Seven projects.', 'Practical IT work first, then software, privacy, AI and content.')}
<div class="filters" data-filters aria-label="Filter projects"></div>
<div class="grid g3" data-project-grid>
${projects.map(card).join('\n')}
</div>
<p class="fine">Real screenshots and photographs are being added to each case study as they are gathered. Nothing on these pages is mock-up data.</p></section>
<section class="section container" id="evidence">${sectionHead('Evidence', 'What you can check.', 'Per project: the evidence that exists today, and the content still to be gathered. I add evidence only when I have it.')}
<div class="grid g2">
${evidence.map(evidenceCard).join('\n')}
</div>
<p class="fine">Where a screenshot or photograph is not listed as available, it has not been published. Evidence is added only from real work.</p></section>
<section class="section muted"><div class="container">${sectionHead('Status key', 'What the labels mean.', 'Used the same way on every card and case study.')}
<dl class="statuses">${statuses.map(([t, d]) => `<div><dt><span class="tag">${t}</span></dt><dd>${d}</dd></div>`).join('')}</dl></div></section>
${cta('Want to talk about<br>any of these?', 'Happy to go deeper on how anything here was built.')}`,
},
];
