
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string;
  email: string;
  phone: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  education_level?: 'high_school' | 'undergraduate' | 'postgraduate';
  comprehension_level?: 'basic' | 'intermediate' | 'advanced';
  documents?: PatientDocument[];
  created_at: string;
  updated_at: string;
}

export interface PatientDocument {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  created_at: string;
}

export interface CreatePatientData {
  name: string;
  cpf: string;
  gender: 'male' | 'female' | 'other';
  birth_date: string;
  email: string;
  phone: string;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  education_level?: 'high_school' | 'undergraduate' | 'postgraduate' | null;
  comprehension_level?: 'basic' | 'intermediate' | 'advanced' | null;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {}

export type FilterOptions = {
  search: string;
  gender?: 'male' | 'female' | 'other' | 'all' | '';
  dateRange?: { from: Date | undefined; to: Date | undefined };
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}
