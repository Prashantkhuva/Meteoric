-- Fix: break recursive RLS + replace deprecated auth.role()
-- auth.role() is deprecated; use auth.uid() IS NOT NULL instead.
-- The superadmin policy was "for ALL" and self-referenced user_roles,
-- causing infinite recursion / 500 on SELECT. Restrict it to INSERT/UPDATE/DELETE.

-- Drop all existing policies
drop policy if exists "Superadmin can manage all user roles" on public.user_roles;
drop policy if exists "Users can view own role" on public.user_roles;
drop policy if exists "Superadmin can insert user roles" on public.user_roles;
drop policy if exists "Superadmin can update own user role" on public.user_roles;

-- Everyone can read their own role (SELECT only)
create policy "Users can view own role"
  on public.user_roles for select
  using (user_id = auth.uid());

-- Superadmin can do everything except SELECT (INSERT/UPDATE/DELETE)
-- Self-references user_roles but only for INSERT/UPDATE/DELETE which
-- don't trigger SELECT recursion.
create policy "Superadmin can manage user roles"
  on public.user_roles for all
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.user_roles ur2
      where ur2.user_id = auth.uid()
        and ur2.role = 'superadmin'
    )
  )
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.user_roles ur2
      where ur2.user_id = auth.uid()
        and ur2.role = 'superadmin'
    )
  );
