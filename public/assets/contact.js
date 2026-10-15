(function(){
  var form=document.querySelector('[data-contact-form]');
  if(!form||!window.fetch)return;
  form.noValidate=true; // the script shows its own accessible messages; the server validates again
  var status=form.querySelector('[data-form-status]');
  var btn=form.querySelector('button[type="submit"]');
  var started=Date.now();
  var stamp=form.querySelector('input[name="t"]');
  if(stamp)stamp.value=String(started);

  var msgs={
    invalid_name:'Please enter your name (at least 2 characters).',
    invalid_email:'Please enter a valid email address.',
    invalid_message:'Please write a message between 10 and 4000 characters.',
    rate_limited:'Too many messages. Please try again later.',
    not_configured:'The form is not switched on yet. Please email me directly.',
    too_large:'That message is too large.',
    inbox_unavailable:'The form could not save your message. Please email me directly.'
  };
  var generic='Sorry, that did not send. Please email me directly.';

  function say(msg,ok){
    status.textContent=msg;
    status.setAttribute('data-state',ok?'ok':'error');
    status.setAttribute('role',ok?'status':'alert');
  }
  function clearFieldErrors(){
    form.querySelectorAll('[aria-invalid]').forEach(function(f){f.removeAttribute('aria-invalid');f.removeAttribute('aria-describedby');});
  }
  function flag(field,msg){
    if(!field)return;
    field.setAttribute('aria-invalid','true');
    field.setAttribute('aria-describedby','form-status');
    say(msg,false);
    field.focus();
  }
  function fieldFor(code){return form.querySelector('[data-err="'+code+'"]');}
  function localCheck(){
    var n=form.elements.name,e=form.elements.email,m=form.elements.message;
    if(n.value.trim().length<2)return['invalid_name',n];
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.value.trim()))return['invalid_email',e];
    var len=m.value.trim().length;
    if(len<10||len>4000)return['invalid_message',m];
    return null;
  }
  form.addEventListener('input',function(ev){
    if(ev.target.getAttribute&&ev.target.getAttribute('aria-invalid')){ev.target.removeAttribute('aria-invalid');ev.target.removeAttribute('aria-describedby');}
  });

  // Result of a no-script form post, reported through the address.
  var q=/[?&]status=([a-z_]+)/.exec(location.search);
  if(q){
    var ok=q[1]==='sent'||q[1]==='received';
    say(q[1]==='received'?'Your message was received in the site inbox, but the email notification could not be sent. I will still see it here.':(ok?'Thanks! Your message has been sent. I will reply to the email you gave.':(msgs[q[1]]||generic)),ok);
    var bad=fieldFor(q[1]);if(bad&&!ok)flag(bad,msgs[q[1]]);
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(btn.getAttribute('aria-disabled')==='true')return;
    clearFieldErrors();
    var bad=localCheck();
    if(bad){flag(bad[1],msgs[bad[0]]);return;}
    if(Date.now()-started<2500){say('One moment, then press send again.',false);return;}
    var data={};
    new FormData(form).forEach(function(v,k){data[k]=v;});
    btn.setAttribute('aria-disabled','true');
    say('Sending…',true);
    fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(data)
    }).then(function(r){return r.json().catch(function(){return{};}).then(function(j){return{r:r,j:j};});})
    .then(function(x){
      if(x.r.ok&&x.j.ok){form.reset();btn.removeAttribute('aria-disabled');started=Date.now();if(stamp)stamp.value=String(started);say(x.j.message||'Thanks! Your message has been sent. I will reply to the email you gave.',true);}
      else{
        var field=fieldFor(x.j.code);
        btn.removeAttribute('aria-disabled');
        if(field)flag(field,msgs[x.j.code]);else say(msgs[x.j.code]||x.j.message||generic,false);
      }
    }).catch(function(){say('Could not reach the server. Check your connection, or email me directly. Your message is still in the form.',false);btn.removeAttribute('aria-disabled');});
  });
})();
