insert into storage.buckets (id, name, public)
values ('email-attachments', 'email-attachments', false)
on conflict (id) do nothing;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated can upload email attachments') then
    create policy "Authenticated can upload email attachments"
      on storage.objects for insert
      with check (bucket_id = 'email-attachments' and auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated can read email attachments') then
    create policy "Authenticated can read email attachments"
      on storage.objects for select
      using (bucket_id = 'email-attachments' and auth.role() = 'authenticated');
  end if;
end $$;
