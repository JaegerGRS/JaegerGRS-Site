import { JTT } from '../config.mjs';
import { STATUS as S, REPOS } from '../facts.mjs';
import { ext, int, links, sectionHead, facts, hero, back, backTo, more, faq, img } from '../components.mjs';

const REPO = REPOS.jaethetech;

export default [
{
  file: 'projects/jaethetech/index.html', section: 'projects', theme: 't-jae',
  title: 'JaeTheTech', desc: 'JaeTheTech is my personal technical site: hand-written HTML, CSS and JavaScript with a Cloudflare Worker for sign-in. It also hosts the Personal AI project.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech']],
  body: `${hero('Project · Personal technical site', 'Jae<span class="c">The</span>Tech.', 'A personal site for technical writing and software experiments, written in plain HTML, CSS and JavaScript with a small Cloudflare Worker behind it for passwordless sign-in. It is also where the Personal AI project is described.', `<div class="actions"><a class="btn primary" href="${JTT}" target="_blank" rel="noopener noreferrer">Visit jaethetech.com <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${REPO}" target="_blank" rel="noopener noreferrer">Source on GitHub <span aria-hidden="true">↗</span></a></div>`)}
${facts(['Status', `${S.jaethetech} · live at jaethetech.com`], ['Role', 'Solo developer (as stated on the site)'], ['Stack', 'HTML, CSS, JavaScript, Cloudflare Workers and KV'], ['Source', 'Public repository, all rights reserved'])}
<section class="section container">${sectionHead('Overview', 'What the project is.')}<div class="prose"><p>The site has pages for projects, a development roadmap, platforms and an about page, plus a sign-in area with a dashboard and an admin page. The part that is most relevant to employers is the sign-in backend, a single Cloudflare Worker in the repository.</p><p>The channel and content side of JaeTheTech is supporting creative work. This page focuses on the engineering.</p></div></section>
<section class="section muted"><div class="container">${sectionHead('Engineering', 'What the Worker does.', 'Read from the public repository (worker/auth-worker.js and wrangler.toml).')}<div class="grid g3">
<div class="card reveal"><h3>Passwordless sign-in</h3><p>Routes for sending and verifying one-time email codes, sign-up, and a GitHub sign-in flow with a short-lived state value.</p></div>
<div class="card reveal"><h3>Sessions and roles</h3><p>Session tokens, a user role route and staff add, remove and list routes, all stored in Cloudflare KV.</p></div>
<div class="card reveal"><h3>Abuse limits</h3><p>A rate limit of 10 requests per 15-minute window, and expiring entries for codes, sessions and sign-in state.</p></div>
</div><p class="fine">Not verified by me: whether these routes have automated tests, and whether the email and GitHub sign-in settings are configured in production. The repository has no test files or workflows.</p></div></section>
<section class="section container">${sectionHead('Decisions', 'Why this architecture.', 'My reasoning, based on the repository and the text of the site itself. It is not a claim that this approach is better than a framework.')}<div class="grid g2">
<div class="card reveal"><h3>Plain HTML, CSS and JavaScript</h3><p>The site is a small set of mostly static pages with little shared state, so a build step or UI framework would add maintenance without much benefit. The trade-off is repeated markup across pages and more manual work as the site grows.</p></div>
<div class="card reveal"><h3>A Worker instead of a server</h3><p>Sign-in needs a backend, but running a server for a small site means ongoing hosting and patching. A Worker with KV keeps the backend small and inexpensive. The trade-off is Cloudflare lock-in and KV's eventual consistency.</p></div>
</div></section>
<section class="section container">${sectionHead('Evidence', 'Screenshots of the site.', 'Real captures of jaethetech.com taken for this page.')}<div class="grid g2">
<figure class="reveal">${img('jtt-home.webp', 'The JaeTheTech home page with a dark theme and a top navigation bar', 1200, 750)}<figcaption class="fine">Home page.</figcaption></figure>
<figure class="reveal">${img('jtt-projects.webp', 'The JaeTheTech projects page with the Personal AI project heading', 1200, 750)}<figcaption class="fine">Projects page.</figcaption></figure>
</div></section>
${more('Related project.', int('projects/jaethetech/personal-ai/', 'Personal AI', 'The local AI assistant described on this site'), int('projects/jae/', 'JAE', 'A separate local AI codebase with a shared aim'))}
<section class="section container">${sectionHead('Explore the site', 'Links.')}
${links(ext(JTT, 'Home', 'jaethetech.com'), ext(JTT + '/projects', 'Projects', 'Personal AI and GitHub repos'), ext(JTT + '/development', 'Development', 'Learning and current work'), ext(JTT + '/roadmap', 'Roadmap', 'Plans and milestones'), ext(REPO, 'Site source', 'GitHub repository'))}</section>
${back}`,
},
{
  file: 'projects/jaethetech/personal-ai/index.html', section: 'projects', theme: 't-jae',
  title: 'Personal AI', desc: 'Personal AI: a local-first AI assistant project described on jaethetech.com. What is local, what needs the internet, and what I could not verify.',
  crumbs: [['Projects', 'projects/'], ['JaeTheTech', 'projects/jaethetech/'], ['Personal AI']],
  body: `${hero('JaeTheTech · Project', 'Personal <span class="c">AI.</span>', 'A local-first AI assistant for coding, market data, news and daily tasks, using local models through Ollama. It is described on jaethetech.com. Its source code is not public, so this page separates what the project states from what I can confirm.', `<div class="actions"><a class="btn primary" href="${JTT}/projects" target="_blank" rel="noopener noreferrer">Description on jaethetech.com <span aria-hidden="true">↗</span></a></div>`)}
