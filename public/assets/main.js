(function(){
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.getElementById('site-nav');
  if(toggle&&nav){
    const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});
    document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!toggle.contains(e.target))close();});
  }
  const year=document.getElementById('year');
  if(year)year.textContent=new Date().getFullYear();
  document.querySelectorAll('[data-years-since]').forEach(el=>{
    const n=new Date().getFullYear()-Number(el.getAttribute('data-years-since'));
    if(n>0)el.textContent=n;
  });
  const items=document.querySelectorAll('.reveal');
  const showAll=()=>items.forEach(i=>i.classList.add('in'));
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
    }),{threshold:.12});
    items.forEach(i=>io.observe(i));
    setTimeout(showAll,2500);
  }else{
    showAll();
  }
})();

(function(){
  var bar=document.querySelector('[data-filters]');
  var cards=document.querySelectorAll('[data-project-grid] [data-cat]');
  if(!bar||!cards.length)return;
  var sets=[['all','All projects'],['hardware','PC hardware'],['software','Software'],['systems','Systems'],['privacy','Privacy & security'],['ai','AI & automation'],['creative','Creative technology']];
  sets.forEach(function(s,i){
    var b=document.createElement('button');
    b.type='button';b.textContent=s[1];b.setAttribute('aria-pressed',i===0?'true':'false');
    b.addEventListener('click',function(){
      bar.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
      cards.forEach(function(c){c.hidden=!(s[0]==='all'||c.dataset.cat.split(' ').indexOf(s[0])>-1);});
    });
    bar.appendChild(b);
  });
})();