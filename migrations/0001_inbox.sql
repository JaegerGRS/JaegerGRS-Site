CREATE TABLE IF NOT EXISTS inbox_messages (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('contact_form')),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  read_at INTEGER,
  archived_at INTEGER,
  notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (notification_status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS inbox_messages_received
  ON inbox_messages (archived_at, received_at DESC);

CREATE TABLE IF NOT EXISTS inbox_replies (
  id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL REFERENCES inbox_messages(id) ON DELETE CASCADE,
  body_text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS inbox_replies_message
  ON inbox_replies (message_id, created_at);
