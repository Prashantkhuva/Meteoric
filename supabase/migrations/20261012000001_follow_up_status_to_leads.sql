-- Follow-up status tracking: pending / completed / rescheduled / skipped.

alter table public.leads
  add column if not exists follow_up_status text;

alter table public.leads
  drop constraint if exists leads_follow_up_status_check;
alter table public.leads
  add constraint leads_follow_up_status_check
  check (
    follow_up_status is null
    or follow_up_status in ('pending', 'completed', 'rescheduled', 'skipped')
  );

-- Existing scheduled follow-ups start as pending.
update public.leads
set follow_up_status = 'pending'
where follow_up_at is not null and follow_up_status is null;
