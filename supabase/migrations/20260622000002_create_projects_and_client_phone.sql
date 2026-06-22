alter table clients add column if not exists phone text;

create table if not exists projects (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id bigint references clients(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'planning',
  start_date date,
  deadline date,
  budget numeric(12,2),
  services text,
  notes text
);

alter table projects enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Authenticated users can view projects') then
    create policy "Authenticated users can view projects" on projects for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Authenticated users can insert projects') then
    create policy "Authenticated users can insert projects" on projects for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Authenticated users can update projects') then
    create policy "Authenticated users can update projects" on projects for update using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'projects' and policyname = 'Authenticated users can delete projects') then
    create policy "Authenticated users can delete projects" on projects for delete using (auth.role() = 'authenticated');
  end if;
end $$;
