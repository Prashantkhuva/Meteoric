alter table invoices add column bank_account_id bigint references bank_accounts(id) on delete set null;
