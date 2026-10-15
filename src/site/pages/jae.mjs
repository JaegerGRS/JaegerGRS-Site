import { JTT } from '../config.mjs';
import { ext, links, sectionHead, hero, back, facts } from '../components.mjs';

export default [
{
  file: 'projects/jae/index.html', section: 'projects', theme: 't-hw',
  title: 'JAE: Jaeger Adaptive Engine', desc: 'JAE (Jaeger Adaptive Engine): a private, local-first AI desktop app built with Tauri, with MSI builds and GitHub-based updates.',
  crumbs: [['Projects', 'projects/'], ['JAE']],
  body: `${hero('Project · Local-first AI · 2026', 'J<span class="c">A</span>E.', 'The Jaeger Adaptive Engine: a private, local-first AI desktop app built with Tauri. Local inference and local data by default.', `<div class="actions"><a class="btn primary" href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">View JAE on GitHub <span aria-hidden="true">↗</span></a></div>`)}
${facts(['Platform', 'Windows 10 / 11'], ['Shell', 'Tauri'], ['Backend', 'Python 3.12+'], ['Data', 'Local by default'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Focus</p><h2 class="title">What it's built around.</h2></div>
<div><ul class="ticks"><li><span>Native Windows desktop delivery through Tauri and MSI installers.</span></li><li><span>Local inference and local data: runtime data is never used as a cloud inference backend.</span></li><li><span>GitHub as the source, release and update pipeline.</span></li><li><span>A native-first design: frontend plus a local backend process managed by the Tauri runtime.</span></li></ul></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Engineering', 'Validated delivery.', 'The repository ships its own tooling.')}
<div class="grid g3">
<div class="card reveal"><h3 class="h3s">CI validation</h3><p>Workflows validate each change, with an hourly health check.</p></div>
<div class="card reveal"><h3 class="h3s">MSI releases</h3><p>A Windows MSI build workflow produces installers through Tauri.</p></div>
<div class="card reveal"><h3 class="h3s">Scripted setup</h3><p>Install, dev, run, build and clean scripts keep the workflow repeatable.</p></div>
</div></div></section>
<section class="section container">${links(ext('https://github.com/JaegerGRS/JAE', 'JAE repository', 'Source, workflows, scripts'), ext(JTT + '/projects', 'Personal AI', 'Related project on JaeTheTech'))}</section>
${back}`,
},
];
