import { hero, cta, sectionHead, int, links, facts } from '../components.mjs';

const a = (href, label) => `<a class="text-link inline" href="{up}${href}">${label}</a>`;
const row = (...c) => `<tr>${c.map((x, i) => (i === 0 ? `<th scope="row">${x}</th>` : `<td>${x}</td>`)).join('')}</tr>`;
const table = (label, head, rows) => `<div class="compare-wrap reveal" tabindex="0" role="region" aria-label="${label}"><table class="compare"><caption class="sr-only">${label}</caption><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const list = (...items) => `<ul class="ticks">${items.map(i => `<li><span>${i}</span></li>`).join('')}</ul>`;
const block = (kicker, title, inner, id = '') => `<section class="section container pt0"${id ? ` id="${id}"` : ''}><div class="two"><div><p class="kicker">${kicker}</p><h2 class="title">${title}</h2></div><div>${inner}</div></div></section>`;

export default [
{
  file: 'expertise/index.html', section: 'expertise',
  title: 'Expertise', desc: 'Skills organised by area, each linked to the project that demonstrates it: hardware and systems, Windows support, software development, and privacy, security and infrastructure.',
  crumbs: [['Expertise']],
  body: `${hero('Capabilities', 'Skills, with <span class="gradient">evidence.</span>', 'Each area below links to the work that demonstrates it. There are no percentages or star ratings: judge the work, not a number I gave myself.')}
<section class="section container"><h2 class="sr-only">Areas of expertise</h2><div class="grid g2">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><div class="card-top"><span class="icon">▣</span><span class="num">01 / Hardware &amp; systems</span></div><h3>Hardware &amp; Systems</h3><p>PC assembly, component compatibility, maintenance, diagnostics, cooling and stability.</p><span class="go">Method and evidence →</span></a>
<a class="card t-hw reveal" href="{up}expertise/hardware/#windows"><div class="card-top"><span class="icon">▤</span><span class="num">02 / IT support</span></div><h3>IT Support &amp; Windows</h3><p>Windows setup, configuration, drivers, troubleshooting, application support and system maintenance.</p><span class="go">Windows support →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><div class="card-top"><span class="icon">{ }</span><span class="num">03 / Software</span></div><h3>Software Development</h3><p>Frontend development, Node.js, APIs, desktop software and the languages I have actually shipped in.</p><span class="go">Decisions and evidence →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/#security-infrastructure"><div class="card-top"><span class="icon">◈</span><span class="num">04 / Security</span></div><h3>Privacy, Security &amp; Infrastructure</h3><p>Cloudflare deployment, privacy-focused software, safe configuration and security-oriented engineering practice.</p><span class="go">Infrastructure and security →</span></a>
</div></section>
<section class="section container pt0">${sectionHead('Skills', 'Where each skill is demonstrated.', 'Only things that appear in a project on this site. Follow the links to check.')}
${table('Skills demonstrated in projects', ['Skill', 'Demonstrated in'], [
  row('Frontend: responsive HTML, CSS and JavaScript', `${a('', 'This site')} (generated static pages, tested at 320px and 1280px) and ${a('projects/jaethetech/', 'JaeTheTech')}`),
  row('Node.js', `The static site generator and test scripts behind this site, and the Node site engine in ${a('projects/grey-signal/build/', 'Grey Signal')}`),
  row('APIs and Cloudflare Workers', `${a('projects/rig-api/', 'Rig API')} (authenticated API, Durable Object state) and the contact form Worker on this site`),
  row('C# and Windows desktop software', `The ${a('projects/rig-api/', 'Rig API tray app')} (WMI, DPAPI, start with Windows) and the Grey Signal control app`),
  row('Python and local AI', `The ${a('projects/story-ai/', 'YouTube AI Story')} pipeline (Ollama, XTTS, FFmpeg) and the ${a('projects/jae/', 'JAE')} backend`),
  row('PC hardware and Windows support', `${a('projects/hardware/', 'PC Hardware')}. No repair case studies are published yet.`),
  row('Security-minded engineering', `The ${a('projects/rig-api/#security', 'Rig API security review')}, which lists gaps as well as controls`),
])}
<div class="grid g2 mt-icon">
<div class="card reveal"><h3>Used in experimental projects</h3><p>Tauri desktop shells, local language and voice models through Ollama and XTTS, and FFmpeg rendering. They appear in ${a('projects/jae/', 'JAE')}, ${a('projects/jaethetech/personal-ai/', 'Personal AI')} and ${a('projects/story-ai/', 'YouTube AI Story')}, whose status pages say how far each has got.</p></div>
<div class="card reveal"><h3>Currently learning</h3><p>Not published yet. I will list these only when I have confirmed them, rather than guess.</p></div>
</div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">Approach</p><h2 class="title">Measure twice.<br>Change once.</h2></div>
<div class="timeline"><div><b>01</b><h3>Understand the constraint</h3><p>What is failing, what actually matters, and what cannot be broken in the process?</p></div><div><b>02</b><h3>Make the smallest useful change</h3><p>Prefer clarity and maintainability over another layer of complexity.</p></div><div><b>03</b><h3>Verify it behaves</h3><p>Test the outcome, check what changed and document it for next time.</p></div></div></div></div></section>
${cta('Have a problem<br>that needs solving?', 'I am interested in IT support, PC assembly, troubleshooting and thoughtful development work.')}`,
},

{
  file: 'expertise/hardware/index.html', section: 'expertise', theme: 't-hw',
  title: 'Hardware, Systems & Windows', desc: 'Diagnostic method, verification practice and evidence for PC hardware, Windows setup and IT support, with links to the hardware project.',
  crumbs: [['Expertise', 'expertise/'], ['Hardware & systems']],
  body: `${hero('Expertise · Hardware, systems and Windows', 'Hardware, systems <span class="c">&amp; Windows.</span>', 'PC assembly, diagnostics and Windows support, learned from my own machines since 2016. The emphasis is on finding the cause and proving the fix.', `<div class="actions"><a class="btn primary" href="{up}projects/hardware/">PC hardware project <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/rig-api/">Live telemetry case study</a></div>`)}
