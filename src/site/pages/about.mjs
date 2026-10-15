import { SVART, JTT, LI, XJ, FB } from '../config.mjs';
import { ext, int, links, sectionHead, hero, cta } from '../components.mjs';

export default [
{
  file: 'about/index.html', section: 'about',
  title: 'About', desc: 'About Jaeger Stratton: a UK-based, self-directed PC builder, troubleshooter and developer with independent projects since 2016, open to remote, hybrid and international opportunities.',
  crumbs: [['About']],
  body: `${hero('About me', 'Learn by building.<br><span class="gradient">Improve by testing.</span>', "I'm Jaeger Stratton, based in the UK and interested in roles and projects internationally, with a hands-on background in PCs, systems and web development.", `<div class="actions"><a class="btn primary" href="{up}contact/">Get in touch <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}about/journey/">My journey</a></div>`)}
<section class="section container"><div class="two"><div class="prose"><p>Technology has been a long-running interest. I was introduced to it in 2013, built my first websites in school in 2014 and ran a YouTube channel on the side. By 2016 I had my own PC and was building computers.</p><p>I started out following tutorials, then learned to diagnose faults, compare components and work through problems myself. Learning by doing is how I developed troubleshooting, documentation, persistence and technical judgement: I test a change, record what happened and keep what works.</p><p>That interest grew into websites and applications. I now build and maintain independent projects: privacy tools with Svart Security, a gaming channel and self-hosted site with Grey Signal, and developer work through JaeTheTech and JAE.</p><p>This is independent work, and I do not claim formal employment or qualifications that I do not have. What I can show is the work itself, linked from this site. I'm interested in IT support, PC assembly and technician roles and in development work, ideally remote or hybrid, in the UK or internationally.</p><a class="text-link" href="${LI}" target="_blank" rel="noopener noreferrer">Professional profile ↗</a></div>
<h2 class="sr-only">Timeline</h2><div class="timeline"><div><b>2013</b><h3>Early interest</h3><p>Introduced to technology and started learning how it works.</p></div><div><b>2014</b><h3>First websites</h3><p>Built sites in school, with YouTube on the side.</p></div><div><b>2015</b><h3>Researching more</h3><p>Went deeper into hardware, software and how things work.</p></div><div><b>2016</b><h3>First PC, first builds</h3><p>Got my own PC and started building computers, then learned to diagnose and upgrade independently.</p></div><div><b>2016 onwards</b><h3>Windows &amp; systems</h3><p>Installations, configuration, cooling and performance testing.</p></div><div><b>2026</b><h3>Independent projects</h3><p>Svart Security, Grey Signal, JaeTheTech and JAE.</p></div><div><b>Now</b><h3>Open to remote &amp; hybrid work</h3><p>IT technician, PC assembly, technical support and development roles, in the UK or internationally.</p></div></div></div></section>

<section class="section container">${sectionHead('Working style', 'How I like to work.', 'Professional preferences, in the order they usually matter.')}
<div class="grid g4">
<div class="card reveal"><h3>Written communication</h3><p>I work well from written briefs and replies, and I keep written notes of what I change and why.</p></div>
<div class="card reveal"><h3>Defined tasks</h3><p>Clear scope and acceptance criteria let me work independently and report back precisely.</p></div>
<div class="card reveal"><h3>Structured documentation</h3><p>Changelogs, status labels and stated limits, as on the <a class="text-link inline" href="{up}projects/rig-api/">Rig API case study</a>.</p></div>
<div class="card reveal"><h3>Flexible working</h3><p>Remote or hybrid suits me well, in the UK or internationally.</p></div>
</div></section>

<section class="section muted"><div class="container">${sectionHead('Working with me', 'How I work best.', 'Being open about this helps us both get it right from the start.')}
<div class="grid g3">
<div class="card reveal"><span class="icon">◎</span><h3>Autism</h3><p>I'm autistic. It's part of why I focus deeply, notice small details, and like clear, written, well-defined tasks.</p></div>
<div class="card reveal"><span class="icon">☾</span><h3>Depression</h3><p>I live with diagnosed depression. I manage it well, and I do my best work with flexibility, honest communication and a steady rhythm.</p></div>
<div class="card reveal"><span class="icon">⌂</span><h3>Remote or hybrid</h3><p>I've never done well in classroom-style environments, which is why I'm looking for hybrid or remote work where I can learn by doing.</p></div>
</div>
<p class="fine">I've been diagnosed with both. I share this because I'd rather be upfront than have it be a surprise. It hasn't stopped me building real things: everything on this site is evidence of that.</p></div></section>

<section class="section container">${sectionHead('CV and education', 'Qualifications and CV.', 'Only verified information will be published here.')}
<div class="note"><strong>CV:</strong> a downloadable CV will be added here when I supply it. <strong>Qualifications and education:</strong> none are listed yet. I will add them from verified documents and will not list anything I cannot evidence. In the meantime, the <a class="text-link inline" href="{up}expertise/">expertise pages</a> link to the work itself.</div></section>

<section class="section muted"><div class="container">${sectionHead('Skills', 'What I can do for you.')}
<div class="grid g3">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><span class="icon">▣</span><h3>Hardware &amp; Windows</h3><p>PC builds, upgrades, drivers, cooling, diagnostics and clean Windows setups.</p><span class="go">Details →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><span class="icon">⌘</span><h3>Web &amp; software</h3><p>HTML, CSS, JavaScript, Node.js, C#, Python and Cloudflare hosting.</p><span class="go">Details →</span></a>
<a class="card t-svart reveal" href="{up}projects/svart-security/"><span class="icon">⛨</span><h3>Privacy &amp; security</h3><p>Encryption-first design and tools that keep data on your own device.</p><span class="go">Svart Security →</span></a>
</div></div></section>

<section class="section container">${sectionHead('My work', 'Projects I run.', 'Real sites and repositories you can open.')}
${links(int('projects/svart-security/', 'Svart Security', 'Privacy tools'), int('projects/grey-signal/', 'Grey Signal', 'Gaming channel and site'), int('projects/jaethetech/', 'JaeTheTech', 'Code, machines, security'), int('projects/jae/', 'JAE', 'Local-first AI app'), int('projects/hardware/', 'PC hardware', 'Builds and diagnostics'))}</section>

<section class="section muted"><div class="container">${sectionHead('Find me', 'Elsewhere online.')}
${links(ext(LI, 'LinkedIn', 'Professional profile'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'), ext(JTT, 'JaeTheTech', 'jaethetech.com'), ext(SVART, 'Svart Security', 'svartsecurity.org'))}</div></section>
${cta("Let's work<br>on something.", 'Open to conversations about roles and relevant projects.')}`,
},

{
  file: 'about/journey/index.html', section: 'about',
  title: 'My Journey', desc: 'A practical technical journey from PC hardware experimentation into software, security and independent projects.',
  crumbs: [['About', 'about/'], ['My journey']],
  body: `${hero('Background · Timeline', 'The path <span class="gradient">so far.</span>', 'A practical technical journey, from hardware experimentation into software, security and independent projects.')}
<section class="section container"><h2 class="sr-only">Timeline</h2><div class="timeline">
<div><b>2013 · Early interest</b><h3>Introduced to tech</h3><p>My first real introduction to technology, and the start of a long-running interest in IT.</p></div>
<div><b>2014 · First websites</b><h3>Building websites</h3><p>Started building sites in school, and began making YouTube videos on the side.</p></div>
<div><b>2015 · Early interest</b><h3>Researching more and more</h3><p>Spent more time every year reading, testing and learning how hardware, software and networks fit together.</p></div>
<div><b>2016 · First independent builds</b><h3>My own PC</h3><p>Got my own PC and started building computers: assembly, upgrades, operating systems and fault-finding. Experience was built through repeated hands-on work, not a formal employer.</p></div>
<div><b>2016 onwards · Systems experience</b><h3>From components to code</h3><p>Explored websites, scripting, networking, systems and security, and how hardware choices and software behaviour affect one another.</p></div>
<div><b>2026 · Independent development</b><h3>Independent projects take shape</h3><p>Built the Svart Security website and toolkit plans, grew JaeTheTech, created Grey Signal's online identity and rig monitoring, and started JAE.</p></div>
<div><b>Present and next · Capabilities</b><h3>Keep shipping. Keep learning.</h3><p>Document practical outcomes, improve the projects and find remote or hybrid technical work in the UK and internationally. As an autistic person with depression who has never thrived in classrooms, I do my best work in flexible, self-directed settings.</p></div>
</div></section>
${cta('Have a problem<br>that needs solving?', "I'm interested in practical IT work, PC assembly, troubleshooting and thoughtful development projects.")}`,
},
];
