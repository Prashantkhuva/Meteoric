create table if not exists reviews (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  role text,
  company text,
  project text,
  rating int not null default 5,
  content text not null,
  status text not null default 'pending',
  is_verified boolean not null default false
);

alter table reviews enable row level security;

create policy "Anyone can insert reviews"
  on reviews for insert
  with check (true);

create policy "Anyone can view approved reviews"
  on reviews for select
  using (status = 'approved');

create policy "Authenticated users can view all reviews"
  on reviews for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update reviews"
  on reviews for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete reviews"
  on reviews for delete
  using (auth.role() = 'authenticated');
