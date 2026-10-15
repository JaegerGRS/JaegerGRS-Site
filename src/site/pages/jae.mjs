import { STATUS as S, REPOS } from '../facts.mjs';
import { ext, int, links, hero, back, backTo, facts, faq, sectionHead } from '../components.mjs';

export default [
{
  file: 'projects/jae/index.html', section: 'projects', theme: 't-ae',
  title: 'JAE: Jaeger Adaptive Engine', desc: 'JAE (Jaeger Adaptive Engine): a prototype local-first AI desktop app built with Tauri, a Python FastAPI backend and a React frontend. Source on GitHub; no release published yet.',
  crumbs: [['Projects', 'projects/'], ['JAE']],
  body: `${hero('Project · Local-first AI · 2026', 'J<span class="c">A</span>E.', 'A prototype desktop AI app that runs language models on your own PC. It is built with a Tauri shell, a Python backend and a React interface.', `<div class="actions"><a class="btn primary" href="${REPOS.jae}" target="_blank" rel="noopener noreferrer">View source on GitHub <span aria-hidden="true">↗</span></a><a class="btn secondary" href="{up}projects/jae/engineering/">Engineering and CI</a></div>`)}
${facts(['Status', `${S.jae} · no release yet`], ['Latest version', '0.2.3 (8 Sep 2026)'], ['Platform', 'Windows 10 / 11'], ['Role', 'Developer'])}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">What it is.</h2></div>
<div><p>JAE is a desktop app for chatting with AI models that run locally, so prompts are not sent to a cloud service. The README states that runtime data is local and is not used as a cloud inference backend.</p>
<p>It is a prototype. The code and automated checks exist on GitHub, but I have not published an installer or release, so you cannot download a finished app yet.</p></div></div></section>
<section class="section muted"><div class="container">${sectionHead('Current state', 'What the repository shows today.', 'From the source and changelog on GitHub, checked on 15 October 2026. I have not run a release build myself for this page.')}
<div class="specs-cols">
<div><h3>In the source code</h3><ul class="ticks"><li><span>A FastAPI backend with hardware detection, model selection by hardware tier, a model manifest, and health, system, models, settings and chat endpoints.</span></li><li><span>Streaming chat responses, and a llama.cpp inference provider.</span></li><li><span>A model download manager with a queue, progress, cancellation and checksum validation.</span></li><li><span>Encrypted, signed backups with create, verify and restore.</span></li><li><span>SQLite storage, and a React and TypeScript interface with 16 pages, including Chat, Models, System, Backup, Security and Settings.</span></li></ul></div>
<div><h3>Not yet shown or confirmed</h3><ul class="ticks"><li><span>A published release or installer. The GitHub releases page is empty.</span></li><li><span>Application screenshots. None are on this page yet.</span></li><li><span>That every interface page is complete. Some may be early scaffolding.</span></li><li><span>macOS or Linux support. The project targets Windows 10 and 11 only.</span></li></ul></div>
</div></div></section>
<section class="section container">${sectionHead('Architecture', 'How the parts fit together.')}
<figure class="media reveal"><svg viewBox="0 0 720 150" role="img" aria-labelledby="jae-arch-t jae-arch-d" width="720" height="150"><title id="jae-arch-t">JAE architecture</title><desc id="jae-arch-d">The Tauri desktop shell starts and manages a local Python FastAPI backend and hosts the React interface. The backend runs a llama.cpp model and stores data in local SQLite. Nothing leaves the PC by design.</desc>
<defs><marker id="jaa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8c97a4"/></marker></defs>
<g fill="#131b25" stroke="#263140"><rect x="10" y="40" width="150" height="70" rx="6"/><rect x="190" y="40" width="150" height="70" rx="6"/><rect x="370" y="40" width="150" height="70" rx="6"/><rect x="550" y="10" width="160" height="60" rx="6"/><rect x="550" y="85" width="160" height="60" rx="6"/></g>
<g fill="#e8edf2" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle"><text x="85" y="72">Tauri shell</text><text x="265" y="72">React interface</text><text x="445" y="72">FastAPI backend</text><text x="630" y="42">llama.cpp model</text><text x="630" y="117">SQLite storage</text></g>
<g fill="#8c97a4" font-family="system-ui,sans-serif" font-size="12" text-anchor="middle"><text x="85" y="92">desktop window</text><text x="265" y="92">chat, models, system</text><text x="445" y="92">Python 3.12+</text><text x="630" y="58">local inference</text><text x="630" y="133">local data</text></g>
<g stroke="#8c97a4" fill="none" stroke-width="1.5" marker-end="url(#jaa)"><path d="M160 75H188"/><path d="M340 75H368"/><path d="M520 60L548 45"/><path d="M520 90L548 110"/></g></svg>
<figcaption class="fine">Drawn from the README, changelog and source layout. The Tauri shell manages the local backend process.</figcaption></figure>
<div class="grid g3">
<div class="card reveal"><h3>Tauri</h3><p>The desktop shell. It hosts the interface and starts and manages the local backend, so there is no separate server to run.</p></div>
<div class="card reveal"><h3>Python backend</h3><p>FastAPI, with hardware detection, model management, chat streaming, backups and SQLite. Python 3.12 or newer.</p></div>
<div class="card reveal"><h3>Local models</h3><p>llama.cpp is the only inference provider in the code. The model manifest still contains a placeholder download URL and checksum.</p></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Known limitations', 'Honest gaps.')}<ul class="ticks"><li><span>Prototype: no release, installer download or screenshots yet.</span></li><li><span>The model manifest holds a placeholder download URL and checksum, so models are not downloadable out of the box.</span></li><li><span>The MSI build workflow exists but has never run, so an installer build is not yet proven in CI.</span></li><li><span>Backend tests cover core modules such as the API, backups, database, hardware detection and model download. The interface has a build check but no tests.</span></li></ul>
<div class="gallery"><div class="ph"><strong>Screenshot needed</strong><span>Chat page</span></div><div class="ph"><strong>Screenshot needed</strong><span>Models or System page</span></div></div></div></section>
<section class="section container">${sectionHead('Related work', 'JAE and Personal AI.')}<p>JAE and the <a class="text-link inline" href="{up}projects/jaethetech/personal-ai/">Personal AI</a> project on JaeTheTech are separate codebases with the same aim: a private AI assistant on your own PC. JAE uses Python, FastAPI, llama.cpp and React inside Tauri. Personal AI uses Node.js, Express and Ollama, as a Tauri app or a PWA. They are two approaches to one idea, not two finished products.</p></section>
<section class="section container pt0">${links(ext(REPOS.jae, 'JAE repository', 'Source, README and changelog'), ext(REPOS.jae + '/actions', 'GitHub Actions', 'CI and health-check runs'), ext(REPOS.jae + '/releases', 'Releases', 'None published yet'), int('projects/jae/engineering/', 'Engineering', 'CI, health checks, MSI workflow'))}</section>
${back}`,
},
{
  file: 'projects/jae/engineering/index.html', section: 'projects', theme: 't-ae',
  title: 'JAE engineering', desc: 'How JAE is checked and built: a CI workflow, an hourly health check that opens an issue on failure, and a Tauri MSI build workflow that has not run yet. Checked against the repository.',
  crumbs: [['Projects', 'projects/'], ['JAE', 'projects/jae/'], ['Engineering']],
  body: `${hero('JAE · Engineering', 'Checked <span class="c">delivery.</span>', 'Three GitHub Actions workflows and a set of PowerShell scripts. Each claim below was checked against the workflow files and run history on 15 October 2026.')}
<section class="section container">${sectionHead('Pipeline', 'From change to release.', 'Solid boxes are working and proven by runs. The dashed boxes are configured but not yet proven.')}
<figure class="media reveal"><svg viewBox="0 0 760 120" role="img" aria-labelledby="jae-pipe-t jae-pipe-d" width="760" height="120"><title id="jae-pipe-t">JAE delivery pipeline</title><desc id="jae-pipe-d">Source change, then CI validation, then build, then installer, then release. Source change and CI validation are working. Build, installer and release are configured but not yet proven.</desc>
<defs><marker id="jpa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8c97a4"/></marker></defs>
<g fill="#131b25" stroke="#263140"><rect x="5" y="30" width="130" height="60" rx="6"/><rect x="160" y="30" width="130" height="60" rx="6"/><rect x="315" y="30" width="130" height="60" rx="6" stroke-dasharray="5 4"/><rect x="470" y="30" width="130" height="60" rx="6" stroke-dasharray="5 4"/><rect x="625" y="30" width="130" height="60" rx="6" stroke-dasharray="5 4"/></g>
<g fill="#e8edf2" font-family="system-ui,sans-serif" font-size="14" text-anchor="middle"><text x="70" y="65">Source change</text><text x="225" y="65">CI validation</text><text x="380" y="65">Build</text><text x="535" y="65">Installer</text><text x="690" y="65">Release</text></g>
<g stroke="#8c97a4" fill="none" stroke-width="1.5" marker-end="url(#jpa)"><path d="M135 60H158"/><path d="M290 60H313"/><path d="M445 60H468"/><path d="M600 60H623"/></g></svg>
<figcaption class="fine">The build and installer steps are the Tauri MSI workflow. No GitHub release has been published.</figcaption></figure></section>
${facts(['Workflows', '3 (CI, health check, MSI)'], ['CI runs', '14, latest passed'], ['Health check', 'Hourly, latest passed'], ['MSI workflow', 'Never run'])}
<section class="section container">${sectionHead('What each workflow does', 'Confirmed from the repository.')}<div class="grid g3">
<div class="card reveal"><span class="tag">Working</span><h3 class="h3s">CI validation</h3><p>On pushes and pull requests to main, one job installs the Python dependencies and runs the pytest suite. A second installs the frontend and builds it.</p></div>
<div class="card reveal"><span class="tag">Working</span><h3 class="h3s">Hourly health check</h3><p>Runs every hour on a schedule. It repeats the backend tests and frontend build, and opens one GitHub issue if they fail. Recent hourly runs have passed.</p></div>
<div class="card reveal"><span class="tag">Configured</span><h3 class="h3s">Tauri MSI build</h3><p>Runs on a version tag or by hand on Windows. It builds the backend and Tauri app and uploads the MSI as a workflow artifact. It has never run, and it does not create a GitHub release.</p></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Scripts and testing', 'Repeatable local workflow.')}<ul class="ticks"><li><span>PowerShell scripts for install, dev, run, building the backend runtime, building the MSI, cleaning the workspace and a validated push helper.</span></li><li><span>Eight backend test files: API, backups, config, database, hardware detection, model download, model selection and tiers.</span></li><li><span>No interface tests. The frontend is only checked by building it.</span></li></ul>
<div class="note">A passing workflow shows that the checks ran and passed. It does not prove the app is complete. JAE is still a prototype with no release.</div></div></section>
<section class="section container">${sectionHead('Badges', 'Left out on purpose.')}<p>I have not added status badges. The workflow history is linked below, and the explanation above matters more than a row of green icons.</p></section>
${faq('Engineering questions.', ['Does JAE need the cloud?', 'The README says local inference and local data are the default, and that runtime data is not used as a cloud inference backend.'], ['What does it run on?', 'Windows 10 and 11, with a Tauri shell and a local Python 3.12+ backend managed by Tauri.'], ['How does JAE differ from Personal AI?', 'They are separate codebases with a shared aim. JAE uses Python, FastAPI and llama.cpp. Personal AI uses Node.js and Ollama.'])}
<section class="section container pt0">${links(ext(REPOS.jae, 'JAE repository', 'Source and scripts'), ext(REPOS.jae + '/actions', 'GitHub Actions', 'Real run history'), int('projects/jaethetech/personal-ai/', 'Personal AI', 'The related assistant on JaeTheTech'))}</section>
${backTo('projects/jae/', 'JAE')}`,
},
];
