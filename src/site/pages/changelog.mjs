import { VERSION } from '../config.mjs';
import { hero } from '../components.mjs';

export default [
{
  file: 'changelog/index.html', section: '',
  title: 'Changelog', desc: 'Version history and release notes for jaegergrs.com.',
  crumbs: [['Changelog']],
  body: `${hero('Release history', 'Changelog<span class="accent">.</span>', 'A public log of what changed and when. Versions represent actual releases, not a backdated history.')}
<section class="section container">
<div class="release reveal"><div><span class="version">v${VERSION}</span><span class="release-date">15 OCT 2026</span></div><div><h2>Redesign, real assets and standalone sites</h2><ul><li>New visual design with per-project accent colours, cards, breadcrumbs and reveal animations.</li><li>Added the real Grey Signal logo, banner and artwork, and direct links to every standalone site: Svart Security, Grey Signal, JaeTheTech and the JAE repository.</li><li>Added the Svart toolkit overview, the JaeTheTech Personal AI project and a JAE case study.</li><li>Worker now serves the whole site, including images, through Cloudflare static assets.</li><li>Live PC panel and secure contact form, both on the Worker with strict security headers and rate limiting.</li><li>JaegerRigAgent.exe: a 24 KB Windows tray app that pairs with the site using a key the site creates, starts with Windows and uses almost no CPU.</li><li>New Rig API product page with a one-line embed and pricing, made for small sites and servers only.</li><li>Works on phones, tablets, desktops and TVs; self-host mode for private testing.</li></ul><span class="tag">Feature release</span></div></div>
<div class="release reveal"><div><span class="version">v0.2.0</span><span class="release-date">14 OCT 2026</span></div><div><h2>Multi-page portfolio</h2><p>Split the portfolio into Projects, Expertise, About and Contact sections with project case studies.</p><span class="tag">Feature release</span></div></div>
<div class="release reveal"><div><span class="version">v0.1.0</span><span class="release-date">14 OCT 2026</span></div><div><h2>Portfolio foundation</h2><p>First site implementation with a dark responsive interface, project descriptions, professional links, metadata and accessibility foundations.</p><span class="tag">Initial build</span></div></div>
</section>`,
},
];
