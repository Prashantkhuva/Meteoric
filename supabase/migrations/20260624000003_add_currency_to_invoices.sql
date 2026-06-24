alter table invoices add column if not exists currency text not null default 'USD';
