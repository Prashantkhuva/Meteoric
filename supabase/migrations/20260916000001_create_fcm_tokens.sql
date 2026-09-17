-- FCM tokens for push notifications
create table if not exists fcm_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- One token per device (unique constraint on token handles this)
create index if not exists idx_fcm_tokens_user on fcm_tokens(user_id);

-- RLS: users can only manage their own tokens
alter table fcm_tokens enable row level security;

create policy "Users can manage own FCM tokens"
  on fcm_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin service role bypass
create policy "Service role can manage all FCM tokens"
  on fcm_tokens for all
  using (true)
  with check (true);
