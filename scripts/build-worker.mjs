import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const paths = ["index.html", "changelog.html", "assets/styles.css", "assets/main.js", "assets/favicon.svg", "robots.txt", "sitemap.xml"];
const files = Object.fromEntries(paths.map(p => ["/" + p, readFileSync(p, "utf8")]));
const runtime = `
const files = ${JSON.stringify(files)};
const types = {html:"text/html; charset=utf-8",css:"text/css; charset=utf-8",js:"text/javascript; charset=utf-8",svg:"image/svg+xml",txt:"text/plain; charset=utf-8",xml:"application/xml; charset=utf-8"};
export default { async fetch(req) {
 const u=new URL(req.url);
 if (u.hostname==="www.jaegergrs.com") return Response.redirect("https://jaegergrs.com"+u.pathname+u.search,308);
 if (!["GET","HEAD"].includes(req.method)) return new Response("Method not allowed",{status:405,headers:{"Allow":"GET, HEAD"}});
 let p=u.pathname;
 if (p==="/") p="/index.html";
 if (p==="/changelog") p="/changelog.html";
 if (!(p in files)) return new Response("Page not found",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8"}});
 const ext=p.split(".").pop();
 const h=new Headers({"Content-Type":types[ext]||"application/octet-stream","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Permissions-Policy":"camera=(), microphone=(), geolocation=()","Strict-Transport-Security":"max-age=31536000; includeSubDomains","Cache-Control":ext==="html"?"public, max-age=300":"public, max-age=1800"});
 if(ext==="html")h.set("Content-Security-Policy","default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
 return new Response(req.method==="HEAD"?null:files[p],{status:200,headers:h});
}};`;
mkdirSync("dist",{recursive:true});
writeFileSync("dist/worker.mjs",runtime,"utf8");
console.log("Built Cloudflare Worker using",paths.length,"site files");
