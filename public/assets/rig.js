(function(){
  var root=document.querySelector('[data-rig]');
  if(!root||!window.fetch)return;
  var statusEl=root.querySelector('[data-rig-status]');
  var statusText=root.querySelector('[data-rig-status-text]');
  var note=root.querySelector('[data-rig-note]');
  var timer=null,failures=0;

  function text(el,v){if(el)el.textContent=v;}
  function field(name,v){
    var el=root.querySelector('[data-rig-field="'+name+'"]');
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

  function render(s){
    var online=!!(s&&s.online);
    statusEl.setAttribute('data-state',online?'online':'offline');
    text(statusText,online?'Online now':(s&&s.specs?'Offline, showing last known specs':'Offline'));
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
      var out=root.querySelector('[data-rig-out="'+k+'"]');
      text(out,v===null?'—':Math.round(v)+(k==='gpuTemp'?'°C':'%'));
    });
    if(note)note.hidden=online;
    document.querySelectorAll('[data-rig-live]').forEach(function(el){
      var spec=s&&s.specs;
      var map={cpu:spec&&cpuText(spec.cpu&&{name:spec.cpu.name}),gpu:spec&&spec.gpus&&spec.gpus[0]&&spec.gpus[0].name,ram:spec&&spec.ram&&spec.ram.totalGb&&(spec.ram.totalGb+' GB')};
      var v=map[el.getAttribute('data-rig-live')];
      if(v)el.textContent=v;
    });
  }

  function schedule(ms){clearTimeout(timer);timer=setTimeout(poll,ms);}
  function poll(){
    if(document.hidden){schedule(5000);return;}
    var ctl=window.AbortController?new AbortController():null;
    var t=ctl?setTimeout(function(){ctl.abort();},8000):null;
    fetch('/api/rig',{headers:{Accept:'application/json'},cache:'no-store',signal:ctl?ctl.signal:undefined})
      .then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
      .then(function(s){failures=0;render(s);schedule(3000);})
      .catch(function(){
        failures++;
        if(failures>=2){statusEl.setAttribute('data-state','offline');text(statusText,'Live data unavailable');}
        schedule(Math.min(30000,3000*Math.pow(2,failures)));
      })
      .then(function(){if(t)clearTimeout(t);});
  }
  document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule(0);});
  poll();
})();
