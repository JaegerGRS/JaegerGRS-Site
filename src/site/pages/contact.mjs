import { LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, links, hero } from '../components.mjs';

export default [
{
  file: 'contact/index.html', section: 'contact',
  title: 'Contact', desc: 'Contact Jaeger Stratton about IT technician, PC assembly and technical support roles or development projects.',
  crumbs: [['Contact']],
  body: `${hero('Contact', 'Have an opportunity<br><span class="gradient">or project in mind?</span>', "I'm open to conversations about IT technician, PC assembly and technical support roles, and relevant development projects.", `<div class="actions"><a class="btn primary" href="${MAIL}">Email me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${LI}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>`)}
<section class="section container">
<div class="two"><div><p class="kicker">Send a message</p><h2 class="title">Write to me directly.</h2><p class="form-note">I'm autistic and I prefer written communication and remote or hybrid work, so a message here is the best way to reach me. Your details are only used to reply to you. The site keeps no message database, but your message is sent by email through a third-party mail provider, and the Worker keeps short-lived anonymous counters to limit spam.</p></div>
<form id="contact-form" class="form" method="post" action="/api/contact" data-contact-form>
<label>Your name<input name="name" type="text" autocomplete="name" required minlength="2" maxlength="80"></label>
<label>Your email<input name="email" type="email" autocomplete="email" required maxlength="254"></label>
<label>What is it about?<select name="topic"><option>Job or role</option><option>Project or collaboration</option><option>PC building or repair help</option><option>Buy the Rig API</option><option>Something else</option></select></label>
<label>Message<textarea name="message" rows="6" required minlength="10" maxlength="4000"></textarea></label>
<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="t" value="">
<button class="btn primary" type="submit">Send message <span aria-hidden="true">↗</span></button>
<p class="form-status" data-form-status role="status" aria-live="polite"></p>
<noscript><p class="form-note">Scripts are off, so the form will send as a normal page request. You can also <a href="${MAIL}">email me</a>.</p></noscript>
</form></div></section>
<section class="section container pt0">${links(`<a href="${MAIL}"><span>Email<small>jaegergrstratton@gmail.com</small></span><span class="ar">↗</span></a>`, ext(LI, 'LinkedIn', '/in/jaegergrs'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'))}</section>`,
},
];
