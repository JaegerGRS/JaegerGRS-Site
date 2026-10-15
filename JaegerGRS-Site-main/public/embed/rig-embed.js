/* Rig API: one-tag live PC panel.  Add <script src="/embed/rig-embed.js" defer></script> to any page.
   Optional: put <div data-jgrs-rig></div> where the panel should go (otherwise it floats bottom-right).
   Options on the script tag: data-api="https://your-site.com/api/rig", data-title="My PC", data-theme="dark|light". */
(function () {
  var me = document.currentScript;
  if (!me || !window.fetch) return;
  var base = me.src.replace(/[^/]*$/, '');
  var api = me.getAttribute('data-api') || new URL('/api/rig', me.src).href;
  var title = me.getAttribute('data-title') || 'My PC';
  var theme = me.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = base + 'rig-embed.css';
  document.head.appendChild(css);

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
  }

  var host = document.querySelector('[data-jgrs-rig]');
  var floating = !host;
  var box = el('aside', 'jgrs-rig jgrs-' + theme + (floating ? ' jgrs-float' : ''));
  box.setAttribute('aria-label', title + ' live status');
  var head = el('div', 'jgrs-head');
  var dot = el('span', 'jgrs-dot');
  var status = el('span', 'jgrs-status', 'Checking…');
  head.appendChild(el('strong', '', title));
  head.appendChild(dot);
  head.appendChild(status);
  var specs = el('p', 'jgrs-specs');
  var meters = {};
  var meterBox = el('div', 'jgrs-meters');
  [['cpuLoad', 'CPU'], ['gpuLoad', 'GPU'], ['ramPct', 'RAM']].forEach(function (m) {
    var row = el('label', '', m[1] + ' ');
    var out = el('output', '', '—');
    var bar = el('meter');
    bar.min = 0; bar.max = 100; bar.value = 0;
    row.appendChild(out); row.appendChild(bar);
    meterBox.appendChild(row);
    meters[m[0]] = { out: out, bar: bar };
  });
  box.appendChild(head); box.appendChild(specs); box.appendChild(meterBox);
  (host || document.body).appendChild(box);

  function short(n) {
    return String(n || '').replace(/\((R|TM)\)/g, '').replace(/\bCPU\b.*$/, '').replace(/\bProcessor\b/i, '')
      .replace(/^(Intel|AMD|NVIDIA)\s+/i, '').replace(/^(GeForce|Radeon)\s+/i, '').replace(/\s+/g, ' ').trim();
  }

  function render(s) {
    var online = !!(s && s.online);
    dot.setAttribute('data-state', online ? 'online' : 'offline');
    status.textContent = online ? 'Online' : (s && s.specs ? 'Offline (last known specs)' : 'Offline');
    var sp = s && s.specs;
    if (sp) {
      var bits = [sp.cpu && short(sp.cpu.name), sp.gpus && sp.gpus[0] && short(sp.gpus[0].name), sp.ram && sp.ram.totalGb && sp.ram.totalGb + ' GB RAM'];
      specs.textContent = bits.filter(Boolean).join(' · ');
    }
    Object.keys(meters).forEach(function (k) {
      var v = online && s.live && typeof s.live[k] === 'number' ? s.live[k] : null;
      meters[k].bar.value = v === null ? 0 : v;
      meters[k].out.textContent = v === null ? '—' : Math.round(v) + '%';
    });
  }

  var timer = null, fails = 0;
  function next(ms) { clearTimeout(timer); timer = setTimeout(poll, ms); }
  function poll(first) {
    if (document.hidden && first !== true) { next(5000); return; }
    fetch(api, { headers: { Accept: 'application/json' }, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (s) { fails = 0; render(s); next(3000); })
      .catch(function () {
        fails++;
        if (fails >= 2) { dot.setAttribute('data-state', 'offline'); status.textContent = 'Unavailable'; }
        next(Math.min(30000, 3000 * Math.pow(2, fails)));
      });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) next(0); });
  poll(true);
})();
