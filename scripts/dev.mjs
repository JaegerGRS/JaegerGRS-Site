// Live dev server: serves public/, rebuilds when src/ changes and reloads open browser tabs.
// /api/* is proxied to the self-host Worker (npm run selfhost) when it is running.
import { createServer, request as httpRequest } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { execFile } from 'node:child_process';
import { dirname, extname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const port = Number(process.env.PORT || 8790);
const apiPort = Number(process.env.API_PORT || 8787);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };
const client = '<script>new EventSource("/__live").onmessage=()=>location.reload()</script>';
const listeners = new Set();
const log = msg => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

let timer, building = false, again = false;
function rebuild(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (building) { again = true; return; }
    building = true;
    log(`changed: ${reason} - rebuilding`);
    execFile(process.execPath, [join(root, 'src', 'site', 'build.mjs')], { cwd: root }, (err, out, errOut) => {
      building = false;
      if (err) log(`build FAILED\n${errOut || err.message}`);
      else { log('rebuilt - reloading browsers'); for (const r of listeners) r.write('data: reload\n\n'); }
      if (again) { again = false; rebuild('queued change'); }
    });
  }, 150);
}

// Generated HTML changes during a build, so only src/ and the hand-written assets trigger one.
watch(join(root, 'src'), { recursive: true }, (_, f) => f && rebuild(`src/${f}`));
watch(join(pub, 'assets'), { recursive: true }, (_, f) => {
  if (f) { log(`asset changed: ${f}`); for (const r of listeners) r.write('data: reload\n\n'); }
});

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__live') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store' });
    res.write('retry: 1000\n\n');
    listeners.add(res); req.on('close', () => listeners.delete(res));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    const up = httpRequest({ host: '127.0.0.1', port: apiPort, path: req.url, method: req.method,
      headers: { ...req.headers, host: `localhost:${apiPort}` } }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    up.on('error', () => { res.writeHead(502, { 'content-type': 'application/json' }); res.end('{"error":"api not running (npm run selfhost)"}'); });
    req.pipe(up);
    return;
  }
  let file = normalize(join(pub, decodeURIComponent(url.pathname)));
  if (!file.startsWith(pub)) { res.writeHead(403); return res.end(); }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    let body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    if (type.startsWith('text/html')) body = Buffer.from(body.toString().replace('</body>', `${client}</body>`));
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }); res.end('Not found');
  }
}).listen(port, () => log(`Live preview on http://localhost:${port}  (watching src/ and public/assets/)`));
