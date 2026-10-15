(function(){
  var list=document.querySelector('[data-list]');
  var detail=document.querySelector('[data-detail]');
  var status=document.querySelector('[data-status]');
  var folder='inbox';
  var selected=null;
  var messages=[];

  function say(text,error){status.textContent=text||'';status.dataset.state=error?'error':'ok';}
  function el(tag,cls,text){var node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
  function date(value){return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}
  function request(path,options){
    options=options||{};
    options.headers=Object.assign({'Accept':'application/json'},options.headers||{});
    if(options.body)options.headers['Content-Type']='application/json';
    return fetch(path,options).then(function(r){return r.json().catch(function(){return{};}).then(function(data){if(!r.ok||!data.ok)throw new Error(data.code||'request_failed');return data;});});
  }
  function friendly(code){
    return {'not_configured':'The inbox is not configured yet.','unauthorized':'Your access has expired. Sign in again.','send_failed':'The reply was saved but email delivery failed. Try again after checking email configuration.','invalid_reply':'Write a reply before sending it.','inbox_unavailable':'The inbox is temporarily unavailable.'}[code]||'The request failed. Please try again.';
  }
  function load(){
    say('Loading messages…');
    list.replaceChildren();
    detail.replaceChildren(el('p','empty-detail','Choose a message to read it.'));
    selected=null;
    request('/api/inbox/messages'+(folder==='archived'?'?archived=1':'')).then(function(data){
      messages=data.messages||[];
      say(messages.length+' '+(messages.length===1?'message':'messages'));
      if(!messages.length){list.appendChild(el('p','empty-list','No messages here.'));return;}
      messages.forEach(function(item){
        var button=el('button','message-item'+(!item.read_at?' unread':''));
        button.type='button';
        button.setAttribute('aria-label',(item.read_at?'':'Unread: ')+item.sender_name+', '+item.subject+', '+date(item.received_at));
        button.appendChild(el('span','message-sender',item.sender_name));
        button.appendChild(el('time','message-date',date(item.received_at)));
        button.lastChild.dateTime=new Date(item.received_at).toISOString();
        button.appendChild(el('strong','message-subject',item.subject));
        button.appendChild(el('span','message-source',item.source==='inbound_email'?'Email':'Contact form'));
        button.appendChild(el('span','message-preview',item.preview));
        if(item.notification_status==='failed')button.appendChild(el('span','delivery-warning','Email alert failed; saved in inbox'));
        button.addEventListener('click',function(){openMessage(item.id);});
        list.appendChild(button);
      });
    }).catch(function(error){say(friendly(error.message),true);});
  }
  function actionButton(label,action,kind){
    var button=el('button','quiet-button'+(kind?' '+kind:''),label);
    button.type='button';
    button.addEventListener('click',action);
    return button;
  }
  function openMessage(id){
    selected=id;
    request('/api/inbox/messages/'+encodeURIComponent(id)).then(function(data){
      var item=data.message;
      detail.replaceChildren();
      var top=el('div','detail-top');
      var title=el('h2','',item.subject);
      top.appendChild(title);
      top.appendChild(el('p','detail-meta',item.sender_name+' · '+item.sender_email+' · '+date(item.received_at)));
      var actions=el('div','detail-actions');
      if(folder==='inbox')actions.appendChild(actionButton('Archive',function(){mutate('archive');}));
      else actions.appendChild(actionButton('Restore',function(){mutate('restore');}));
      actions.appendChild(actionButton('Delete',function(){if(window.confirm('Permanently delete this message and its replies?'))mutate('delete');},'danger'));
      top.appendChild(actions);
      detail.appendChild(top);
      var conversation=el('div','conversation');
      conversation.appendChild(el('pre','message-body',item.body_text));
      (data.replies||[]).forEach(function(reply){
        var entry=el('article','reply-entry');
        entry.appendChild(el('p','reply-meta','Your reply · '+date(reply.created_at)+' · '+reply.status));
        entry.appendChild(el('pre','message-body',reply.body_text));
        conversation.appendChild(entry);
      });
      detail.appendChild(conversation);
      if(folder==='inbox'){
        var form=el('form','reply-form');
        var label=el('label','','Reply by email');
        var textarea=el('textarea');
        textarea.name='body';textarea.required=true;textarea.maxLength=4000;textarea.rows=6;
        textarea.setAttribute('aria-describedby','reply-help');
        label.appendChild(textarea);
        form.appendChild(label);
        form.appendChild(el('p','reply-help','Sent from the configured site address. Replies return to the site inbox when Cloudflare Email Routing is enabled.'));
        var send=el('button','send-button','Send reply');
        send.type='submit';
        form.appendChild(send);
        form.addEventListener('submit',function(event){
          event.preventDefault();
          send.disabled=true;
          request('/api/inbox/messages/'+encodeURIComponent(id)+'/reply',{method:'POST',body:JSON.stringify({body:textarea.value})}).then(function(){
            say('Reply sent.');
            openMessage(id);
          }).catch(function(error){say(friendly(error.message),true);send.disabled=false;});
        });
        detail.appendChild(form);
      }
    }).catch(function(error){say(friendly(error.message),true);});
  }
  function mutate(action){
    if(!selected)return;
    request('/api/inbox/messages/'+encodeURIComponent(selected)+'/'+action,{method:'POST'}).then(function(){
      say(action==='delete'?'Message deleted.':action==='archive'?'Message archived.':'Message restored.');
      load();
    }).catch(function(error){say(friendly(error.message),true);});
  }

  document.querySelectorAll('[data-folder]').forEach(function(button){
    button.addEventListener('click',function(){
      folder=button.dataset.folder;
      document.querySelectorAll('[data-folder]').forEach(function(tab){tab.setAttribute('aria-pressed',String(tab===button));});
      load();
    });
  });
  document.querySelector('[data-refresh]').addEventListener('click',load);
  load();
})();
