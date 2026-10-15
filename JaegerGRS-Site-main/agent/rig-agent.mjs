#!/usr/bin/env node
// JaegerGRS PC agent: sends this PC's specs and live load to jaegergrs.com.
// Zero dependencies (Node 18+). Windows is the supported platform.
//
//   node rig-agent.mjs setup        store the site address and pairing key (key is encrypted for your Windows user)
//   node rig-agent.mjs              run and report forever
//   node rig-agent.mjs --once       send one sample and exit
//   node rig-agent.mjs --dry-run    print what would be sent; sends nothing
//   node rig-agent.mjs --gen-token  print a new random pairing key
//
// Settings can also come from JGRS_URL and JGRS_RIG_TOKEN environment variables.
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const args = new Set(process.argv.slice(2));
const dir = path.join(process.env.APPDATA || path.join(os.homedir(), '.config'), 'JaegerGRS');
const cfgFile = path.join(dir, 'rig-agent.json');
const IS_WIN = process.platform === 'win32';

const log = (...a) => console.log(new Date().toLocaleTimeString(), ...a);
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n * 10) / 10 : undefined; };
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ''));

async function ps(script, timeout = 15000, env = process.env) {
  const { stdout } = await run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { timeout, windowsHide: true, env });
  return stdout.trim();
}

// ---- pairing key storage (Windows DPAPI via ConvertFrom-SecureString: only this Windows user can decrypt)
async function protect(secret) {
  if (!IS_WIN) return { plain: secret };
  const enc = await ps('$env:JGRS_SECRET | ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString', 15000, { ...process.env, JGRS_SECRET: secret });
  return { dpapi: enc };
}
async function unprotect(stored) {
  if (stored.plain) return stored.plain;
  return ps(`$s = ConvertTo-SecureString '${stored.dpapi}'; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))`);
}

async function loadConfig() {
  if (process.env.JGRS_URL && process.env.JGRS_RIG_TOKEN) return { url: process.env.JGRS_URL, token: process.env.JGRS_RIG_TOKEN };
  if (!fs.existsSync(cfgFile)) return null;
  const c = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  return { url: c.url, token: await unprotect(c.key) };
}

async function setup() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const url = (await rl.question('Site address [https://jaegergrs.com]: ')).trim() || 'https://jaegergrs.com';
  const token = (await rl.question('Pairing key (the same value stored as the RIG_TOKEN secret on Cloudflare): ')).trim();
  rl.close();
  if (!/^https:\/\//.test(url) && !/^http:\/\/localhost/.test(url)) throw new Error('The site address must start with https://');
  if (!/^[A-Za-z0-9_-]{32,200}$/.test(token)) throw new Error('The key must be 32 to 200 characters: letters, numbers, - and _. Make one with --gen-token.');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(cfgFile, JSON.stringify({ url: url.replace(/\/$/, ''), key: await protect(token) }, null, 2), { mode: 0o600 });
  console.log(`Saved to ${cfgFile}. The key is encrypted for your Windows account.`);
}

// ---- collectors
function cpuTimes() {
  return os.cpus().reduce((a, c) => { const t = c.times; a.idle += t.idle; a.total += t.user + t.nice + t.sys + t.idle + t.irq; return a; }, { idle: 0, total: 0 });
}
let prevCpu = cpuTimes();
function cpuLoad() {
  const now = cpuTimes();
  const total = now.total - prevCpu.total;
  const load = total > 0 ? (1 - (now.idle - prevCpu.idle) / total) * 100 : undefined;
  prevCpu = now;
  return load;
}

async function nvidia() {
  try {
    const { stdout } = await run('nvidia-smi', ['--query-gpu=name,utilization.gpu,temperature.gpu,clocks.gr,power.draw,fan.speed,memory.used,memory.total,driver_version', '--format=csv,noheader,nounits'], { timeout: 5000, windowsHide: true });
    const [name, load, temp, clock, power, fan, used, total, driver] = stdout.trim().split(/\r?\n/)[0].split(',').map((s) => s.trim());
    return { name, driver, load: num(load), temp: num(temp), clock: num(clock), power: num(power), fan: num(fan), used: num(used), total: num(total) };
  } catch { return null; }
}

