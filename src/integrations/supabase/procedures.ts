import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

export type ProcedureRow = Tables<'procedures'>;
export type ProcedureInsert = TablesInsert<'procedures'>;
export type ProcedureUpdate = TablesUpdate<'procedures'>;

export async function listProcedures(params?: { search?: string; category?: string }) {
  let query = supabase.from('procedures').select('*').order('created_at', { ascending: false });
  if (params?.search && params.search.trim()) {
    query = query.ilike('name', `%${params.search.trim()}%`);
  }
  if (params?.category && params.category !== 'Todos') {
    query = query.eq('category', params.category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as ProcedureRow[];
}

export async function createProcedure(payload: { name: string; category: string; description?: string; risks?: string; contraindications?: string }) {
  const { data, error } = await supabase.from('procedures').insert(payload).select('*').single();
  if (error) throw error;
  return data as ProcedureRow;
}

export async function updateProcedureById(id: string, payload: { name: string; category: string; description?: string; risks?: string; contraindications?: string }) {
  const { data, error } = await supabase.from('procedures').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data as ProcedureRow;
}

export async function deleteProcedureById(id: string) {
  const { error } = await supabase.from('procedures').delete().eq('id', id);
  if (error) throw error;
  return true;
}
