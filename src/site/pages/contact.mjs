import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
  file: 'contact/index.html', section: 'contact',
  title: 'Contact', desc: 'Contact Jaeger Stratton about IT technician, PC assembly and technical support roles or development projects.',
  crumbs: [['Contact']],
  body: `${hero('Contact', 'Have an opportunity<br><span class="gradient">or project in mind?</span>', "I'm open to conversations about IT technician, PC assembly and technical support roles, and relevant development projects.", `<div class="actions"><a class="btn primary" href="${MAIL}">Email me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${LI}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>`)}
<section class="section container">${links(`<a href="${MAIL}"><span>Email<small>jaegergrstratton@gmail.com</small></span><span class="ar">↗</span></a>`, ext(LI, 'LinkedIn', '/in/jaegergrs'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'))}</section>`,
},
];
