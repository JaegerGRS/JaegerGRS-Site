(function(){
  var root=document.querySelector('[data-rig]');
  var live=document.querySelectorAll('[data-rig-live]');
  if((!root&&!live.length)||!window.fetch)return;
  var statusEl=root&&root.querySelector('[data-rig-status]');
  var statusText=root&&root.querySelector('[data-rig-status-text]');
  var note=root&&root.querySelector('[data-rig-note]');
  var stale=root&&root.querySelector('[data-rig-stale]');
  var ageEl=root&&root.querySelector('[data-rig-age]');
  var timer=null,failures=0;
  var fallback=[];
  live.forEach(function(el){fallback.push(el.textContent);});

  function text(el,v){if(el&&el.textContent!==v)el.textContent=v;}
  function ago(sec){
    if(typeof sec!=='number')return 'at an unknown time';
    if(sec<90)return 'moments ago';
    if(sec<5400)return Math.round(sec/60)+' minutes ago';
    if(sec<172800)return Math.round(sec/3600)+' hours ago';
    return Math.round(sec/86400)+' days ago';
  }
  function field(name,v){
    var el=root&&root.querySelector('[data-rig-field="'+name+'"]');
    if(el&&v)el.textContent=v;
  }
  function cpuText(c){
    if(!c||!c.name)return '';
    var bits=[];
    if(c.cores)bits.push(c.cores+' cores');
    if(c.threads)bits.push(c.threads+' threads');
    return c.name+(bits.length?' ('+bits.join(', ')+')':'');
  }
  function gpuText(g){
    if(!g||!g.length)return '';
    return g.map(function(x){return x.name+(x.vramMb?' '+Math.round(x.vramMb/1024)+' GB':'');}).join(' + ');
  }
  function ramText(r){
    if(!r||!r.totalGb)return '';
    return r.totalGb+' GB'+(r.type?' '+r.type:'')+(r.speedMhz?' @ '+r.speedMhz+' MHz':'');
  }
  function osText(o){return o&&o.name?o.name+(o.build?' ('+o.build+')':''):'';}
  function shortCpu(n){
    return (n||'').replace(/\((R|TM)\)/g,'').replace(/\bCPU\b.*$/,'').replace(/\d+-Core Processor/i,'').replace(/\bProcessor\b/i,'').replace(/^(Intel|AMD)\s+/i,'').replace(/\s+/g,' ').trim();
  }
  function shortGpu(n){
    return (n||'').replace(/\((R|TM)\)/g,'').replace(/^(NVIDIA|AMD|Intel)\s+/i,'').replace(/^(GeForce|Radeon)\s+/i,'').replace(/\s+/g,' ').trim();
  }

  function liveValues(spec){
    if(!spec)return {};
    var g=spec.gpus&&spec.gpus[0];
    var cpu=spec.cpu&&shortCpu(spec.cpu.name);
    var gpu=g&&shortGpu(g.name);
    var ram=spec.ram&&spec.ram.totalGb?spec.ram.totalGb+' GB':'';
    return {cpu:cpu,gpu:gpu,ram:ram,cpuUpper:(cpu||'').toUpperCase(),gpuUpper:(gpu||'').toUpperCase(),
      line:[cpu,gpu].filter(Boolean).join(' · '),
      fullLine:[cpu,ram,gpu].filter(Boolean).join(' · ')};
  }

  function render(s){
    var online=!!(s&&s.online);
    if(root){
      var hasSpecs=!!(s&&s.specs);
      var state=online?'online':(hasSpecs?'stale':'offline');
      statusEl.setAttribute('data-state',state);
      text(statusText,online?'Online now':(hasSpecs?'Offline: showing last known specs':'Offline'));
      if(stale){stale.hidden=online||!hasSpecs;text(ageEl,ago(s&&s.ageSec));}
      if(s&&s.specs){
        field('cpu',cpuText(s.specs.cpu));
        field('gpu',gpuText(s.specs.gpus));
        field('ram',ramText(s.specs.ram));
        field('os',osText(s.specs.os));
      }
      root.querySelectorAll('[data-rig-meter]').forEach(function(m){
        var k=m.getAttribute('data-rig-meter');
        var v=online&&s.live&&typeof s.live[k]==='number'?s.live[k]:null;
        m.value=v===null?0:v;
        text(root.querySelector('[data-rig-out="'+k+'"]'),v===null?'—':Math.round(v)+(/Temp$/.test(k)?'°C':'%'));
      });
      if(note)note.hidden=online;
    }
    var vals=liveValues(s&&s.specs);
    live.forEach(function(el,i){
      var v=vals[el.getAttribute('data-rig-live')];
      el.textContent=v||fallback[i];
    });
  }

  function schedule(ms){clearTimeout(timer);timer=setTimeout(poll,ms);}
  function poll(){
    if(document.hidden){schedule(5000);return;}
    var ctl=window.AbortController?new AbortController():null;
    var t=ctl?setTimeout(function(){ctl.abort();},8000):null;
    fetch('/api/rig',{headers:{Accept:'application/json'},cache:'no-store',signal:ctl?ctl.signal:undefined})
      .then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
      .then(function(s){failures=0;render(s);schedule(root?3000:20000);})
      .catch(function(){
        failures++;
        if(root&&failures>=2){statusEl.setAttribute('data-state','error');text(statusText,'Live data unavailable. Any values shown may be out of date.');if(stale)stale.hidden=true;}
        schedule(Math.min(30000,3000*Math.pow(2,failures)));
      })
      .then(function(){if(t)clearTimeout(t);});
  }
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(0);});
  poll();
})();
