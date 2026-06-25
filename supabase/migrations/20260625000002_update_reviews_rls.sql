drop policy if exists "Anyone can view approved reviews" on reviews;

create policy "Anyone can view reviews"
  on reviews for select
  using (true);
