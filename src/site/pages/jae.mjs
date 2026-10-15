import { ext, int, links, hero, back, backTo, facts, faq, steps } from '../components.mjs';

export default [
{
  file: 'projects/jae/index.html', section: 'projects', theme: 't-ae',
  title: 'JAE: Jaeger Adaptive Engine', desc: 'JAE (Jaeger Adaptive Engine): a private, local-first AI desktop app built with Tauri, with MSI builds and GitHub-based updates.',
  crumbs: [['Projects', 'projects/'], ['JAE']],
  body: `${hero('Project · Local-first AI · 2026', 'J<span class="c">A</span>E.', 'The Jaeger Adaptive Engine: a private, local-first AI desktop app built with Tauri. Local inference and local data by default.', `<div class="actions"><a class="btn primary" href="https://github.com/JaegerGRS/JAE" target="_blank" rel="noopener noreferrer">View JAE on GitHub <span aria-hidden="true">↗</span></a></div>`)}
${facts(['Platform', 'Windows 10 / 11'], ['Shell', 'Tauri'], ['Backend', 'Python 3.12+'], ['Data', 'Local by default'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Focus</p><h2 class="title">What it's built around.</h2></div>
<div><ul class="ticks"><li><span>Native Windows desktop delivery through Tauri and MSI installers.</span></li><li><span>Local inference and local data: runtime data is never used as a cloud inference backend.</span></li><li><span>GitHub as the source, release and update pipeline.</span></li><li><span>A native-first design: frontend plus a local backend process managed by the Tauri runtime.</span></li></ul></div></div></section>
<section class="section container">${links(ext('https://github.com/JaegerGRS/JAE', 'JAE repository', 'Source, workflows, scripts'), int('projects/jae/engineering/', 'Engineering', 'CI, MSI releases and scripted setup'), int('projects/jaethetech/personal-ai/', 'Personal AI', 'Related project on JaeTheTech'))}</section>
${back}`,
},
{
  file: 'projects/jae/engineering/index.html', section: 'projects', theme: 't-ae',
  title: 'JAE engineering', desc: 'How JAE is delivered: CI validation with an hourly health check, Tauri MSI release builds and scripted install, dev, run, build and clean workflows.',
  crumbs: [['Projects', 'projects/'], ['JAE', 'projects/jae/'], ['Engineering']],
  body: `${hero('JAE · Engineering', 'Validated <span class="c">delivery.</span>', 'The repository ships its own tooling, so every change is checked and every release is repeatable.')}
<section class="section container"><div class="grid g3">
<div class="card reveal"><h3 class="h3s">CI validation</h3><p>Workflows validate each change, with an hourly health check.</p></div>
<div class="card reveal"><h3 class="h3s">MSI releases</h3><p>A Windows MSI build workflow produces installers through Tauri.</p></div>
<div class="card reveal"><h3 class="h3s">Scripted setup</h3><p>Install, dev, run, build and clean scripts keep the workflow repeatable.</p></div>
</div></section>
${steps('Pipeline', 'From change to installer.', 'A change is pushed to the GitHub repository.', 'CI validates it, and an hourly health check keeps watching.', 'The Windows MSI workflow builds an installer through Tauri.', 'Scripted install, dev, run, build and clean commands make every run repeatable.')}
${faq('Engineering questions.', ['Does JAE need the cloud?', 'No. Local inference and local data are the default, and runtime data is never used as a cloud inference backend.'], ['What does it run on?', 'Windows 10 and 11, with a Tauri shell and a local Python 3.12+ backend process managed by the Tauri runtime.'])}
<section class="section container pt0">${links(ext('https://github.com/JaegerGRS/JAE', 'JAE repository', 'Source, workflows, scripts'), int('projects/jaethetech/personal-ai/', 'Personal AI', 'The related assistant on JaeTheTech'))}</section>
${backTo('projects/jae/', 'JAE')}`,
},
];
