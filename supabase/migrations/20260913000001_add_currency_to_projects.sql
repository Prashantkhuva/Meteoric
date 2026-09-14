-- Add currency column to projects table
-- Projects inherit currency from the bank account / client context.
-- Default to 'INR' for the Indian market.

alter table projects add column if not exists currency text not null default 'INR';
