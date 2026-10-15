import { hero, cta, fourCards } from '../components.mjs';

export default [
{
  file: 'expertise/index.html', section: 'expertise',
  title: 'Expertise', desc: 'Practical hardware, Windows, web and software skills from independent projects and hands-on practice.',
  crumbs: [['Expertise']],
  body: `${hero('Capabilities', 'Practical <span class="gradient">skill.</span>', 'I am most useful where systems, software and careful troubleshooting meet, grounded in independent projects and hands-on practice.')}
<section class="section container"><div class="grid g2">
<a class="card t-hw reveal" href="{up}expertise/hardware/"><div class="card-top"><span class="icon">▣</span><span class="num">01 / Hardware</span></div><h3>Systems &amp; hardware</h3><p>PC builds, component compatibility, cooling, installation, diagnostics and testing.</p><span class="go">Dive deeper →</span></a>
<a class="card t-jae reveal" href="{up}expertise/development/"><div class="card-top"><span class="icon">{ }</span><span class="num">02 / Development</span></div><h3>Code &amp; delivery</h3><p>Custom websites, frontend logic, JavaScript, Node, Tauri and Cloudflare deployment.</p><span class="go">Dive deeper →</span></a>
</div></section>
<section class="section muted"><div class="container"><div class="two"><div><p class="kicker">Approach</p><h2 class="title">Measure twice.<br>Change once.</h2></div>
<div class="timeline"><div><b>01</b><h3>Understand the constraint</h3><p>What is failing, what actually matters, and what can't be broken in the process?</p></div><div><b>02</b><h3>Make the smallest useful change</h3><p>Prefer clarity and maintainability over another layer of complexity.</p></div><div><b>03</b><h3>Verify it behaves</h3><p>Test the outcome, check what changed and document it for next time.</p></div></div></div></div></section>
${cta('Have a problem<br>that needs solving?', "I'm interested in practical IT work, PC assembly, troubleshooting and thoughtful development projects.")}`,
},


{
  file: 'expertise/hardware/index.html', section: 'expertise', theme: 't-hw',
  title: 'Hardware & Systems', desc: 'Computer assembly, troubleshooting and practical Windows support since 2015.',
  crumbs: [['Expertise', 'expertise/'], ['Hardware & systems']],
  body: `${hero('Capability · Field notes', 'Hardware &amp; <span class="c">systems.</span>', 'Computer assembly, troubleshooting and practical Windows support. I have worked on my own machines and related systems since 2015, with an eye on compatibility, cooling, stability and a systematic repair process.', `<div class="actions"><a class="btn primary" href="{up}projects/hardware/">PC hardware project <span aria-hidden="true">↗</span></a></div>`)}
${fourCards('hw', [['▣', 'Builds', 'Component selection', 'Selecting CPUs, graphics cards, memory, cooling and storage that match actual requirements.'], ['▤', 'Windows', 'System preparation', 'Installing and configuring Windows, drivers, peripherals and common software.'], ['⌁', 'Diagnostics', 'Root-cause troubleshooting', 'Working through hardware, stability, temperatures and performance issues repeatably.'], ['✓', 'Testing', 'Verification', 'Checking that a repair or upgrade actually improves the situation.']])}
${cta('Need a hand with<br>a build or a fault?', "I'm interested in IT support, PC assembly and technician roles.")}`,
},

{
  file: 'expertise/development/index.html', section: 'expertise', theme: 't-jae',
  title: 'Web & Software', desc: 'Lean interfaces, custom frontend development and Git-based Cloudflare deployment workflows.',
  crumbs: [['Expertise', 'expertise/'], ['Web & software']],
  body: `${hero('Capability · Field notes', 'Web &amp; <span class="c">software.</span>', 'Lean interfaces, custom frontend development and deployment workflows. I build independent sites and software experiments with HTML, CSS, JavaScript and supporting tools.', `<div class="actions"><a class="btn primary" href="{up}projects/">See the projects <span aria-hidden="true">↗</span></a></div>`)}
${fourCards('dev', [['◧', 'Frontend', 'Design systems', 'Accessible responsive layouts, typography, reusable components and clear visual hierarchy.'], ['⚡', 'Functionality', 'Interactive behaviour', 'Navigation, validation, dashboard UI, APIs and progressive enhancement.'], ['⬡', 'Platforms', 'Software experimentation', 'Node.js, Rust, Tauri, local AI and tools that run on personal hardware.'], ['☁', 'Deployment', 'Publish &amp; improve', 'Git version history, Cloudflare hosting, monitoring and an honest changelog.']])}
${cta('Have a project<br>in mind?', 'Open to conversations about relevant development work.')}`,
},
];