async function collectSpecs() {
  const specs = {
    cpu: { name: os.cpus()[0]?.model?.replace(/\s+/g, ' ').trim(), threads: os.cpus().length },
    ram: { totalGb: Math.round(os.totalmem() / 2 ** 30) },
    os: { name: `${os.type()} ${os.release()}`, arch: os.arch() },
    gpus: [],
  };
  if (IS_WIN) {
    try {
      const j = JSON.parse(await ps(`$c=Get-CimInstance Win32_Processor|Select -First 1 Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed;$g=@(Get-CimInstance Win32_VideoController|Select Name,AdapterRAM,DriverVersion);$m=@(Get-CimInstance Win32_PhysicalMemory|Select Speed,SMBIOSMemoryType);$b=Get-CimInstance Win32_BaseBoard|Select Manufacturer,Product;$o=Get-CimInstance Win32_OperatingSystem|Select Caption,BuildNumber;$d=@(Get-CimInstance Win32_DiskDrive|Select Size);[pscustomobject]@{c=$c;g=$g;m=$m;b=$b;o=$o;d=$d}|ConvertTo-Json -Depth 4 -Compress`, 30000));
      const arr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
      specs.cpu = { name: j.c?.Name?.replace(/\s+/g, ' ').trim(), cores: j.c?.NumberOfCores, threads: j.c?.NumberOfLogicalProcessors, baseMhz: j.c?.MaxClockSpeed };
      specs.gpus = arr(j.g).filter((g) => g.Name && !/basic|remote|virtual/i.test(g.Name)).map((g) => ({ name: g.Name, driver: g.DriverVersion }));
      const speed = arr(j.m)[0]?.Speed;
      const ddr = { 26: 'DDR4', 34: 'DDR5', 24: 'DDR3' }[arr(j.m)[0]?.SMBIOSMemoryType];
      specs.ram = clean({ totalGb: specs.ram.totalGb, type: ddr, speedMhz: speed });
      specs.board = clean({ maker: j.b?.Manufacturer, model: j.b?.Product });
      specs.os = clean({ name: j.o?.Caption?.replace(/^Microsoft\s+/i, ''), build: j.o?.BuildNumber, arch: os.arch() });
      specs.storage = clean({ drives: arr(j.d).length, totalGb: Math.round(arr(j.d).reduce((s, d) => s + (Number(d.Size) || 0), 0) / 1e9) });
    } catch (e) { log('Could not read full specs, using basic ones:', e.message); }
  }
  const nv = await nvidia();
  if (nv) {
    const first = specs.gpus.find((g) => g.name === nv.name);
    if (first) first.vramMb = nv.total; else specs.gpus.unshift({ name: nv.name, driver: nv.driver, vramMb: nv.total });
  }
  return specs;
}

async function collectLive() {
  const total = os.totalmem();
  const used = total - os.freemem();
  const nv = await nvidia();
  return clean({
    cpuLoad: num(cpuLoad()),
    ramPct: num((used / total) * 100),
    ramUsedGb: num(used / 2 ** 30),
    uptimeHours: num(os.uptime() / 3600),
    gpuLoad: nv?.load, gpuTemp: nv?.temp, gpuClock: nv?.clock, gpuPower: nv?.power, gpuFan: nv?.fan,
    gpuVramUsedMb: nv?.used, gpuVramMb: nv?.total,
  });
}

// ---- sender
async function send(cfg, body) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 10000);
  try {
    const res = await fetch(`${cfg.url}/api/rig`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.token}` }, body: JSON.stringify(body), signal: ctl.signal });
    if (res.status === 401) throw Object.assign(new Error('The site rejected the pairing key (401). Check RIG_TOKEN on Cloudflare matches, then run setup again.'), { fatal: true });
    if (res.status === 503) throw Object.assign(new Error('The site has no RIG_TOKEN configured yet (503).'), { fatal: true });
    if (!res.ok && res.status !== 429) throw new Error(`Site answered ${res.status}`);
    return res.status === 429 ? { ok: true, watching: true } : res.json();
  } finally { clearTimeout(t); }
}

async function main() {
  if (args.has('--gen-token')) { console.log(crypto.randomBytes(36).toString('base64url')); return; }
  if (args.has('setup') || args.has('--setup')) { await setup(); return; }

  const specs = await collectSpecs();
  if (args.has('--dry-run')) {
    await new Promise((r) => setTimeout(r, 1000));
    console.log(JSON.stringify({ specs, live: await collectLive() }, null, 2));
    return;
  }

  const cfg = await loadConfig();
  if (!cfg) { console.error('Not set up yet. Run: node rig-agent.mjs setup'); process.exitCode = 2; return; }
  if (args.has('--once')) { await new Promise((r) => setTimeout(r, 1000)); log(JSON.stringify(await send(cfg, { specs, live: await collectLive() }))); return; }

  log(`Reporting to ${cfg.url}. Press Ctrl+C to stop.`);
  let delay = 3000, errors = 0, lastSpecs = 0;
  for (;;) {
    try {
      const body = { live: await collectLive() };
      if (Date.now() - lastSpecs > 10 * 60 * 1000) body.specs = specs;
      const ack = await send(cfg, body);
      if (body.specs) lastSpecs = Date.now();
      if (errors) log('Connection restored.');
      errors = 0;
      delay = ack.watching ? 3000 : 15000;
    } catch (e) {
      if (e.fatal) { console.error(e.message); process.exitCode = 1; return; }
      errors++;
      delay = Math.min(60000, 3000 * 2 ** Math.min(errors, 5));
      if (errors === 1 || errors % 10 === 0) log(`Send failed (${e.name === 'AbortError' ? 'timeout' : e.message}); retrying in ${Math.round(delay / 1000)}s`);
    }
    await new Promise((r) => setTimeout(r, delay));
  }
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; });
