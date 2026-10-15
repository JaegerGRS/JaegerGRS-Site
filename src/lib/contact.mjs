import { str, json, readLimited } from './util.mjs';

const TOPICS = new Set(['Job or role', 'Project or collaboration', 'PC building or repair help', 'Buy the Rig API', 'Something else']);
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
const MAX_BODY = 12 * 1024;

const redirect = (origin, status) => new Response(null, { status: 303, headers: { Location: `${origin}/contact/?status=${status}#contact-form`, 'Cache-Control': 'no-store' } });

// Handles POST /api/contact. Accepts JSON (from the page script) or a plain form post (no-JS browsers, older TVs).
export async function handleContact(request, env) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const origin = new URL(request.url).origin;
  const reply = (status, code, message) => (wantsJson ? json({ ok: status < 300, code, message }, status) : redirect(origin, status < 300 ? (code === 'received' ? 'received' : 'sent') : code));

  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const from = request.headers.get('origin');
  if (!from || !allowed.includes(from)) return json({ ok: false, code: 'forbidden', message: 'Request origin not allowed.' }, 403);

  const raw = await readLimited(request, MAX_BODY);
  if (raw === null) return reply(413, 'too_large', 'That message is too large.');

  let data;
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/json')) data = JSON.parse(raw);
    else if (type.includes('application/x-www-form-urlencoded')) data = Object.fromEntries(new URLSearchParams(raw));
    else return reply(415, 'bad_request', 'Unsupported content type.');
  } catch { return reply(400, 'bad_request', 'Could not read that message.'); }
  if (!data || typeof data !== 'object') return reply(400, 'bad_request', 'Could not read that message.');

  // Bots fill the hidden field; pretend success so they learn nothing.
  if (str(data.website, 50)) return reply(200, 'sent', 'Thanks!');

  const name = str(data.name, 80);
  const email = str(data.email, 254);
  const topic = TOPICS.has(data.topic) ? data.topic : 'Something else';
  const message = String(data.message ?? '').replace(/\r\n?/g, '\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();

  if (name.length < 2) return reply(422, 'invalid_name', 'Please enter your name.');
  if (!EMAIL_RE.test(email)) return reply(422, 'invalid_email', 'Please enter a valid email address.');
  if (message.length < 10 || message.length > 4000) return reply(422, 'invalid_message', 'Please write a message between 10 and 4000 characters.');

  if (!env.CONTACT_TO || !env.CONTACT_FROM || (!env.EMAIL && !env.RESEND_API_KEY)) {
    return reply(503, 'not_configured', 'The contact form is not switched on yet. Please email me directly.');
  }

  if (env.GUARD) {
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const key = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|${env.GUARD_SALT || 'jgrs'}`)))]
      .slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
    const verdict = await env.GUARD.get(env.GUARD.idFromName(key)).fetch('https://guard/hit');
    if (verdict.status === 429) return reply(429, 'rate_limited', 'Too many messages. Please try again later.');
  }

  const subject = `[jaegergrs.com] ${topic} from ${name}`.replace(/[\r\n]+/g, ' ').slice(0, 150);
  const country = request.headers.get('cf-ipcountry') || '';
  const text = `New message from the jaegergrs.com contact form\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}${country ? `\nCountry: ${country}` : ''}\n\n${message}\n`;

  const inboxId = env.INBOX_DB ? crypto.randomUUID() : null;
  if (inboxId) {
    try {
      await env.INBOX_DB.prepare(
        'INSERT INTO inbox_messages (id, source, sender_name, sender_email, subject, body_text, received_at, notification_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ).bind(inboxId, 'contact_form', name, email, `[${topic}] ${name}`, message, Date.now(), 'pending').run();
    } catch (err) {
      console.error('contact inbox save failed', err?.name || 'Error');
      return reply(503, 'inbox_unavailable', 'Sorry, the form could not save your message. Please email me directly.');
    }
  }

  try {
    if (env.EMAIL) {
      await env.EMAIL.send({ to: env.CONTACT_TO, from: { email: env.CONTACT_FROM, name: 'JaegerGRS Website' }, replyTo: email, subject, text });
    } else {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: `JaegerGRS Website <${env.CONTACT_FROM}>`, to: [env.CONTACT_TO], reply_to: email, subject, text }),
      });
      if (!res.ok) throw new Error(`mail api ${res.status}`);
    }
  } catch (err) {
    console.error('contact send failed', err?.code || '', err?.message || err);
    if (inboxId) {
      try {
        await env.INBOX_DB.prepare('UPDATE inbox_messages SET notification_status = ? WHERE id = ?').bind('failed', inboxId).run();
      } catch (statusError) {
        console.error('contact notification status update failed', statusError?.name || 'Error');
      }
      return reply(200, 'received', 'Your message was received in the site inbox, but the email notification could not be sent. I will still see it here.');
    }
    return reply(502, 'send_failed', 'Sorry, that did not send. Please email me directly.');
  }
  if (inboxId) {
    try {
      await env.INBOX_DB.prepare('UPDATE inbox_messages SET notification_status = ? WHERE id = ?').bind('sent', inboxId).run();
    } catch (statusError) {
      console.error('contact notification status update failed', statusError?.name || 'Error');
    }
  }
  return reply(200, 'sent', 'Thanks! Your message has been sent.');
}
