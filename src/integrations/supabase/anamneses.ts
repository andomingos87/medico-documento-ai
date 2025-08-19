import { supabase } from './client';

export type AnamnesisRow = {
  id: string;
  patient_id: string;
  patient_name: string;
  procedure_id: string;
  procedure_name: string;
  created_at: string;
  status: 'draft' | 'link_sent' | 'completed';
  medical_history: {
    continuousMedication: boolean;
    medicationAllergy: boolean;
  };
  aesthetics_history: {
    previousProcedures: boolean;
    complications: boolean;
  };
  expectations: string;
  awareness: string;
};

export type CreateAnamnesisInput = Omit<AnamnesisRow, 'id' | 'created_at'>;
export type UpdateAnamnesisInput = Partial<CreateAnamnesisInput>;

export async function listAnamneses(params?: { search?: string }) {
  let query = supabase.from('anamneses').select('*').order('created_at', { ascending: false });
  if (params?.search) {
    // Simple client-side filter after query
    const { data, error } = await query;
    if (error) throw error;
    const s = params.search.toLowerCase();
    return (data as AnamnesisRow[]).filter(
      (r) => r.patient_name.toLowerCase().includes(s) || r.procedure_name.toLowerCase().includes(s)
    );
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as AnamnesisRow[];
}

export async function createAnamnesis(input: CreateAnamnesisInput) {
  const { data, error } = await supabase
    .from('anamneses')
    .insert([{ ...input }])
    .select()
    .single();
  if (error) throw error;
  return data as AnamnesisRow;
}

export async function updateAnamnesis(id: string, input: UpdateAnamnesisInput) {
  const { data, error } = await supabase
    .from('anamneses')
    .update({ ...input })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as AnamnesisRow;
}

export async function deleteAnamnesis(id: string) {
  const { error } = await supabase.from('anamneses').delete().eq('id', id);
  if (error) throw error;
  return true;
}
