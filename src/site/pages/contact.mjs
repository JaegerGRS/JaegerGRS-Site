import { LI, XJ, FB, MAIL } from '../config.mjs';
import { ext, links, hero } from '../components.mjs';

export default [
{
  file: 'contact/index.html', section: 'contact',
  title: 'Contact', desc: 'Contact Jaeger Stratton about IT recruitment opportunities, technical roles and relevant project discussions. Email, LinkedIn or a short written form.',
  crumbs: [['Contact']],
  body: `${hero('Contact', 'Let\'s discuss <span class="gradient">an opportunity.</span>', "The form welcomes IT recruitment opportunities, technical roles and relevant project discussions. I am UK-based and open to remote, hybrid and international work.", `<div class="actions"><a class="btn primary" href="${MAIL}">Email me <span aria-hidden="true">↗</span></a><a class="btn secondary" href="${LI}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div>`)}
<section class="section container">
<div class="two"><div><p class="kicker">Send a message</p><h2 class="title">Write to me directly.</h2><p class="form-note">I'm autistic and I prefer written communication and remote or hybrid work, so a message here is the best way to reach me. I aim to reply by email.</p>
<div class="note" id="privacy"><strong>Privacy, in short.</strong> The site has no message database. Your name, email address, topic and message are processed by the Worker and sent as an email to my inbox, where they stay until I delete them. The email also includes the country Cloudflare detects for your connection. To limit spam, the Worker keeps a salted, shortened hash of your IP address and the times of recent messages for up to 24 hours. It does not keep the IP address itself. Cloudflare, which hosts the site and sends the email, and my email provider handle this data too, and Cloudflare keeps request logs whose retention I have not configured. I use your details only to reply to you.</div></div>
<form id="contact-form" class="form" method="post" action="/api/contact" data-contact-form>
<p class="fine">All fields are required. The topic has a default.</p>
<label>Your name<input name="name" data-err="invalid_name" type="text" autocomplete="name" required minlength="2" maxlength="80"></label>
<label>Your email<input name="email" data-err="invalid_email" type="email" autocomplete="email" required maxlength="254"></label>
<label>What is it about?<select name="topic"><option>Job or role</option><option>Project or collaboration</option><option>PC building or repair help</option><option>Buy the Rig API</option><option>Something else</option></select></label>
<label>Message<textarea name="message" data-err="invalid_message" rows="6" required minlength="10" maxlength="4000"></textarea></label>
<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="t" value="">
<button class="btn primary" type="submit">Send message <span aria-hidden="true">↗</span></button>
<p class="form-status" id="form-status" data-form-status role="status" aria-live="polite" tabindex="-1"></p>
<noscript><p class="form-note">Scripts are off, so the form will send as a normal page request. You can also <a href="${MAIL}">email me</a>.</p></noscript>
</form></div></section>
<section class="section container pt0">${links(`<a href="${MAIL}"><span>Email<small>jaegergrstratton@gmail.com</small></span><span class="ar">↗</span></a>`, ext(LI, 'LinkedIn', '/in/jaegergrs'), ext(XJ, 'X', '@JaegerGRS'), ext(FB, 'Facebook', 'JaegerGRStratton'), ext('https://github.com/JaegerGRS', 'GitHub', 'JaegerGRS'))}</section>`,
},
];
