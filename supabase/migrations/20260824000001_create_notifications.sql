-- Notifications for the admin mobile/web panel.
-- Written exclusively via service-role client from trusted server code
-- (server actions + API routes). No RLS policies on purpose: clients never
-- touch this table directly; they go through /api/admin/notifications which
-- is auth-guarded and uses the service role.

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  type text not null check (
    type in ('new_lead', 'new_booking', 'payment_received', 'invoice_overdue')
  ),
  title text not null,
  body text,
  entity_type text,
  entity_id bigint,
  dedupe_key text unique,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_created_at_idx
  on public.notifications (created_at desc);

create index if not exists notifications_is_read_idx
  on public.notifications (is_read, created_at desc);

alter table public.notifications enable row level security;
