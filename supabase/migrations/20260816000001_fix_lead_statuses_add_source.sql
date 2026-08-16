-- Migrate legacy lead statuses to the current pipeline
update leads set status = 'inquiry' where status = 'new';
update leads set status = 'discovery' where status = 'contacted';
update leads set status = 'proposal' where status = 'qualified';
update leads set status = 'completed' where status = 'won';

-- Add lead source attribution
alter table leads add column if not exists source text;
create index if not exists leads_source_idx on leads (source);