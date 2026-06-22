create table if not exists invoices (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id bigint references clients(id) on delete set null,
  proposal_id bigint references proposals(id) on delete set null,
  invoice_number text not null,
  status text not null default 'draft',
  items jsonb default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  terms text,
  due_date date,
  sent_at timestamptz,
  paid_at timestamptz,
  viewed_at timestamptz
);

alter table invoices enable row level security;

create policy "Authenticated users can view invoices"
  on invoices for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert invoices"
  on invoices for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update invoices"
  on invoices for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete invoices"
  on invoices for delete
  using (auth.role() = 'authenticated');
