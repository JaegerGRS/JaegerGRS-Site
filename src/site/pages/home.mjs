import { SITE, GREY, SVART, JTT, LI, XJ, FB } from '../config.mjs';
import { ext, int, links, sectionHead, cta } from '../components.mjs';

export default [
{
  file: 'index.html', section: 'home',
  title: 'Jaeger Stratton | IT Technician, PC Hardware & Developer',
  desc: 'Explore Jaeger Stratton’s IT portfolio, featuring PC building, Windows troubleshooting, software development and privacy-focused projects. Open to international opportunities.',
  schema: `\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","@id":"${SITE}/#person","name":"Jaeger George Richard Stratton","alternateName":"Jaeger Stratton","url":"${SITE}/","description":"UK-based IT technician, PC builder and independent developer.","jobTitle":"IT Technician and Independent Developer","knowsAbout":["PC building","Hardware troubleshooting","Windows installation","Web development","Technical support"],"sameAs":["${FB}","${LI}","${XJ}","${SVART}","${JTT}"]}</script>`,
  body: `
<section class="container hero">
<div><p class="eyebrow">IT technician · PC hardware · Software development</p>
<h1>Hi, I'm Jaeger Stratton.<br><span class="gradient">I build systems, solve problems and develop software.</span></h1>
<p class="lead">I'm a hands-on IT enthusiast and independent developer with experience in PC assembly, Windows troubleshooting and building practical software. My work spans custom computer systems, self-hosted services, websites and privacy-focused applications.</p>
<div class="actions"><a class="btn primary" href="{up}projects/">Explore my work</a><a class="btn secondary" href="{up}contact/">Get in touch</a></div>
<p class="avail"><span class="status-dot"></span>Based in the United Kingdom · Open to remote, hybrid and international IT opportunities</p>
<div class="hero-stats"><span><b>2016</b><small>PC building since</small></span><span><b>2013</b><small>Interested in IT since</small></span><span><b>7</b><small>Independent projects</small></span></div></div>
<div class="terminal" role="group" aria-label="Profile summary"><div class="terminal-bar"><i></i><i></i><i></i><span>profile</span></div>
<div class="terminal-body"><div class="d">Focus</div><div class="o">Hardware, Windows support, web</div><div class="d">Experience</div><div class="o">Self-taught, independent projects</div><div class="d">Looking for</div><div class="o">IT technician, PC assembly, support</div><div class="d">Open to</div><div class="o">Remote, hybrid, international</div></div></div>
</section>

<section class="section container">
${sectionHead('Expertise', 'What I can do.', 'Practical skills, each backed by a project you can read about.')}
<div class="grid g3">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><span class="icon">▣</span><h3>Hardware &amp; Windows</h3><p>Choosing components, building PCs, installing and configuring Windows, cooling, and tracking down faults methodically.</p><span class="go">Hardware expertise →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><span class="icon">⌘</span><h3>Web &amp; software</h3><p>Responsive websites, Node.js tools, desktop apps with Tauri and Cloudflare hosting, built without heavy frameworks.</p><span class="go">Development expertise →</span></a>
<a class="card t-svart reveal" href="{up}projects/svart-security/"><span class="icon">⛨</span><h3>Privacy-minded software</h3><p>Tools designed around keeping data on the device. Svart Security is still in development.</p><span class="go">See Svart Security →</span></a>
</div></section>

<section class="section muted"><div class="container">
${sectionHead('Featured projects', 'Selected technical work.', 'Ordered by how directly they show IT and engineering skills. Statuses follow the key on the projects page.')}
<div class="grid g3">
<a class="card t-hw reveal" href="{up}projects/hardware/"><div class="card-top"><span class="tag">Active</span></div><h3>PC hardware &amp; diagnostics</h3><p class="meta">Category: Hardware · Role: builder and troubleshooter</p><p>Assembly, upgrades, Windows setup and methodical fault-finding, since 2016.</p><div class="chips"><span>Assembly</span><span>Windows</span><span>Diagnostics</span></div><span class="go">Case study →</span></a>
<a class="card t-rig reveal" href="{up}projects/rig-api/"><div class="card-top"><span class="tag">Released</span></div><h3>Rig API</h3><p class="meta">Category: Systems · Role: designed and built it</p><p>Live PC specs and load for a website, from a tray app through a Cloudflare Worker to an embeddable panel.</p><div class="chips"><span>C#</span><span>Cloudflare Workers</span><span>Durable Objects</span></div><span class="go">Case study →</span></a>
<a class="card t-svart reveal" href="{up}projects/svart-security/"><div class="card-top"><span class="tag">In development</span></div><h3>Svart Security</h3><p class="meta">Category: Privacy · Role: solo developer</p><p>A planned set of privacy tools. The website is live; the tools are at different stages.</p><div class="chips"><span>10 tools planned</span></div><span class="go">Case study →</span></a>
<a class="card t-ae reveal" href="{up}projects/jae/"><div class="card-top"><span class="tag">Prototype</span></div><h3>JAE</h3><p class="meta">Category: AI · Role: developer</p><p>A local-first desktop AI app made with Tauri. Source is on GitHub.</p><div class="chips"><span>Tauri</span><span>Local AI</span><span>MSI workflow</span></div><span class="go">Case study →</span></a>
<a class="card t-grey reveal" href="{up}projects/grey-signal/"><div class="card-top"><span class="tag">Active</span></div><h3>Grey Signal</h3><p class="meta">Category: Website &amp; infrastructure · Role: built the site, app and rig page</p><p>The self-hosted website, Windows app and live rig page behind a gaming content channel.</p><div class="chips"><span>C#</span><span>Node</span><span>Live telemetry</span></div><span class="go">Case study →</span></a>
</div>
<p class="fine"><a class="text-link inline" href="{up}projects/">See the full directory, including JaeTheTech and YouTube AI Story →</a></p>
</div></section>

<section class="section container">
${sectionHead('Evidence', 'Where to check the work.', 'Things you can open and test rather than take my word for.')}
${links(ext('https://github.com/JaegerGRS/JAE', 'JAE source', 'Code, CI workflows and MSI build on GitHub'), ext('https://github.com/JaegerGRS', 'GitHub profile', 'Repositories'), int('projects/rig-api/', 'Live specs panel', 'The Rig API running on this site'), int('changelog/', 'Changelog', 'How this site has changed, release by release'))}
<p class="fine">This site is generated static pages plus a Cloudflare Worker, with automated checks for links, page structure, security headers and the API.</p></section>

<section class="section muted"><div class="container"><div class="feature">
<div><p class="kicker">Background</p><h2 class="title">Learn by building.<br>Improve by testing.</h2><p class="lead lead-sm mt-icon">I started with PC builds and tutorials, then taught myself to diagnose faults, work with Windows and systems, and write code. My experience comes from independent study and self-directed projects, not formal employment.</p><div class="actions"><a class="btn secondary" href="{up}about/">Read my story</a><a class="btn secondary" href="{up}about/journey/">Timeline</a></div></div>
<dl class="facts-list"><div><dt>Interested in IT</dt><dd>Since around 2013</dd></div><div><dt>Building PCs</dt><dd>Since 2016</dd></div><div><dt>Learning route</dt><dd>Self-taught, project-based</dd></div><div><dt>Based</dt><dd>United Kingdom</dd></div></dl>
</div></div></section>

${cta('Have a role or project<br>in mind?', "I'm open to IT technician, PC assembly and technical support roles, ideally remote or hybrid, and relevant development projects.")}`,
},
];