${facts(['Started', '2016'], ['Evidence', 'Project page and live telemetry'], ['Case studies', 'None published yet'], ['Ratings', 'None, by design'])}
${block('Method', 'How I diagnose a fault.', `<ol class="steps-list"><li><strong>Describe the symptom exactly.</strong> When it happens, how often, and what changed beforehand.</li><li><strong>Check the cheap things first.</strong> Seating, power and cables, then temperatures and event logs.</li><li><strong>Change one variable at a time.</strong> Swap or remove one thing, retest, and write down the result.</li><li><strong>Isolate the layer.</strong> Hardware, firmware, driver, operating system or application.</li><li><strong>Fix, then confirm.</strong> Repeat the original failing scenario.</li></ol>`)}
${block('Verification', 'How I confirm it worked.', list('Reproduce the original symptom before the change, so there is something to compare against.', 'Repeat the same scenario afterwards, under load where heat or stability was the issue.', 'Record temperatures and behaviour before and after, rather than relying on feel.', 'Keep notes of what changed, so a regression can be traced.'))}
${block('Windows', 'IT support and Windows.', `<p>Windows installation and configuration, driver management, peripherals, common application support and routine maintenance. The strongest public evidence is software that works closely with Windows: the ${a('projects/rig-api/', 'Rig API tray app')} reads hardware through WMI, protects its key with DPAPI and starts with Windows.</p><p class="fine">Hands-on support work is described on the ${a('projects/hardware/', 'hardware project page')}. I have not published support tickets or client work.</p>`, 'windows')}
${block('Evidence', 'Real work to look at.', `${links(int('projects/hardware/', 'PC Hardware', 'Workstation, gallery slots and case-study format'), int('projects/#evidence', 'Evidence register', 'What exists for each project, and what is still to gather'), int('projects/rig-api/', 'Rig API case study', 'Live telemetry from a real PC'), int('projects/rig-api/#live', 'Live panel', 'Online or offline, labelled honestly'))}<div class="note">Repair case studies and photographs are not published yet. They will be added from real jobs only, in the Problem, Investigation, Cause, Solution, Verification and Outcome format.</div>`)}
${block('Limits', 'What this page does not claim.', list('No formal hardware qualification is listed here.', 'Experience is from personal and independently maintained systems.', 'No certifications are claimed.'))}
${cta('Need a hand with<br>a build or a fault?', 'I am interested in IT support, PC assembly and technician roles.')}`,
},

{
  file: 'expertise/development/index.html', section: 'expertise', theme: 't-jae',
  title: 'Software Development & Infrastructure', desc: 'Architectural decisions, responsive frontend, API integration, testing and Cloudflare deployment, with links to the projects that show them.',
  crumbs: [['Expertise', 'expertise/'], ['Software development']],
  body: `${hero('Expertise · Software, security and infrastructure', 'Software <span class="c">&amp; infrastructure.</span>', 'Frontend, Node.js, APIs and desktop software, deployed on Cloudflare. The emphasis is on decisions and problem-solving, not a list of everything I have touched.', `<div class="actions"><a class="btn primary" href="{up}projects/">See the projects <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/rig-api/">Rig API case study</a></div>`)}
