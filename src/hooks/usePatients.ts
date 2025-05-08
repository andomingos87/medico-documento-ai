
import { useState, useMemo } from 'react';
import { Patient, FilterOptions } from '@/components/patients/types';

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '123.456.789-00',
    gender: 'male',
    birthDate: '1985-04-12',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    documents: [
      { id: 'd1', title: 'Termo de Consentimento - Cirurgia', type: 'consent', status: 'signed', createdAt: '2025-03-15T10:30:00Z' },
      { id: 'd2', title: 'Autorização de Tratamento', type: 'authorization', status: 'pending', createdAt: '2025-04-10T14:20:00Z' }
    ],
    createdAt: '2025-01-10T08:45:00Z',
    updatedAt: '2025-04-10T15:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    gender: 'female',
    birthDate: '1990-08-25',
    email: 'maria.oliveira@email.com',
    phone: '(11) 91234-5678',
    address: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 502',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100'
    },
    documents: [
      { id: 'd3', title: 'Termo de Consentimento - Procedimento Estético', type: 'consent', status: 'signed', createdAt: '2025-02-20T09:15:00Z' },
    ],
    createdAt: '2025-01-15T10:20:00Z',
    updatedAt: '2025-02-20T09:20:00Z'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    cpf: '456.789.123-00',
    gender: 'male',
    birthDate: '1978-12-03',
    email: 'carlos.mendes@email.com',
    phone: '(11) 97890-1234',
    address: {
      street: 'Rua Augusta',
      number: '567',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000'
    },
    documents: [],
    createdAt: '2025-03-05T14:10:00Z',
    updatedAt: '2025-03-05T14:10:00Z'
  },
  {
    id: '4',
    name: 'Ana Souza',
    cpf: '345.678.912-00',
    gender: 'female',
    birthDate: '1995-06-17',
    email: 'ana.souza@email.com',
    phone: '(11) 96543-2109',
    address: {
      street: 'Rua Oscar Freire',
      number: '789',
      complement: 'Bloco B, Apto 101',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426-001'
    },
    documents: [
      { id: 'd4', title: 'Termo de Consentimento - Exame', type: 'consent', status: 'expired', createdAt: '2025-01-05T11:45:00Z' },
      { id: 'd5', title: 'Declaração de Acompanhamento', type: 'declaration', status: 'draft', createdAt: '2025-04-20T16:30:00Z' }
    ],
    createdAt: '2025-02-01T09:30:00Z',
    updatedAt: '2025-04-20T16:35:00Z'
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    cpf: '234.567.891-00',
    gender: 'male',
    birthDate: '1982-09-30',
    email: 'roberto.almeida@email.com',
    phone: '(11) 95432-1098',
    address: {
      street: 'Alameda Santos',
      number: '456',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01419-000'
    },
    documents: [
      { id: 'd6', title: 'Autorização de Procedimento', type: 'authorization', status: 'signed', createdAt: '2025-03-25T13:20:00Z' },
    ],
    createdAt: '2025-02-10T11:15:00Z',
    updatedAt: '2025-03-25T13:25:00Z'
  }
];

export const usePatients = () => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    gender: 'all',
    dateRange: undefined,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const filteredPatients = useMemo(() => {
    return patients
      .filter(patient => {
        // Search filter
        if (filters.search && !patient.name.toLowerCase().includes(filters.search.toLowerCase()) && 
            !patient.cpf.includes(filters.search) &&
            !patient.email.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        
        // Gender filter
        if (filters.gender && filters.gender !== 'all' && patient.gender !== filters.gender) {
          return false;
        }
        
        // Date range filter
        if (filters.dateRange && filters.dateRange.from) {
          const patientDate = new Date(patient.createdAt);
          const fromDate = filters.dateRange.from;
          if (patientDate < fromDate) {
            return false;
          }
        }
        
        if (filters.dateRange && filters.dateRange.to) {
          const patientDate = new Date(patient.createdAt);
          const toDate = filters.dateRange.to;
          if (patientDate > toDate) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name') {
          return filters.sortDirection === 'asc' 
            ? a.name.localeCompare(b.name) 
            : b.name.localeCompare(a.name);
        } else {
          const dateA = new Date(a[filters.sortBy]).getTime();
          const dateB = new Date(b[filters.sortBy]).getTime();
          return filters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
      });
  }, [patients, filters]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getPatientById = (id: string) => {
    return patients.find(patient => patient.id === id);
  };

  return {
    patients: filteredPatients,
    filters,
    updateFilters,
    getPatientById
  };
};
