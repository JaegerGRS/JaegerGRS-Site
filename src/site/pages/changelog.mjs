import { VERSION } from '../config.mjs';
import { hero } from '../components.mjs';

const REPO = 'https://github.com/JaegerGRS/JaegerGRS-Site/blob/main/CHANGELOG.md';

// Groups render only when they have entries, in a fixed order.
const ORDER = ['Features', 'Improvements', 'Fixes', 'Security', 'Documentation'];
const group = (name, items) => items && items.length
  ? `<h3 class="rel-cat"><span class="tag">${name}</span></h3><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : '';
const release = (version, iso, shown, title, summary, cats, kind) => `<article class="release reveal" aria-labelledby="r-${version.replace(/\./g, '-')}"><div><span class="version">v${version}</span><time class="release-date" datetime="${iso}">${shown}</time><span class="rel-kind">${kind}</span></div><div><h2 id="r-${version.replace(/\./g, '-')}">${title}</h2><p>${summary}</p>${ORDER.map(n => group(n, cats[n])).join('')}</div></article>`;

const v030 = release(VERSION, '2026-10-15', '15 October 2026', 'Portfolio repositioning, case studies and accessibility',
  'The site was reworked from a project showcase into an evidence-led IT portfolio. This is a summary; the full, more detailed log is <a class="text-link inline" href="' + REPO + '" target="_blank" rel="noopener noreferrer">CHANGELOG.md in the repository ↗</a>.', {
  Features: [
    'Rig API restructured as an engineering case study with an architecture diagram, a security review, real screenshots and a corrected install guide. The pricing page is secondary and unchanged in price.',
    'Expertise split into four areas with two matching pages, linking each skill to a real project instead of ratings.',
    'About and Journey pages with a dated timeline, working-style section and international wording.',
    'Hardware page: labelled photo placeholders and a case-study format. No repairs are published yet because none have been documented.',
    'Opt-in <code>RIG_EMBED_ORIGINS</code> setting (off by default) so a customer site on another domain can show the Rig API widget.',
  ],
  Improvements: [
    'Svart Security, JAE, JaeTheTech and Personal AI, YouTube AI Story and Grey Signal rewritten around what exists, with status labels (Released, Active, Prototype, In development, Planned).',
    'Contact page: new headline, recruitment-friendly wording and per-field error messages that keep what was typed.',
    'Changelog grouped by change type. The version number now appears here only, not in every page footer.',
    'Homepage and projects directory reordered and reworded.',
  ],
  Fixes: [
    'Contact form: the send button stayed disabled after a successful send.',
    'Grey Signal build page: removed an inflated file and line count that included generated files.',
    'Rig API: corrected memory, size and "for sale" labels, and a relative embed path that would not work on a customer site.',
    'Heading order and table scrolling regions fixed across pages.',
  ],
  Security: [
    'Contact page privacy notice now describes what the Worker really does (emailed, 24-hour hashed rate limiting, provider logs) instead of "nothing is stored".',
    'Rig API security review published, including known gaps.',
    'CORS for the Rig API read endpoint is restricted to listed origins and never applies to writes.',
  ],
  Documentation: [
    'Accessibility pass targeting WCAG 2.2 AA (compliance is not claimed until it is fully tested).',
    'Dated notes on what is verified, what needs the owner, and what is not claimed.',
  ],
}, 'Feature release');

const v020 = release('0.2.0', '2026-10-14', '14 October 2026', 'Multi-page portfolio',
  'Split the portfolio into Projects, Expertise, About and Contact sections with project case studies.', {
  Features: ['Project filtering, breadcrumbs, responsive navigation and a 404 page.', 'Case studies for Svart Security, JaeTheTech, Grey Signal and PC hardware.'],
  Improvements: ['Page-specific SEO metadata, social previews and an XML sitemap.'],
  Documentation: ['Route validation and Wrangler Worker deployment notes.'],
}, 'Feature release');

const v010 = release('0.1.0', '2026-10-14', '14 October 2026', 'Portfolio foundation',
  'First site implementation with a dark responsive interface, project descriptions, professional links, metadata and accessibility foundations.', {}, 'Initial build');

export default [
{
  file: 'changelog/index.html', section: '',
  title: 'Changelog', desc: 'Release history for jaegergrs.com: versions, real release dates and changes grouped as features, improvements, fixes, security and documentation.',
  crumbs: [['Changelog']],
  body: `${hero('Maintenance log', 'Changelog<span class="accent">.</span>', 'A public record of what changed and when. Dates are the real release dates, and nothing is backdated.')}
<section class="section container">
<p class="fine">Current version: v${VERSION}. Changes are grouped as Features, Improvements, Fixes, Security and Documentation.</p>
${v030}
${v020}
${v010}
</section>`,
},
];