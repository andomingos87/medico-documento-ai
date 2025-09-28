import { supabase } from './client';
import type { Tables } from './types';

export type PatientRow = Tables<'patients'>;

export async function listPatients(params?: { search?: string }) {
  let query = supabase.from('patients').select('id,name').order('name', { ascending: true });
  if (params?.search && params.search.trim()) {
    query = query.ilike('name', `%${params.search.trim()}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as Pick<PatientRow, 'id' | 'name'>[]) || [];
}

// Nova função para obter dados completos do paciente
export async function getPatientById(id: string): Promise<PatientRow | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  
  return data as PatientRow;
}
