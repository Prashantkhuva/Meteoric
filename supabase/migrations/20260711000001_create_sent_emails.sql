create table if not exists sent_emails (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  from_address text not null,
  to_addresses text[] not null,
  subject text not null,
  body text,
  attachments jsonb,
  resend_id text,
  status text not null default 'sent',
  lead_id bigint references leads(id),
  client_id bigint references clients(id)
);

alter table sent_emails enable row level security;

create policy "Authenticated can manage sent_emails"
  on sent_emails for all
  using (auth.role() = 'authenticated');
