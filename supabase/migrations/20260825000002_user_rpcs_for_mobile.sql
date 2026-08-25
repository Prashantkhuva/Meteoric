-- RPC: list all users with their roles (for mobile app; security definer bypasses RLS)
create or replace function public.list_users_with_roles()
returns table (
  user_id uuid,
  email text,
  full_name text,
  role text,
  can_manage_users boolean,
  can_send_emails boolean,
  onboarding_completed boolean,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    u.id as user_id,
    u.email,
    coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as full_name,
    ur.role,
    ur.can_manage_users,
    ur.can_send_emails,
    ur.onboarding_completed,
    u.created_at
  from auth.users u
  left join public.user_roles ur on ur.user_id = u.id
  where u.id in (
    select user_id from public.user_roles
    union
    select auth.uid()
  )
  order by
    case ur.role
      when 'superadmin' then 0
      when 'admin' then 1
      when 'speaker' then 2
      else 3
    end,
    u.created_at asc;
$$;

grant execute on function public.list_users_with_roles() to authenticated;

-- RPC: change a user's role (superadmin only)
create or replace function public.set_user_role(target_user_id uuid, new_role text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_superadmin boolean;
begin
  -- verify caller is superadmin
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'superadmin'
  ) into caller_is_superadmin;

  if not caller_is_superadmin then
    return json_build_object('error', 'Only superadmin can change roles');
  end if;

  if new_role not in ('superadmin', 'admin', 'speaker') then
    return json_build_object('error', 'Invalid role');
  end if;

  update public.user_roles
  set
    role = new_role,
    can_manage_users = (new_role = 'superadmin'),
    can_send_emails = (new_role <> 'speaker')
  where user_id = target_user_id;

  if not found then
    return json_build_object('error', 'User not found in user_roles');
  end if;

  return json_build_object('success', true);
end;
$$;

grant execute on function public.set_user_role(uuid, text) to authenticated;
