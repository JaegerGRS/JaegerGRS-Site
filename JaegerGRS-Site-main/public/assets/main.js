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
