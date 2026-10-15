import PostalMime from 'postal-mime';

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9.-]{0,251}[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
const MAX_RAW = 128 * 1024;
const MAX_TEXT = 8 * 1024;
const clean = (value, max) => String(value || '').replace(/[\r\n\x00-\x1F\x7F]+/g, ' ').trim().slice(0, max);

function plainText(email) {
  if (email.text) return email.text.replace(/\r\n?/g, '\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return String(email.html || '')
    .replace(/<(br|\/p|\/div|\/li|\/tr)\b[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function receiveEmail(message, env) {
  if (!env.INBOX_DB || !env.CONTACT_FROM || !env.CONTACT_TO || !env.EMAIL) {
    message.setReject('The site inbox is temporarily unavailable.');
    return;
  }
  if (message.rawSize > MAX_RAW) {
    message.setReject('This message is too large for the site inbox.');
    return;
  }

  let email;
  try {
    email = await PostalMime.parse(message.raw, { attachmentEncoding: 'arraybuffer', maxNestingDepth: 12 });
  } catch (error) {
    console.error('incoming email parse failed', error?.name || 'Error');
    message.setReject('This message could not be processed.');
    return;
  }
  if (email.attachments.length) {
    message.setReject('The site inbox does not accept email attachments.');
    return;
  }

  const senderEmail = clean(message.from, 254);
  if (!EMAIL_RE.test(senderEmail)) {
    message.setReject('The sender address is invalid.');
    return;
  }
  const senderName = clean(email.from?.name, 120) || senderEmail;
  const subject = clean(email.subject || message.headers.get('subject'), 180) || '(no subject)';
  const body = plainText(email);
  if (!body || body.length > MAX_TEXT) {
    message.setReject('The message must contain no more than 8000 characters of plain text.');
    return;
  }

  const internetMessageId = clean(email.messageId || message.headers.get('message-id'), 500) || null;
  if (internetMessageId) {
    const duplicate = await env.INBOX_DB.prepare('SELECT id FROM inbox_messages WHERE internet_message_id = ?').bind(internetMessageId).first();
    if (duplicate) return;
  }

  const id = crypto.randomUUID();
  const receivedAt = Date.now();
  await env.INBOX_DB.prepare(
    'INSERT INTO inbox_messages (id, source, sender_name, sender_email, subject, body_text, received_at, notification_status, internet_message_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  ).bind(id, 'inbound_email', senderName, senderEmail, subject, body, receivedAt, 'pending', internetMessageId).run();

  try {
    await env.EMAIL.send({
      to: env.CONTACT_TO,
      from: { email: env.CONTACT_FROM, name: 'JaegerGRS Site Inbox' },
      replyTo: senderEmail,
      subject: `[Site inbox] ${subject}`.slice(0, 180),
      text: `New email received by the jaegergrs.com site inbox\n\nFrom: ${senderName} <${senderEmail}>\nSubject: ${subject}\n\n${body}\n`,
    });
    await env.INBOX_DB.prepare('UPDATE inbox_messages SET notification_status = ? WHERE id = ?').bind('sent', id).run();
  } catch (error) {
    console.error('incoming email alert failed', error?.code || error?.name || 'Error');
    await env.INBOX_DB.prepare('UPDATE inbox_messages SET notification_status = ? WHERE id = ?').bind('failed', id).run();
  }
}
