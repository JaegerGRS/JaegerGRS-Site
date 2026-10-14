(function(){
  var form=document.querySelector('[data-contact-form]');
  if(!form||!window.fetch)return;
  var status=form.querySelector('[data-form-status]');
  var q=/[?&]status=([a-z_]+)/.exec(location.search);
  if(q){
    var msgs={sent:'Thanks! Your message has been sent.',invalid_email:'Please enter a valid email address.',invalid_name:'Please enter your name.',invalid_message:'Please write a message between 10 and 4000 characters.',rate_limited:'Too many messages. Please try again later.',not_configured:'The form is not switched on yet. Please email me directly.'};
    status.textContent=msgs[q[1]]||'Sorry, that did not send. Please email me directly.';
    status.setAttribute('data-state',q[1]==='sent'?'ok':'error');
  }
  var btn=form.querySelector('button[type="submit"]');
  var started=Date.now();
  var stamp=form.querySelector('input[name="t"]');
  if(stamp)stamp.value=String(started);

  function say(msg,ok){
    status.textContent=msg;
    status.setAttribute('data-state',ok?'ok':'error');
  }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    if(Date.now()-started<2500){say('One moment, then press send again.',false);return;}
    var data={};
    new FormData(form).forEach(function(v,k){data[k]=v;});
    btn.disabled=true;
    say('Sending…',true);
    fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(data)
    }).then(function(r){return r.json().catch(function(){return{};}).then(function(j){return{r:r,j:j};});})
    .then(function(x){
      if(x.r.ok&&x.j.ok){form.reset();say('Thanks! Your message has been sent. I will reply to the email you gave.',true);}
      else{say(x.j.message||'Sorry, that did not send. Please email me directly.',false);btn.disabled=false;}
    }).catch(function(){say('Could not reach the server. Please email me directly.',false);btn.disabled=false;});
  });
})();
