import worker from '../dist/worker.mjs';
const paths=['/','/projects/','/projects/svart-security/','/projects/jaethetech/','/projects/grey-signal/','/projects/hardware/','/expertise/','/expertise/hardware/','/expertise/development/','/about/','/about/journey/','/changelog/','/contact/','/assets/site.css','/assets/site.js','/sitemap.xml','/robots.txt','/assets/favicon.svg'];
let failed=false;
for(const p of paths){const res=await worker.fetch(new Request('https://jaegergrs.com'+p));const value=await res.text();if(res.status!==200||!value.trim()){console.error('FAIL',p,res.status);failed=true}else console.log('OK',p,res.status)}
for (const [p,expected] of [['/unknown/',404],['/index.html',308]]){const res=await worker.fetch(new Request('https://jaegergrs.com'+p));if(res.status!==expected){failed=true;console.error('FAIL',p,res.status)}else console.log('OK',p,res.status)}
const redirect=await worker.fetch(new Request('https://www.jaegergrs.com/projects/'));if(redirect.status!==308||redirect.headers.get('location')!=='https://jaegergrs.com/projects/')failed=true;
if(failed)process.exit(1);
