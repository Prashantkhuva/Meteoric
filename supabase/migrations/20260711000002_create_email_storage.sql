insert into storage.buckets (id, name, public)
values ('email-attachments', 'email-attachments', false)
on conflict (id) do nothing;

create policy "Authenticated can upload email attachments"
  on storage.objects for insert
  with check (bucket_id = 'email-attachments' and auth.role() = 'authenticated');

create policy "Authenticated can read email attachments"
  on storage.objects for select
  using (bucket_id = 'email-attachments' and auth.role() = 'authenticated');
