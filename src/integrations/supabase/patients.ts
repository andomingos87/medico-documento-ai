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
