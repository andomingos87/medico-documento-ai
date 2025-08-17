-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (since this is a medical system, all authenticated users can access patients)
CREATE POLICY "Authenticated users can view patients" 
ON public.patients 
FOR SELECT 
USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

CREATE POLICY "Authenticated users can create patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" 
ON public.patients 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can soft delete patients" 
ON public.patients 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_patients_cpf ON public.patients(cpf);
CREATE INDEX idx_patients_email ON public.patients(email);
CREATE INDEX idx_patients_name ON public.patients(name);
CREATE INDEX idx_patients_deleted_at ON public.patients(deleted_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();