create table if not exists bank_accounts (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  label text not null,
  bank_name text,
  account_holder text not null,
  account_number text,
  iban text,
  swift_bic text,
  routing_number text,
  ifsc text,
  currency text not null default 'USD',
  country text,
  is_default boolean not null default false
);

alter table bank_accounts enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_accounts' and policyname = 'Authenticated users can view bank_accounts') then
    create policy "Authenticated users can view bank_accounts" on bank_accounts for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_accounts' and policyname = 'Authenticated users can insert bank_accounts') then
    create policy "Authenticated users can insert bank_accounts" on bank_accounts for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_accounts' and policyname = 'Authenticated users can update bank_accounts') then
    create policy "Authenticated users can update bank_accounts" on bank_accounts for update using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'bank_accounts' and policyname = 'Authenticated users can delete bank_accounts') then
    create policy "Authenticated users can delete bank_accounts" on bank_accounts for delete using (auth.role() = 'authenticated');
  end if;
end $$;
