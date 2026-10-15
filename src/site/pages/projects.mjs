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
    text: 'An AI tool for story-style content, from short clips to long videos, running on my own PC.',
    chips: ['Python', 'Tauri', 'GPU rendering'],
    links: '<a class="text-link" href="{up}projects/story-ai/">Read the case study →</a>' },
];

const card = (p, i) => `<article class="card ${p.theme} proj" data-cat="${p.cat}"><div class="card-top"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="tag">${p.status}</span></div>${p.logo ? img('grey-signal-logo.webp', 'Grey Signal logo', 160, 160, 'logo-badge mt-icon') : `<span class="icon mt-icon">${p.icon}</span>`}<h3>${p.title}</h3><p>${p.text}</p><div class="chips">${p.chips.map(c => `<span>${c}</span>`).join('')}</div><div class="stack">${p.links}</div></article>`;

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
<section class="section muted"><div class="container">${sectionHead('Status key', 'What the labels mean.', 'Used the same way on every card and case study.')}
<dl class="statuses">${statuses.map(([t, d]) => `<div><dt><span class="tag">${t}</span></dt><dd>${d}</dd></div>`).join('')}</dl></div></section>
${cta('Want to talk about<br>any of these?', 'Happy to go deeper on how anything here was built.')}`,
},
];
