import { str, num, strip } from './util.mjs';

// Everything published about the PC is rebuilt from this whitelist, so nothing unexpected
// (hostnames, usernames, IPs, serial numbers) can ever reach the public site.
export function sanitizeSpecs(r) {
  if (!r || typeof r !== 'object') return null;
  const arr = (a, n) => (Array.isArray(a) ? a.slice(0, n) : []);
  const cpu = r.cpu || {}, ram = r.ram || {}, board = r.board || {}, os = r.os || {}, st = r.storage || {};
  const out = {
    cpu: strip({ name: str(cpu.name), cores: num(cpu.cores, 1, 512), threads: num(cpu.threads, 1, 1024), baseMhz: num(cpu.baseMhz, 100, 10000) }),
    gpus: arr(r.gpus, 4).map((g) => strip({ name: str(g?.name), vramMb: num(g?.vramMb, 0, 1048576), driver: str(g?.driver, 40) })).filter((g) => g.name),
    ram: strip({ totalGb: num(ram.totalGb, 1, 16384), type: str(ram.type, 12), speedMhz: num(ram.speedMhz, 100, 20000) }),
    board: strip({ maker: str(board.maker, 60), model: str(board.model, 80) }),
    os: strip({ name: str(os.name, 60), build: str(os.build, 20), arch: str(os.arch, 12) }),
    storage: strip({ totalGb: num(st.totalGb, 0, 10000000), drives: num(st.drives, 0, 64) }),
  };
  return out.cpu.name || out.gpus.length || out.ram.totalGb ? out : null;
}

// The public snapshot carries only what the website panel and embed display. Other values the
// agent reports (board model, driver version, storage, uptime, clocks, power, fan speed) stay in
// private storage and are never published, because hardware identifiers can be sensitive.
export function publicSnapshotParts(specs, live) {
  const pick = (o, keys) => (o ? Object.fromEntries(keys.filter((k) => o[k] !== undefined).map((k) => [k, o[k]])) : undefined);
  return {
    specs: specs && {
      cpu: pick(specs.cpu, ['name', 'cores', 'threads']),
      gpus: (specs.gpus || []).map((g) => pick(g, ['name', 'vramMb'])),
      ram: pick(specs.ram, ['totalGb', 'type', 'speedMhz']),
      os: pick(specs.os, ['name', 'build']),
    },
    live: live && pick(live, ['cpuLoad', 'cpuTemp', 'gpuLoad', 'gpuTemp', 'ramPct']),
  };
}

const LIVE = {
  cpuLoad: [0, 100], cpuTemp: [0, 150], cpuClock: [0, 10000], cpuPower: [0, 1000],
  gpuLoad: [0, 100], gpuTemp: [0, 150], gpuClock: [0, 5000], gpuPower: [0, 1500], gpuFan: [0, 100],
  gpuVramUsedMb: [0, 1048576], gpuVramMb: [0, 1048576],
  ramPct: [0, 100], ramUsedGb: [0, 16384], diskPct: [0, 100], uptimeHours: [0, 100000],
};

export function sanitizeLive(o) {
  if (!o || typeof o !== 'object') return null;
  const out = {};
  for (const [k, [min, max]] of Object.entries(LIVE)) {
    const n = num(o[k], min, max);
    if (n !== undefined) out[k] = n;
  }
  return Object.keys(out).length ? out : null;
}
