(()=>{'use strict';
const year=document.querySelector('[data-year]');if(year)year.textContent=String(new Date().getFullYear());
const menu=document.querySelector('.menu-button'),nav=document.querySelector('#main-nav');
if(menu&&nav){const close=()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')};menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';nav.classList.toggle('is-open',!expanded);menu.setAttribute('aria-expanded',String(!expanded))});nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))close()})}
const filters=[...document.querySelectorAll('[data-filter]')],projects=[...document.querySelectorAll('.project-card[data-category]')],results=document.querySelector('#resultCount');
for(const button of filters){button.addEventListener('click',()=>{const current=button.dataset.filter;for(const control of filters){const on=control===button;control.classList.toggle('is-selected',on);control.setAttribute('aria-pressed',String(on))}let n=0;for(const item of projects){const display=current==='all'||item.dataset.category===current;item.hidden=!display;if(display)n++}if(results)results.textContent=n+' '+(n===1?'project':'projects')})}
})();
