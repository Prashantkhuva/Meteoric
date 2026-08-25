-- Nuclear fix: drop ALL policies, rebuild without recursion.
-- Authorization (superadmin check) lives in server actions, NOT in RLS.
-- RLS only ensures users can read their own role row.
-- This avoids the recursive self-reference that caused 500 errors.

DO $$ DECLARE pol RECORD; BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'user_roles' AND schemaname = 'public'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.user_roles';
  END LOOP;
END $$;

-- 1. Authenticated users can read their own role row
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- 2. Authenticated users can insert (server actions enforce superadmin check)
CREATE POLICY "user_roles_insert_auth"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Authenticated users can update (server actions enforce superadmin check)
CREATE POLICY "user_roles_update_auth"
  ON public.user_roles FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Authenticated users can delete (server actions enforce superadmin check)
CREATE POLICY "user_roles_delete_auth"
  ON public.user_roles FOR DELETE
  USING (auth.uid() IS NOT NULL);
