CREATE TABLE inbox_messages_new (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('contact_form', 'inbound_email')),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  read_at INTEGER,
  archived_at INTEGER,
  notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'failed')),
  internet_message_id TEXT UNIQUE
);

INSERT INTO inbox_messages_new (
  id, source, sender_name, sender_email, subject, body_text, received_at,
  read_at, archived_at, notification_status
)
SELECT
  id, source, sender_name, sender_email, subject, body_text, received_at,
  read_at, archived_at, notification_status
FROM inbox_messages;

CREATE TABLE inbox_replies_new (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL REFERENCES inbox_messages_new(id) ON DELETE CASCADE,
  body_text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed'))
);

INSERT INTO inbox_replies_new (id, message_id, body_text, created_at, status)
SELECT id, message_id, body_text, created_at, status FROM inbox_replies;

DROP TABLE inbox_replies;
DROP TABLE inbox_messages;
ALTER TABLE inbox_messages_new RENAME TO inbox_messages;
ALTER TABLE inbox_replies_new RENAME TO inbox_replies;

CREATE INDEX inbox_messages_received ON inbox_messages (archived_at, received_at DESC);
CREATE INDEX inbox_replies_message ON inbox_replies (message_id, created_at);
