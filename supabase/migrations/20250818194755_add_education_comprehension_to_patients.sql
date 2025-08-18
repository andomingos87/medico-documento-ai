-- Add education_level and comprehension_level to patients
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS education_level TEXT CHECK (education_level IN ('high_school', 'undergraduate', 'postgraduate')),
  ADD COLUMN IF NOT EXISTS comprehension_level TEXT CHECK (comprehension_level IN ('basic', 'intermediate', 'advanced'));

-- Optional: add comments for documentation
COMMENT ON COLUMN public.patients.education_level IS 'Nível de educação: high_school, undergraduate, postgraduate';
COMMENT ON COLUMN public.patients.comprehension_level IS 'Nível de compreensão: basic, intermediate, advanced';
