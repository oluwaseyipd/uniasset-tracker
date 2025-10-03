-- Safe migration that handles existing database objects
-- This migration checks for existing objects before creating them

-- Create enum for user roles (if not exists)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for asset status (if not exists)
DO $$ BEGIN
    CREATE TYPE public.asset_status AS ENUM ('active', 'missing', 'transferred', 'in_repair');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles (if not already enabled)
DO $$ BEGIN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles policies (if not exists)
DO $$ BEGIN
    CREATE POLICY "Users can view all profiles"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create departments table (if not exists)
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on departments (if not already enabled)
DO $$ BEGIN
    ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create departments policies (if not exists)
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view departments"
      ON public.departments FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can insert departments"
      ON public.departments FOR INSERT
      TO authenticated
      WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can update departments"
      ON public.departments FOR UPDATE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can delete departments"
      ON public.departments FOR DELETE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create assets table (if not exists)
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  purchase_date DATE NOT NULL,
  status asset_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on assets (if not already enabled)
DO $$ BEGIN
    ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create assets policies (if not exists)
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view assets"
      ON public.assets FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can insert assets"
      ON public.assets FOR INSERT
      TO authenticated
      WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can update assets"
      ON public.assets FOR UPDATE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can delete assets"
      ON public.assets FOR DELETE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create maintenance table (if not exists)
CREATE TABLE IF NOT EXISTS public.maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  type TEXT NOT NULL,
  technician TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on maintenance (if not already enabled)
DO $$ BEGIN
    ALTER TABLE public.maintenance ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create maintenance policies (if not exists)
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view maintenance records"
      ON public.maintenance FOR SELECT
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can insert maintenance records"
      ON public.maintenance FOR INSERT
      TO authenticated
      WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can update maintenance records"
      ON public.maintenance FOR UPDATE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated users can delete maintenance records"
      ON public.maintenance FOR DELETE
      TO authenticated
      USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create function to handle new user profile creation (replace if exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', profiles.name),
    email = NEW.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp (replace if exists)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_assets_updated_at ON public.assets;
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_maintenance_updated_at ON public.maintenance;
CREATE TRIGGER update_maintenance_updated_at
  BEFORE UPDATE ON public.maintenance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