${facts(['Languages shipped', 'JavaScript, C#, Python, HTML, CSS'], ['Platform', 'Cloudflare Workers'], ['Evidence', 'Project pages'], ['Ratings', 'None, by design'])}
${block('Method', 'How I make decisions.', `<ol class="steps-list"><li><strong>Start from the constraint.</strong> For example, a home PC that must not open inbound ports.</li><li><strong>Choose the simplest tool that fits.</strong> This site is generated static HTML with a small Worker because that suits a portfolio. I do not claim avoiding frameworks is better in general.</li><li><strong>Test where it can fail.</strong> Not only where it is easy to test.</li><li><strong>Document what is real.</strong> Status labels, a changelog and stated limits.</li></ol>`)}
${block('Problem-solving', 'Examples from the code.', list(`<strong>A bug found by testing.</strong> The Rig API embed was blocked by the browser on other websites. I reproduced it on a second origin and added an opt-in CORS setting with tests. ${a('projects/rig-api/', 'Rig API case study')}.`, `<strong>Stale data presented as live.</strong> The live panel separates online, offline and unavailable, and shows last-known specs as such. ${a('projects/rig-api/#live', 'Live panel')}.`, `<strong>Over-claiming.</strong> Project pages mark features as built, partial or planned instead of implying everything works. ${a('projects/story-ai/', 'YouTube AI Story')}.`))}
${block('Frontend', 'Responsive and accessible.', `<p>Hand-written CSS and JavaScript, checked at 320px and 1280px with automated accessibility testing (axe-core) and no horizontal overflow. This is a target of WCAG 2.2 AA, not a claim of compliance: screen readers, browser zoom and Lighthouse are not yet tested. See the ${a('changelog/', 'changelog')}.</p>`)}
${block('APIs', 'API integration.', `<p>Cloudflare Workers with Durable Objects for state, an authenticated update endpoint, a public read endpoint with caching, a rate-limited contact form and a C# client. Details are in the ${a('projects/rig-api/', 'Rig API case study')}.</p>`)}
${block('Testing', 'Testing and maintenance.', list('A Worker test script covers authentication, validation, rate limiting, offline behaviour and CORS.', 'A site check enforces unique titles, one h1 per page, image alt text and no broken links.', 'Continuous integration regenerates the pages and fails if the committed output differs.', 'A dated changelog records changes and limits.', 'Not yet covered: browser end-to-end tests and unit tests for the client scripts.'))}
${block('Deployment', 'Deployment workflow.', `<p>Source in Git, pages generated and checked locally, then deployed to Cloudflare with Wrangler. The ${a('projects/grey-signal/build/', 'Grey Signal build page')} documents the self-hosted alternative.</p>`)}
${block('Security and infrastructure', 'Privacy, security and safe configuration.', `${list('Cloudflare deployment: Workers, Durable Objects, static assets and security headers including a strict Content Security Policy.', `A written ${a('projects/rig-api/#security', 'security review')} of the Rig API that lists weaknesses as well as controls.`, `Privacy-focused software is a direction of the ${a('projects/svart-security/', 'Svart Security')} project, whose pages label what is built and what is planned.`)}<p class="fine">Nothing here has been independently audited.</p>`, 'security-infrastructure')}
${block('Languages', 'What I have shipped in.', `<div class="chips"><span>JavaScript / Node.js</span><span>C#</span><span>Python</span><span>HTML and CSS</span></div><p class="fine">Tauri shells use the Rust toolchain, but Rust is not a language I claim as a strength.</p>`)}
${cta('Have a project<br>in mind?', 'Open to conversations about relevant development work.')}`,
},
];
