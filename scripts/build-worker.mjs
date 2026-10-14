import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
const root=process.cwd();
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const file=join(dir,entry.name);if(entry.isDirectory())return entry.name==='dist'||entry.name==='.git'||entry.name==='node_modules'?[]:walk(file);return [file]})}
const wanted=new Set(['.html','.css','.js','.svg','.txt','.xml']);
const files={};
for(const f of walk(root)){
 const rel=relative(root,f).replaceAll('\\','/');
 if((rel.startsWith('assets/')||rel==='index.html'||rel==='404.html'||rel==='robots.txt'||rel==='sitemap.xml'||rel.startsWith('projects/')||rel.startsWith('expertise/')||rel.startsWith('about/')||rel.startsWith('changelog/')||rel.startsWith('contact/'))&&wanted.has(extname(f))){files['/'+rel]=readFileSync(f,'utf8')}
}
if(!files['/index.html']||!files['/projects/index.html']||!files['/404.html'])throw new Error('Required pages are missing');
const worker=`const files=${JSON.stringify(files)};
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',svg:'image/svg+xml',txt:'text/plain; charset=utf-8',xml:'application/xml; charset=utf-8'};
export default {async fetch(req){
 const u=new URL(req.url);
 if(u.hostname==='www.jaegergrs.com')return Response.redirect('https://jaegergrs.com'+u.pathname+u.search,308);
 if(req.method!=='GET'&&req.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 let path=u.pathname;
 if(path==='/')path='/index.html';
 else if(path.endsWith('/'))path+='index.html';
 else if(path==='/404')path='/404.html';
 else if(!path.includes('.',path.lastIndexOf('/')+1))path+='/index.html';
 if(path==='/index.html'&&u.pathname==='/index.html')return Response.redirect(u.origin+'/',308);
 const found=Object.hasOwn(files,path),key=found?path:'/404.html';
 const ext=key.slice(key.lastIndexOf('.')+1);
 const headers=new Headers({'Content-Type':mime[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Strict-Transport-Security':'max-age=31536000; includeSubDomains','Cache-Control':ext==='html'?'public, max-age=180':'public, max-age=900'});
 if(ext==='html')headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
 return new Response(req.method==='HEAD'?null:files[key],{status:found?200:404,headers});
}}`;
mkdirSync(join(root,'dist'),{recursive:true});
writeFileSync(join(root,'dist/worker.mjs'),worker);
console.log('Worker prepared with',Object.keys(files).length,'files,',worker.length,'characters');
