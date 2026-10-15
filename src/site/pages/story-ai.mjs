import { int, links, sectionHead, hero, backTo, more, facts, steps, faq } from '../components.mjs';

export default [
{
  file: 'projects/story-ai/index.html', section: 'projects', theme: 't-story',
  title: 'YouTube AI Story', desc: 'YouTube AI Story: an AI tool I am building to help make story-style content, from short-form clips to long-form videos, running locally on my own PC.',
  crumbs: [['Projects', 'projects/'], ['YouTube AI Story']],
  body: `${hero('Project · AI for story content · In development', 'YouTube AI <span class="c">Story.</span>', 'An AI tool I am building to help create story-style video content, both short-form and long-form. It runs on my own PC, with local models and GPU rendering.')}
${facts(['Type', 'AI content tool'], ['Output', 'Shorts and long-form'], ['Runs on', 'My own PC (local)'], ['Status', 'In development'])}
<section class="section container"><div class="two">
<div><p class="kicker">Overview</p><h2 class="title">Story content, made faster.</h2></div>
<div class="prose"><p>The idea is simple: take a story from idea to finished video with as much help from AI as is sensible, while keeping it original and keeping me in control of the result.</p><p>It is built to make both short clips and longer videos, and it is being moved into a lightweight Tauri desktop app, the same approach I use for <a class="text-link inline" href="{up}projects/jae/">JAE</a>.</p>
<div class="chips"><span>Python</span><span>Tauri</span><span>Rust</span><span>TypeScript</span><span>Local AI</span><span>GPU rendering</span></div></div></div></section>
<section class="section container pt0"><div class="grid g3">
<div class="card reveal"><span class="icon">✎</span><h3>Ideas and scripts</h3><p>Generates story ideas grounded in current trends, then turns them into scripts with emotion markers for the voice.</p></div>
<div class="card reveal"><span class="icon">♫</span><h3>Voices and characters</h3><p>Reusable AI characters and emotional voices, so a channel keeps a consistent sound.</p></div>
<div class="card reveal"><span class="icon">▶</span><h3>Rendering</h3><p>Multi-threaded video rendering that uses the CPU, the RAM and the GPU in my PC.</p></div>
</div></section>
${more('Go deeper.', int('projects/story-ai/pipeline/', 'The pipeline', 'From idea to finished video'), int('projects/jae/', 'JAE', 'My local-first AI app'), int('projects/grey-signal/', 'Grey Signal', 'My content creation channel'))}
${faq('About this project.', ['Is it finished?', 'No. It is in development: the pipeline modules exist and the desktop app is being built. I will update this page as it moves forward.'], ['Is the content original?', 'That is the aim. It includes a plagiarism checker so ideas can be inspired by trends without copying anyone.'], ['Does it run in the cloud?', 'No. It is local-first and runs on my own PC.'])}
${backTo('projects/', 'Projects')}`,
},
{
  file: 'projects/story-ai/pipeline/index.html', section: 'projects', theme: 't-story',
  title: 'YouTube AI Story: the pipeline', desc: 'How the YouTube AI Story tool works: ideas, scripts, characters and voices, rendering, originality checks and a record of how each video was made.',
  crumbs: [['Projects', 'projects/'], ['YouTube AI Story', 'projects/story-ai/'], ['Pipeline']],
  body: `${hero('YouTube AI Story · The pipeline', 'Idea to <span class="c">video.</span>', 'The stages a story goes through, from the first idea to a finished video file.')}
${steps('Stages', 'Six steps.', '<strong>Research:</strong> looks at trends so ideas are based on what people actually watch.', '<strong>Idea:</strong> generates unique story ideas for a chosen niche or audience.', '<strong>Script:</strong> turns the idea into a script that reads like a person wrote it, with emotion markers.', '<strong>Voice:</strong> creates the voiceover from a saved character, using local text-to-speech.', '<strong>Render:</strong> builds the video using the CPU, RAM and GPU, as a short or a long-form piece.', '<strong>Check:</strong> runs an originality check and saves a record of how the video was made.')}
<section class="section container pt0"><div class="two">
<div><p class="kicker">Design choices</p><h2 class="title">Local, light and honest.</h2></div>
<div class="prose"><p>Heavy models only load when a video job starts, so the app stays light while idle. Everything runs on my own machine.</p><p>Each project keeps a local manifest with file hashes, so there is a record of how it was created. The originality checker works in several layers, and is there to make sure ideas are inspired, not copied.</p>
<div class="chips"><span>Plagiarism checker</span><span>Project manifests</span><span>Local text-to-speech</span><span>Tauri desktop app</span></div></div></div></section>
${backTo('projects/story-ai/', 'YouTube AI Story')}`,
},
];
