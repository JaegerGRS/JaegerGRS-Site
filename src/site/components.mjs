// Shared HTML building blocks and the page shell (header, footer, SEO tags).
import { SITE, VERSION, SVART, JTT, GREY, LI, XJ, FB, NAV } from './config.mjs';

export const ext = (href, label, sub) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="ar">↗</span></a>`;
export const int = (href, label, sub) =>
  `<a href="{up}${href}"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="ar">→</span></a>`;
export const links = (...items) => `<div class="link-row">${items.join('')}</div>`;
export const sectionHead = (kicker, title, p = '') =>
  `<div class="section-heading"><div><p class="kicker">${kicker}</p><h2 class="title">${title}</h2></div>${p ? `<p>${p}</p>` : ''}</div>`;

export function page({ file, title, desc, section, theme = '', body, crumbs = [], schema = '' }) {
  const depth = file.split('/').length - 1;
  const up = '../'.repeat(depth);
  const urlPath = file.replace(/index\.html$/, '');
  const nav = NAV.map(([k, label, href]) =>
    `<a href="${up}${href || 'index.html'}"${section === k ? ' aria-current="page"' : ''}>${label}</a>`).join('') +
    `<a class="nav-contact" href="${up}contact/"${section === 'contact' ? ' aria-current="page"' : ''}>Contact <span aria-hidden="true">↗</span></a>`;
  const crumbHtml = crumbs.length
    ? `<div class="container crumb-wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${up}index.html">Home</a>${crumbs.map(([l, h]) => `<span>/</span>${h ? `<a href="${up}${h}">${l}</a>` : l}`).join('')}</nav></div>`
    : '';
  const fullTitle = file === 'index.html' ? title : `${title} | Jaeger Stratton`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0a0e13">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<meta name="author" content="Jaeger George Richard Stratton">
<link rel="canonical" href="${SITE}/${urlPath}">
<meta property="og:type" content="website"><meta property="og:title" content="${fullTitle}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${SITE}/${urlPath}"><meta property="og:image" content="${SITE}/assets/img/grey-signal-welcome.jpg">
<link rel="icon" href="${up}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Manrope:wght@500;700;800&display=swap">
<link rel="stylesheet" href="${up}assets/styles.css">${schema}
</head>
<body class="${theme}">
<a class="skip" href="#main">Skip to main content</a>
<header class="topbar"><div class="container nav"><a class="wordmark" href="${up}index.html" aria-label="Jaeger Stratton home"><span class="mark">J<span class="accent">.</span></span><span>JAEGER<span class="soft">GRS</span></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">Menu <span aria-hidden="true">☰</span></button><nav id="site-nav" aria-label="Main navigation">${nav}</nav></div></header>
<main id="main">
${crumbHtml}${body.replace(/\{up\}/g, up)}
</main>
<footer class="footer"><div class="container">
<div class="footer-grid">
<div><a class="wordmark" href="${up}index.html"><span class="mark">J<span class="accent">.</span></span><span>JAEGER<span class="soft">GRS</span></span></a><p>Independent technical work: PCs, systems, web and privacy-focused software. Peterborough, UK.</p></div>
<div><h4>Explore</h4><a href="${up}projects/">Projects</a><a href="${up}expertise/">Expertise</a><a href="${up}about/">About</a><a href="${up}contact/">Contact</a></div>
<div><h4>Live sites</h4><a href="${SVART}" target="_blank" rel="noopener noreferrer">Svart Security ↗</a><a href="${JTT}" target="_blank" rel="noopener noreferrer">JaeTheTech ↗</a><a href="${GREY}" target="_blank" rel="noopener noreferrer">Grey Signal ↗</a><a href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">JAE on GitHub ↗</a></div>
<div><h4>Elsewhere</h4><a href="${LI}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="${XJ}" target="_blank" rel="noopener noreferrer">X</a><a href="${FB}" target="_blank" rel="noopener noreferrer">Facebook</a><a href="${up}changelog/">Changelog</a></div>
</div>
<div class="footer-bottom"><small>© <span id="year">2026</span> Jaeger George Richard Stratton</small><small>v${VERSION}</small></div>
</div></footer>
<script src="${up}assets/main.js" defer></script>
</body></html>
`;
}

export const hero = (eyebrow, h1, lead, extra = '') =>
  `<section class="page-hero"><div class="container"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lead">${lead}</p>${extra}</div></section>`;

export const cta = (h, p) => `<section class="section tight"><div class="container"><div class="cta reveal"><p class="kicker">Get in touch</p><h2>${h}</h2><p>${p}</p><div class="actions"><a class="btn primary" href="{up}contact/">Contact me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/">Browse projects</a></div></div></div></section>`;

export const back = `<section class="section tight container"><a class="text-link" href="{up}projects/">← All projects</a></section>`;
export const facts = (...pairs) => `<section class="section container"><dl class="facts reveal">${pairs.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl></section>`;
export const img = (src, alt, w, h, cls = '') => `<img class="${cls}" src="{up}assets/img/${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
export const fourCards = (t, items) => `<section class="section container"><div class="grid g4">${items.map(([i, k, h, p], n) => `<div class="card reveal"><span class="icon">${i}</span><span class="num mt-icon">0${n + 1} / ${k}</span><h3 class="h3s">${h}</h3><p>${p}</p></div>`).join('')}</div></section>`;
