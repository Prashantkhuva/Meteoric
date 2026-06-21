create table if not exists proposals (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id bigint references leads(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  content jsonb,
  pricing jsonb default '[]'::jsonb,
  timeline text,
  terms text,
  sent_at timestamptz,
  viewed_at timestamptz
);

alter table proposals enable row level security;

create policy "Authenticated users can view proposals"
  on proposals for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert proposals"
  on proposals for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update proposals"
  on proposals for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete proposals"
  on proposals for delete
  using (auth.role() = 'authenticated');
