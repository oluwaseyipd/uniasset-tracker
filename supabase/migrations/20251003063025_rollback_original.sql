-- Rollback script for the original migration
-- Run this if you want to completely remove the original schema and start fresh

-- Drop triggers first
DROP TRIGGER IF EXISTS update_maintenance_updated_at ON public.maintenance;
DROP TRIGGER IF EXISTS update_assets_updated_at ON public.assets;
DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop policies
DROP POLICY IF EXISTS "Authenticated users can delete maintenance records" ON public.maintenance;
DROP POLICY IF EXISTS "Authenticated users can update maintenance records" ON public.maintenance;
DROP POLICY IF EXISTS "Authenticated users can insert maintenance records" ON public.maintenance;
DROP POLICY IF EXISTS "Authenticated users can view maintenance records" ON public.maintenance;

DROP POLICY IF EXISTS "Authenticated users can delete assets" ON public.assets;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON public.assets;
DROP POLICY IF EXISTS "Authenticated users can insert assets" ON public.assets;
DROP POLICY IF EXISTS "Authenticated users can view assets" ON public.assets;

DROP POLICY IF EXISTS "Authenticated users can delete departments" ON public.departments;
DROP POLICY IF EXISTS "Authenticated users can update departments" ON public.departments;
DROP POLICY IF EXISTS "Authenticated users can insert departments" ON public.departments;
DROP POLICY IF EXISTS "Authenticated users can view departments" ON public.departments;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS public.maintenance;
DROP TABLE IF EXISTS public.assets;
DROP TABLE IF EXISTS public.departments;
DROP TABLE IF EXISTS public.profiles;

-- Drop enums
DROP TYPE IF EXISTS public.asset_status;
DROP TYPE IF EXISTS public.user_role;
