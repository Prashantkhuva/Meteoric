-- Client onboarding checklist (Phase D). Server-side writes only (same pattern
-- as decisions): RLS enabled, no policies — web admin uses service role.

create table if not exists public.client_checklists (
  id bigint generated always as identity primary key,
  client_id bigint not null references public.clients(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_checklists_client_idx
  on public.client_checklists (client_id, position);

alter table public.client_checklists enable row level security;
