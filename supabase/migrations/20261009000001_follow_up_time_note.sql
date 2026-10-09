-- Follow-up enhancements: time (IST) + short note for future reference,
-- plus a new notification type for follow-up reminders.

alter table public.leads
  add column if not exists follow_up_time text,
  add column if not exists follow_up_note text;

alter table public.leads
  drop constraint if exists leads_follow_up_time_format;
alter table public.leads
  add constraint leads_follow_up_time_format
  check (follow_up_time is null or follow_up_time ~ '^\d{2}:\d{2}$');

alter table public.notifications
  drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('new_lead', 'new_booking', 'payment_received', 'invoice_overdue', 'lead_follow_up'));
