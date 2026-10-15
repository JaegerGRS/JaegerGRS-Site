import { SVART } from '../config.mjs';
import { ext, int, links, sectionHead, hero, back, backTo, more, facts, faq } from '../components.mjs';

const tool = (icon, name, cat, status, cls, desc) =>
  `<div class="card reveal"><div class="card-top"><span class="icon">${icon}</span><span class="tag ${cls}">${status}</span></div><h3 class="h3s">${name}</h3><p>${desc}</p><p class="fine"><b>Evidence:</b> ${status === 'In development' ? 'listed as in development on svartsecurity.org. No release, screenshots or source are published yet.' : 'roadmap entry only. No work is published yet.'}</p><span class="num">${cat}</span></div>`;

export default [
{
  file: 'projects/svart-security/index.html', section: 'projects', theme: 't-svart',
  title: 'Svart Security', desc: 'Svart Security: an independent privacy-software project. A live website and roadmap, with ten tools in development or planned. Honest status and evidence.',
  crumbs: [['Projects', 'projects/'], ['Svart Security']],
  body: `${hero('Project · Privacy · 2026 — present', 'Svart <span class="c">Security.</span>', 'An independent project to build privacy-focused tools. The website is live; the tools are in development or planned.', `<div class="actions"><a class="btn primary" href="${SVART}" target="_blank" rel="noopener noreferrer">Visit svartsecurity.org <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${SVART}/tools" target="_blank" rel="noopener noreferrer">Browse the tools</a></div>`)}
${facts(['Website', 'Live'], ['Tools', 'In development · none released'], ['Role', 'Independent developer'], ['Focus', 'Privacy, encryption'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Purpose</p><h2 class="title">Privacy tools, built by one person.</h2></div>
<div><p>Svart Security is my independent project to design a family of privacy-focused tools, from a browser to a password vault, and to publish them with a website and roadmap. I am the sole developer and maintain the website.</p>
<p>It shows how I plan and structure a large piece of software. It is not yet evidence of shipped security software, and this page says so plainly.</p></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Current state', 'What exists, and what does not.', 'Based on what svartsecurity.org publishes today.')}
<div class="specs-cols">
<div><h3>Implemented and public</h3><ul class="ticks"><li><span>The website: static pages for About, Tools, Pricing, Roadmap and Contact.</span></li><li><span>A published roadmap, with the Svart Browser public release listed as the year-end milestone.</span></li></ul></div>
<div><h3>Not yet public</h3><ul class="ticks"><li><span>Any released tool, download or source code.</span></li><li><span>Interface screenshots, a threat model and test results. These will be added here when they exist.</span></li><li><span>An independent security audit. None has been carried out.</span></li></ul></div>
</div></div></section>
<section class="section container">${sectionHead('Approach', 'How I am building it.')}<div class="grid g3">
<div class="card reveal"><h3>Plan in the open</h3><p>A public roadmap and a status label for every tool, so progress can be checked.</p></div>
<div class="card reveal"><h3>One tool at a time</h3><p>The browser and AI assistant come first; the other eight tools are planned and not started publicly.</p></div>
<div class="card reveal"><h3>Claims follow evidence</h3><p>Security statements here are labelled as design goals until a tool ships and has been tested.</p></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Security design principles', 'Goals, not guarantees.', 'Each is the intended design. None is claimed as verified.')}
<div class="grid g3">
<div class="card reveal"><span class="tag">Design goal</span><h3>Encrypt on the device</h3><p>Data would be locked on your own device before it is stored or sent, so a server would hold only scrambled data. The plan uses a standard method called AES-256-GCM.</p></div>
<div class="card reveal"><span class="tag">Policy</span><h3>No tracking or ads</h3><p>The stated policy is no analytics, advertising or data collection. It is a promise, not an audited result.</p></div>
<div class="card reveal"><span class="tag">Design goal</span><h3>Self-hosting option</h3><p>The planned chat tool is meant to run on your own server, so you control where messages live.</p></div>
</div>
<div class="note"><b>Known limitations.</b> No tool is released, so none has been tested by users or audited by an independent party. Encryption, no-logs, end-to-end and zero-knowledge wording on svartsecurity.org describes plans. Treat it as intent until a tool is released with evidence.</div></div></section>
<section class="section container">${sectionHead('Evidence', 'Still to be published.')}<div class="gallery"><div class="ph"><strong>Screenshot needed</strong><span>Svart Browser or Svart AI interface</span></div><div class="ph"><strong>Document needed</strong><span>Threat-model summary</span></div><div class="ph"><strong>Document needed</strong><span>Encryption workflow</span></div><div class="ph"><strong>Document needed</strong><span>Testing methodology</span></div></div>
<p class="fine">These are labelled placeholders, not real material. I will not publish mock-ups as evidence.</p></section>
${more('The toolkit.', int('projects/svart-security/tools/', 'The ten tools', 'Each with its current, evidence-based state'))}
<section class="section container">${sectionHead('Explore the site', 'Jump straight in.')}
${links(ext(SVART, 'Home', 'svartsecurity.org'), ext(SVART + '/tools', 'Tools', 'Full toolkit'), ext(SVART + '/roadmap', 'Roadmap', 'What ships when'), ext(SVART + '/pricing', 'Pricing', 'Plans'), ext(SVART + '/about', 'About', 'Who builds it'), ext('https://x.com/SvartSecurity', 'Svart on X', '@SvartSecurity'))}</section>
${back}`,
},
{
  file: 'projects/svart-security/tools/index.html', section: 'projects', theme: 't-svart',
  title: 'Svart Security tools', desc: 'The ten Svart Security privacy tools: browser, AI, passwords, notes, docs, chat, email, file encryption, privacy checker and VPN, with their current status.',
  crumbs: [['Projects', 'projects/'], ['Svart Security', 'projects/svart-security/'], ['Tools']],
  body: `${hero('Svart Security · Toolkit', 'Ten tools, <span class="c">none released yet.</span>', 'Two tools are in development and eight are planned. None is released. Descriptions say what each is intended to do.', `<div class="actions"><a class="btn primary" href="${SVART}/tools" target="_blank" rel="noopener noreferrer">Full toolkit on svartsecurity.org <span aria-hidden="true">↗</span></a></div>`)}
<section class="section container"><h2 class="sr-only">The ten tools</h2><div class="grid g3">
${tool('🔒', 'Svart Browser', 'Web browsing', 'In development', '', 'Intended as a privacy browser with ad blocking and DNS privacy.')}
${tool('🤖', 'Svart AI', 'AI assistant', 'In development', '', 'Intended as an AI chat and document-analysis assistant. It needs an online connection.')}
${tool('🔑', 'SVART Passwords', 'Password security', 'Planned', '', 'Intended as an encrypted password vault with a generator and master password.')}
${tool('📝', 'SVART Notes', 'Notes', 'Planned', '', 'Intended as a note-taking app with encrypted local storage.')}
${tool('📄', 'SVART Docs', 'Documents', 'Planned', '', 'Intended as a rich-text document editor with encrypted storage.')}
${tool('💬', 'SVART Chat', 'Communication', 'Planned', '', 'Intended as a self-hosted encrypted chat. The cryptographic design is not yet published.')}
${tool('✉️', 'Secure Email', 'Communication', 'Planned', '', 'Intended as a private email service with temporary addresses.')}
${tool('🗂️', 'File Encryption', 'Security', 'Planned', '', 'Intended as a tool to encrypt and decrypt files.')}
${tool('🛡️', 'Privacy Checker', 'Privacy', 'Planned', '', 'Intended as a scanner that suggests privacy-setting fixes.')}
${tool('🌐', 'VPN Service', 'Privacy', 'Planned', '', 'Intended as a VPN service. Not built yet, and a no-logs policy cannot be claimed until it exists.')}
</div></section>
${faq('Tool questions.', ['What do the status labels mean?', 'In development means work has started (svartsecurity.org calls Svart AI Building now). Planned means a roadmap entry only. Nothing is released. See the status key on the Projects page.'], ['Is anything collected about me?', 'The stated policy is no tracking, ads or data collection. It is a promise, not an audited result, and no tool is released yet.'], ['How is data protected?', 'The intended design is to encrypt data on your device with AES-256-GCM, a widely used standard. This is a design goal and has not been tested or audited for any Svart tool.'])}
${backTo('projects/svart-security/', 'Svart Security')}`,
},
];
