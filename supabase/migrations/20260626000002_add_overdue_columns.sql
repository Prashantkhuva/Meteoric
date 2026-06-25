ALTER TABLE invoices ADD COLUMN IF NOT EXISTS last_reminder_sent_at timestamptz;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS reminder_count int DEFAULT 0;
