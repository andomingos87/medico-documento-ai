-- Align patients table schema with frontend expectations
BEGIN;

-- Add missing columns if not exists (no checks to avoid violating existing rows)
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT,
  ADD COLUMN IF NOT EXISTS number TEXT,
  ADD COLUMN IF NOT EXISTS complement TEXT,
  ADD COLUMN IF NOT EXISTS neighborhood TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS education_level TEXT,
  ADD COLUMN IF NOT EXISTS comprehension_level TEXT;

-- Rename understanding_level -> comprehension_level when applicable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'understanding_level'
  ) THEN
    -- If both columns exist, coalesce old into new then drop old
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'patients' AND column_name = 'comprehension_level'
    ) THEN
      UPDATE public.patients
        SET comprehension_level = COALESCE(comprehension_level, understanding_level)
        WHERE comprehension_level IS NULL;
      ALTER TABLE public.patients DROP COLUMN understanding_level;
    ELSE
      ALTER TABLE public.patients RENAME COLUMN understanding_level TO comprehension_level;
    END IF;
  END IF;
END$$;

-- Create unique index on cpf if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='patients' AND indexname='idx_patients_cpf'
  ) THEN
    CREATE UNIQUE INDEX idx_patients_cpf ON public.patients(cpf);
  END IF;
END$$;

-- Ensure RLS enabled (policies may already exist)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create basic policies if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='patients' AND policyname='Authenticated users can view patients'
  ) THEN
    CREATE POLICY "Authenticated users can view patients"
      ON public.patients FOR SELECT
      USING (auth.role() = 'authenticated' AND deleted_at IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='patients' AND policyname='Authenticated users can create patients'
  ) THEN
    CREATE POLICY "Authenticated users can create patients"
      ON public.patients FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='patients' AND policyname='Authenticated users can update patients'
  ) THEN
    CREATE POLICY "Authenticated users can update patients"
      ON public.patients FOR UPDATE
      USING (auth.role() = 'authenticated');
  END IF;
END$$;

-- Ensure timestamp function and trigger exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_patients_updated_at'
  ) THEN
    CREATE TRIGGER update_patients_updated_at
      BEFORE UPDATE ON public.patients
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

COMMIT;
