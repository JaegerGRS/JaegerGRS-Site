import { SVART } from '../config.mjs';
import { ext, int, links, sectionHead, hero, back, backTo, more, facts } from '../components.mjs';

const tool = (icon, name, cat, status, cls, desc) =>
  `<div class="card reveal"><div class="card-top"><span class="icon">${icon}</span><span class="tag ${cls}">${status}</span></div><h3 class="h3s">${name}</h3><p>${desc}</p><span class="num">${cat}</span></div>`;

export default [
{
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
<div class="note">The website is live; the tools are in active development and features may change before launch. Status labels on the tools page mirror svartsecurity.org.</div></div></div></section>
${more('The toolkit.', int('projects/svart-security/tools/', 'The ten tools', 'Browser, AI, passwords, notes, chat, email and more'))}
<section class="section container">${sectionHead('Explore the site', 'Jump straight in.')}
${links(ext(SVART, 'Home', 'svartsecurity.org'), ext(SVART + '/tools', 'Tools', 'Full toolkit'), ext(SVART + '/roadmap', 'Roadmap', 'What ships when'), ext(SVART + '/pricing', 'Pricing', 'Plans'), ext(SVART + '/about', 'About', 'Who builds it'), ext('https://x.com/SvartSecurity', 'Svart on X', '@SvartSecurity'))}</section>
${back}`,
},
{
  file: 'projects/svart-security/tools/index.html', section: 'projects', theme: 't-svart',
  title: 'Svart Security tools', desc: 'The ten Svart Security privacy tools: browser, AI, passwords, notes, docs, chat, email, file encryption, privacy checker and VPN, with their current status.',
  crumbs: [['Projects', 'projects/'], ['Svart Security', 'projects/svart-security/'], ['Tools']],
  body: `${hero('Svart Security · Toolkit', 'Ten tools, <span class="c">one principle.</span>', 'Planned and in-progress tools from the Svart roadmap. Status labels mirror svartsecurity.org and may change before launch.', `<div class="actions"><a class="btn primary" href="${SVART}/tools" target="_blank" rel="noopener noreferrer">Full toolkit on svartsecurity.org <span aria-hidden="true">↗</span></a></div>`)}
<section class="section container"><div class="grid g3">
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
</div></section>
${backTo('projects/svart-security/', 'Svart Security')}`,
},
];
