-- Shadow-mode AI decision log (Phase 2). Jev via OpenRouter, server-side only.
-- Pattern follows notifications: service-role writes via trusted server code,
-- RLS enabled with no policies — clients never touch this table directly;
-- reads go through /api/admin/decisions (auth-guarded, service role).

create table if not exists public.decisions (
  id bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('lead')),
  entity_id bigint not null,
  decision_type text not null check (decision_type in ('lead_triage')),
  result jsonb not null,
  confidence double precision not null check (confidence >= 0 and confidence <= 1),
  model text not null,
  model_version text,
  input_hash text not null,
  status text not null default 'shadow' check (status in ('shadow', 'applied', 'overridden')),
  verdict text check (verdict in ('agree', 'disagree')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists decisions_entity_idx
  on public.decisions (entity_type, entity_id, created_at desc);

create index if not exists decisions_created_at_idx
  on public.decisions (created_at desc);

alter table public.decisions enable row level security;

-- Accuracy aggregation for the web admin view (called with service role).
create or replace function public.decision_accuracy()
returns table (
  total bigint,
  reviewed bigint,
  agree bigint,
  disagree bigint,
  avg_confidence double precision
)
language sql
stable
as $$
  select
    count(*)::bigint,
    count(verdict)::bigint,
    count(*) filter (where verdict = 'agree')::bigint,
    count(*) filter (where verdict = 'disagree')::bigint,
    avg(confidence)::double precision
  from public.decisions;
$$;
