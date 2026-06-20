create table if not exists leads (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  name text,
  email text,
  phone text,
  company text,
  services text,
  details text,
  budget text,
  status text not null default 'new'
);

create table if not exists clients (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  name text,
  email text,
  company text,
  status text not null default 'active'
);

alter table leads enable row level security;
alter table clients enable row level security;

create policy "Anyone can insert leads"
  on leads for insert
  with check (true);

create policy "Authenticated users can view leads"
  on leads for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update leads"
  on leads for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete leads"
  on leads for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can view clients"
  on clients for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert clients"
  on clients for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update clients"
  on clients for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete clients"
  on clients for delete
  using (auth.role() = 'authenticated');
