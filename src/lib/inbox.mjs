import { json, readLimited } from './util.mjs';
import { authorizeInbox } from './inbox-auth.mjs';

const MAX_REPLY = 8 * 1024;
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const result = (body, status = 200) => json(body, status, { 'Cache-Control': 'no-store' });

function validWriteOrigin(request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}

export async function handleInbox(request, env) {
  const identity = await authorizeInbox(request, env);
  if (identity === 'not_configured') return result({ ok: false, code: 'not_configured' }, 503);
  if (identity === 'unavailable') return result({ ok: false, code: 'auth_unavailable' }, 503);
  if (identity === 'unauthorized') return result({ ok: false, code: 'unauthorized' }, 401);
  if (!env.INBOX_DB) return result({ ok: false, code: 'not_configured' }, 503);

  const url = new URL(request.url);
  const path = url.pathname.slice('/api/inbox'.length).replace(/\/+$/, '') || '/';

  if (request.method === 'GET' && path === '/messages') {
    const archived = url.searchParams.get('archived') === '1';
    const { results } = await env.INBOX_DB.prepare(
      `SELECT id, source, sender_name, sender_email, subject, substr(body_text, 1, 180) AS preview, received_at, read_at, notification_status
       FROM inbox_messages WHERE archived_at IS ${archived ? 'NOT NULL' : 'NULL'}
       ORDER BY received_at DESC LIMIT 100`,
    ).all();
    return result({ ok: true, messages: results });
  }

  const match = /^\/messages\/([0-9a-f-]+)(?:\/(read|archive|restore|delete|reply))?$/.exec(path);
  if (!match || !ID_RE.test(match[1])) return result({ ok: false, code: 'not_found' }, 404);
  const [, id, action] = match;

  if (request.method === 'GET' && !action) {
    const message = await env.INBOX_DB.prepare('SELECT * FROM inbox_messages WHERE id = ?').bind(id).first();
    if (!message) return result({ ok: false, code: 'not_found' }, 404);
    await env.INBOX_DB.prepare('UPDATE inbox_messages SET read_at = COALESCE(read_at, ?) WHERE id = ?').bind(Date.now(), id).run();
    const { results: replies } = await env.INBOX_DB.prepare(
      'SELECT id, body_text, created_at, status FROM inbox_replies WHERE message_id = ? ORDER BY created_at ASC',
    ).bind(id).all();
    return result({ ok: true, message: { ...message, read_at: message.read_at || Date.now() }, replies });
  }

  if (!['read', 'archive', 'restore', 'delete', 'reply'].includes(action || '') || request.method !== 'POST') {
    return result({ ok: false, code: 'method_not_allowed' }, 405);
  }
  if (!validWriteOrigin(request)) return result({ ok: false, code: 'forbidden' }, 403);

  if (action === 'read') {
    await env.INBOX_DB.prepare('UPDATE inbox_messages SET read_at = ? WHERE id = ?').bind(Date.now(), id).run();
    return result({ ok: true });
  }
  if (action === 'archive' || action === 'restore') {
    const value = action === 'archive' ? Date.now() : null;
    const updated = await env.INBOX_DB.prepare('UPDATE inbox_messages SET archived_at = ? WHERE id = ?').bind(value, id).run();
    if (!updated.meta.changes) return result({ ok: false, code: 'not_found' }, 404);
    return result({ ok: true });
  }
  if (action === 'delete') {
    const deleted = await env.INBOX_DB.prepare('DELETE FROM inbox_messages WHERE id = ?').bind(id).run();
    if (!deleted.meta.changes) return result({ ok: false, code: 'not_found' }, 404);
    return result({ ok: true });
  }

  if (!env.EMAIL || !env.CONTACT_FROM || !env.CONTACT_TO) return result({ ok: false, code: 'not_configured' }, 503);
  const message = await env.INBOX_DB.prepare('SELECT * FROM inbox_messages WHERE id = ?').bind(id).first();
  if (!message) return result({ ok: false, code: 'not_found' }, 404);

  const raw = await readLimited(request, MAX_REPLY);
  if (raw === null) return result({ ok: false, code: 'too_large' }, 413);
  let data;
  try {
    if (!(request.headers.get('content-type') || '').includes('application/json')) throw new Error('Unsupported content type');
    data = JSON.parse(raw);
  } catch {
    return result({ ok: false, code: 'bad_request' }, 400);
  }
  const body = typeof data?.body === 'string' ? data.body.replace(/\r\n?/g, '\n').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim() : '';
  if (body.length < 1 || body.length > 4000) return result({ ok: false, code: 'invalid_reply' }, 422);

  const replyId = crypto.randomUUID();
  const createdAt = Date.now();
  await env.INBOX_DB.prepare(
    'INSERT INTO inbox_replies (id, message_id, body_text, created_at, status) VALUES (?, ?, ?, ?, ?)',
  ).bind(replyId, id, body, createdAt, 'pending').run();

  const subject = `Re: ${message.subject}`.replace(/[\r\n]+/g, ' ').slice(0, 150);
  try {
    await env.EMAIL.send({
      to: message.sender_email,
      from: { email: env.CONTACT_FROM, name: 'Jaeger Stratton' },
      replyTo: env.INBOX_REPLY_TO || env.CONTACT_TO,
      subject,
      text: `${body}\n\n— Jaeger Stratton\n${env.CONTACT_TO}`,
    });
  } catch (error) {
    await env.INBOX_DB.prepare('UPDATE inbox_replies SET status = ? WHERE id = ?').bind('failed', replyId).run();
    console.error('inbox reply failed', error?.code || error?.name || 'Error');
    return result({ ok: false, code: 'send_failed' }, 502);
  }
  await env.INBOX_DB.prepare('UPDATE inbox_replies SET status = ? WHERE id = ?').bind('sent', replyId).run();
  return result({ ok: true, reply: { id: replyId, body_text: body, created_at: createdAt, status: 'sent' } });
}
