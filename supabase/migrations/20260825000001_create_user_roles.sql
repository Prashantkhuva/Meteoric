create table if not exists public.user_roles (
  id bigint generated always as identity primary key,
  user_id bigint not null references auth.users(id) on delete cascade unique,
  role text not null check (role in ('superadmin', 'admin', 'speaker')),
  can_manage_users boolean not null default false,
  can_view_all_data boolean not null default true,
  can_send_emails boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

create policy "Superadmin can manage all user roles"
  on public.user_roles for all
  using (auth.role() = 'authenticated' and exists (
    select 1 from public.user_roles ur2 where ur2.user_id = auth.uid() and ur2.role = 'superadmin'
  ));

create policy "Users can view own role"
  on public.user_roles for select
  using (user_id = auth.uid());

create policy "Superadmin can insert user roles"
  on public.user_roles for insert
  with check (auth.role() = 'authenticated' and exists (
    select 1 from public.user_roles ur2 where ur2.user_id = auth.uid() and ur2.role = 'superadmin'
  ));

create policy "Superadmin can update own user role"
  on public.user_roles for update
  using (auth.role() = 'authenticated' and exists (
    select 1 from public.user_roles ur2 where ur2.user_id = auth.uid() and ur2.role = 'superadmin'
  ));

comment on table public.user_roles is 'Role-based access control for admin panel users: superadmin, admin, speaker';
comment on column public.user_roles.role is 'User role: superadmin (full access), admin (CRUD all data), speaker (view only)';
comment on column public.user_roles.can_manage_users is 'Can add/remove/change other users';
comment on column public.user_roles.can_view_all_data is 'Can view all leads/clients/proposals/invoices';
comment on column public.user_roles.can_send_emails is 'Can send proposal/invoice emails';
comment on column public.user_roles.onboarding_completed is 'Set to true after first password change';