
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  documents: PatientDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientDocument {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'pending' | 'signed' | 'expired';
  createdAt: string;
}

export type FilterOptions = {
  search: string;
  gender?: 'male' | 'female' | 'other' | 'all' | '';
  dateRange?: { from: Date | undefined; to: Date | undefined };
  sortBy: 'name' | 'createdAt' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}
