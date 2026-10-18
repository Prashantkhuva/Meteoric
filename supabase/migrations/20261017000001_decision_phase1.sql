-- Decision Phase 1: source attribution, verdict reason codes, lead timeline.
-- probabilities/factors/usage_cost live inside decisions.result jsonb — no columns needed.

alter table public.decisions
  add column if not exists source text not null default 'jev'
  check (source in ('jev', 'rules'));

alter table public.decisions
  add column if not exists verdict_reason text
  check (verdict_reason is null
    or verdict_reason in ('wrong_quality','wrong_status',
       'wrong_category','spam_label_wrong','other'));

alter table public.leads
  add column if not exists timeline text;
