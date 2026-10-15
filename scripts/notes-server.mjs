// Private "notes to Copilot" page for the self-host. Type a change request here; it is saved to
// notes/requests.md, ready to paste into Copilot Chat in VS Code. Nothing here can run commands.
// Run: node scripts/notes-server.mjs [--port 8788]
// Listens on this PC only (127.0.0.1). Password is generated once into notes/.password.
import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'notes');
const file = join(dir, 'requests.md');
const pwFile = join(dir, '.password');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 8788;
const MAX = 20 * 1024;

mkdirSync(dir, { recursive: true });
if (!existsSync(pwFile)) writeFileSync(pwFile, randomBytes(15).toString('base64url'));
const password = readFileSync(pwFile, 'utf8').trim();
if (!existsSync(file)) writeFileSync(file, '# Requests for Copilot\n\n');

const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const authed = (req) => {
  const m = /^Basic (.+)$/.exec(req.headers.authorization || '');
  if (!m) return false;
  const pass = Buffer.from(m[1], 'base64').toString().split(':').slice(1).join(':');
  return same(pass, password);
};

const page = () => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Notes to Copilot</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:760px;margin:0 auto;padding:20px;background:#12151c;color:#e8ecf4}
textarea{width:100%;min-height:160px;padding:12px;border-radius:10px;border:1px solid #2a3140;background:#0b0d12;color:inherit;font:inherit;box-sizing:border-box}
button{margin:10px 8px 0 0;padding:10px 18px;border:0;border-radius:10px;background:#4f8cff;color:#fff;font:inherit;cursor:pointer}
button.alt{background:#2a3140}pre{white-space:pre-wrap;background:#0b0d12;border:1px solid #2a3140;border-radius:10px;padding:12px}
.fine{color:#9aa4b8;font-size:13px}</style></head><body>
<h1>Notes to Copilot</h1>
<p class="fine">Write what you want changed. It is saved to <code>notes/requests.md</code>. Press <b>Copy all</b>, then paste into Copilot Chat in VS Code and send.</p>
<form method="post" action="/"><textarea name="note" required maxlength="${MAX}" placeholder="e.g. Make the Rig API page price cards bigger on phones"></textarea>
<button type="submit">Save request</button><button type="button" class="alt" id="copy">Copy all</button> <span id="done" class="fine"></span></form>
<h2>Saved requests</h2><pre id="log">${esc(readFileSync(file, 'utf8'))}</pre>
<script>document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(document.getElementById('log').textContent).then(function(){document.getElementById('done').textContent='Copied'})}</script>
</body></html>`;

createServer((req, res) => {
  const deny = () => { res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Notes (any username)"' }); res.end('Password needed'); };
  if (!authed(req)) return deny();

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY' });
    return res.end(page());
  }

  if (req.method === 'POST' && req.url === '/') {
    // Basic auth is sent automatically by browsers, so refuse posts that come from other sites.
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) { res.writeHead(403); return res.end('Forbidden'); }
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > MAX + 1024) req.destroy(); else chunks.push(c); });
    req.on('end', () => {
      const note = new URLSearchParams(Buffer.concat(chunks).toString()).get('note')?.trim();
      if (note) appendFileSync(file, `## ${new Date().toLocaleString('en-GB')}\n\n${note.slice(0, MAX)}\n\n`);
      res.writeHead(303, { Location: '/' }); res.end();
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
}).listen(port, '127.0.0.1', () => {
  console.log(`Notes page: http://localhost:${port}   (this PC only)`);
  console.log(`Username: anything   Password: ${password}`);
});
