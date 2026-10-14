import { SITE, VERSION, DATE, GREY, SVART, JTT, YT, TWITCH, LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta, back, facts, img, fourCards } from '../components.mjs';

export default [
{
  file: 'about/index.html', section: 'about',
  title: 'About', desc: 'About Jaeger Stratton: self-taught PC builder and developer based in Peterborough, UK, open to opportunities worldwide.',
  crumbs: [['About']],
  body: `${hero('About', 'Learn by building.<br><span class="gradient">Improve by testing.</span>', "I'm Jaeger Stratton, based in Peterborough, UK, with a hands-on background in PCs, systems and web development.", `<div class="actions"><a class="btn primary" href="{up}about/journey/">My journey <span aria-hidden="true">↗</span></a></div>`)}
<section class="section container"><div class="two"><div class="prose"><p>I got into PC building in 2015. I started out following tutorials, then gradually learned how to diagnose faults, compare components and work through problems myself.</p><p>That interest grew into websites and applications. Today I develop and maintain independent projects including Svart Security, Grey Signal, JaeTheTech and JAE.</p><p>I'm interested in IT support, PC assembly and technician roles, and open to opportunities beyond the UK.</p><a class="text-link" href="${LI}" target="_blank" rel="noopener noreferrer">Professional profile ↗</a></div>
<div class="timeline"><div><b>2015</b><h3>First PC build</h3><p>Started with tutorials, then learned to diagnose and upgrade independently.</p></div><div><b>Since</b><h3>Windows &amp; systems</h3><p>Installations, configuration, cooling and performance testing.</p></div><div><b>2026</b><h3>Independent projects</h3><p>Svart Security, Grey Signal, JaeTheTech and JAE.</p></div><div><b>Now</b><h3>Open to opportunities</h3><p>IT technician, PC assembly and technical support roles.</p></div></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Find me', 'Elsewhere online.')}
${links(ext(LI, 'LinkedIn', 'Professional profile'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'), ext(JTT, 'JaeTheTech', 'jaethetech.com'), ext(SVART, 'Svart Security', 'svartsecurity.org'))}</div></section>
${cta("Let's work<br>on something.", 'Open to conversations about roles and relevant projects.')}`,
},

{
  file: 'about/journey/index.html', section: 'about',
  title: 'My Journey', desc: 'A practical technical journey from PC hardware experimentation into software, security and independent projects.',
  crumbs: [['About', 'about/'], ['My journey']],
  body: `${hero('Background · Timeline', 'The path <span class="gradient">so far.</span>', 'A practical technical journey, from hardware experimentation into software, security and independent projects.')}
<section class="section container"><div class="timeline">
<div><b>2015</b><h3>Learning with hardware</h3><p>Got started with PC assembly, upgrades, operating systems and fault-finding. Experience was built through repeated hands-on work, not a formal employer.</p></div>
<div><b>Later</b><h3>From components to code</h3><p>Explored websites, scripting, networking, systems and security, and how hardware choices and software behaviour affect one another.</p></div>
<div><b>2026</b><h3>Independent projects take shape</h3><p>Built the Svart Security website and toolkit plans, grew JaeTheTech, created Grey Signal's online identity and rig monitoring, and started JAE.</p></div>
<div><b>Next</b><h3>Keep shipping. Keep learning.</h3><p>Document practical outcomes, improve the projects and seek technical opportunities in the UK and internationally.</p></div>
</div></section>
${cta('Have a problem<br>that needs solving?', "I'm interested in practical IT work, PC assembly, troubleshooting and thoughtful development projects.")}`,
},
];