${facts(['Status', 'In development (listed as "Building Now" on its roadmap)'], ['Source', 'No public repository found'], ['Release', 'None found'], ['Stack', 'Node.js, Express, WebSocket, Ollama; Tauri and PWA targets'])}
<section class="section container"><div class="note"><strong>Verification.</strong> The facts on this page come from the public jaethetech.com pages and its public repository. I have not seen the Personal AI code or a running copy, so features below are the project's own statements, not confirmed behaviour.</div></section>
<section class="section container">${sectionHead('Local and external', 'What runs where.', 'The whole app is not offline, because live data has to come from outside.')}<div class="grid g3">
<div class="card reveal"><span class="tag">Local</span><h3>Model inference</h3><p>AI chat and code assistance are stated to run on local models through Ollama, on the user's own PC.</p></div>
<div class="card reveal"><span class="tag">Needs internet</span><h3>Live market and news data</h3><p>Gold and crypto prices and multi-source news can only come from external services, so these features need an internet connection. The data providers are not named publicly.</p></div>
<div class="card reveal"><span class="tag">Unconfirmed</span><h3>Where data is stored</h3><p>The site says everything is kept local by default. Where conversations, settings and files are stored, and in what form, is not documented, so I am not claiming more.</p></div>
</div></section>
<section class="section muted"><div class="container">${sectionHead('Versions', 'Desktop, PWA and sync.')}<div class="prose"><p>The project describes two ways to run it: a Tauri desktop build and a PWA that works on other devices. A WebSocket layer is described for syncing settings, conversations and files between devices on the same local network.</p><p>Its roadmap lists Tauri desktop polish and multi-device sync as milestones, so I treat both as work in progress. I cannot confirm that a finished desktop installer exists, and no release is published.</p></div></div></section>
<section class="section container">${sectionHead('Status', 'What is implemented and what is not.')}<div class="grid g2">
<div class="card reveal"><h3>Stated as built</h3><p>From the roadmap: a seven-agent hub (coding, trading, general, personal, news, image and builder), AI chat with local Ollama models and a self-editing builder agent.</p></div>
<div class="card reveal"><h3>Prototype or unconfirmed</h3><p>Everything else is unconfirmed: live market data, WebSocket sync, Tauri polish and the "network privacy layer" and "MAC/UA randomisation" listed on the site. I have not verified any of them.</p></div>
</div><p class="fine">The Personal AI visual on jaethetech.com is an illustrative mock-up, not a screenshot of the application, so I have not reproduced it as evidence here.</p></section>
<section class="section container">${sectionHead('Relationship', 'How it relates to JAE.')}<div class="prose"><p><a class="text-link inline" href="{up}projects/jae/">JAE, the Jaeger Adaptive Engine</a> and Personal AI share an aim, a private AI assistant running on personal hardware, but they are separate codebases. Personal AI uses Node.js and Ollama. JAE uses Python, FastAPI and llama.cpp, and its source is public. I do not consider them two finished products.</p></div></section>
${faq('About Personal AI.', ['Does it work offline?', 'Local chat is stated to use Ollama on the PC. Live market and news data need the internet, so the whole application is not offline.'], ['Does my data leave my machine?', 'Local inference is stated to stay on the PC, but external data retrieval makes outgoing requests. Storage and what is sent are not documented, so I make no stronger claim.'], ['Can I download it?', 'No release or public repository was found.'])}
${backTo('projects/jaethetech/', 'JaeTheTech')}`,
},
];
