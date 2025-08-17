
import { useState, useEffect, useMemo } from 'react';
import { Patient, FilterOptions, CreatePatientData, UpdatePatientData } from '@/components/patients/types';
import { supabase } from '@/integrations/supabase/client';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    gender: 'all',
    dateRange: undefined,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  // Fetch patients from Supabase
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients((data || []) as Patient[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new patient
  const createPatient = async (patientData: CreatePatientData) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) throw error;
    
    setPatients(prev => [data as Patient, ...prev]);
    return data;
  };

  // Update patient
  const updatePatient = async (id: string, patientData: UpdatePatientData) => {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    setPatients(prev => prev.map(p => p.id === id ? data as Patient : p));
    return data;
  };

  // Soft delete patient
  const deletePatient = async (id: string) => {
    const { error } = await supabase
      .from('patients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
          const patientDate = new Date(patient.created_at);
          const fromDate = filters.dateRange.from;
          if (patientDate < fromDate) {
            return false;
          }
        }
        
        if (filters.dateRange && filters.dateRange.to) {
          const patientDate = new Date(patient.created_at);
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
          const dateA = new Date(a[filters.sortBy === 'createdAt' ? 'created_at' : filters.sortBy === 'updatedAt' ? 'updated_at' : a.created_at]).getTime();
          const dateB = new Date(b[filters.sortBy === 'createdAt' ? 'created_at' : filters.sortBy === 'updatedAt' ? 'updated_at' : b.created_at]).getTime();
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
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    isLoading,
    error,
    refetch: fetchPatients
  };
};
