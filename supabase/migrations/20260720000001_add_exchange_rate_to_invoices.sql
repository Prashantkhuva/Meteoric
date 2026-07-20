alter table invoices add column if not exists exchange_rate_to_usd numeric(12,6) not null default 1;

-- backfill existing invoices: USD=1, others get 1 for now (script will fix)
update invoices set exchange_rate_to_usd = 1 where currency = 'USD' or exchange_rate_to_usd = 1;
