import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
  file: '404.html', section: '', title: 'Page not found', desc: 'This page could not be found.',
  body: `${hero('Error 404', 'Signal <span class="gradient">lost.</span>', "That page doesn't exist or has moved.", `<div class="actions"><a class="btn primary" href="/">Back home</a><a class="btn secondary" href="/projects/">Projects</a></div>`)}`,
},
];
