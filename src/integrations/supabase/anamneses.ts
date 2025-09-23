import { supabase } from './client';

export type AnamnesisRow = {
  id: string;
  patient_id: string;
  patient_name: string;
  procedure_id: string;
  procedure_name: string;
  created_at: string;
  status: 'draft' | 'link_sent' | 'completed';
  // The following fields may not exist in some deployments; treat as optional
  medical_history?: {
    continuousMedication: boolean;
    medicationAllergy: boolean;
    chronicDisease?: string;
    chronicDiseaseOther?: string;
    medicationAllergyDescription?: string;
    reactionToProcedures?: string;
    painTolerance?: string;
    awareResultsVary?: boolean;
  } | null;
  aesthetics_history?: {
    previousProcedures: boolean;
    complications: boolean;
    previousFacialProcedureOption?: string;
    previousFacialProcedureOther?: string;
    complicationsDescription?: string;
  } | null;
  expectations?: string | null;
  awareness?: string | null;
};

export type CreateAnamnesisInput = {
  patient_id: string;
  patient_name: string;
  procedure_id: string;
  procedure_name: string;
  status?: 'draft' | 'link_sent' | 'completed';
  medical_history?: AnamnesisRow['medical_history'];
  aesthetics_history?: AnamnesisRow['aesthetics_history'];
  expectations?: string | null;
  awareness?: string | null;
};
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
  // Only send columns that are defined to avoid schema mismatches
  const payload: Record<string, any> = {
    patient_id: input.patient_id,
    patient_name: input.patient_name,
    procedure_id: input.procedure_id,
    procedure_name: input.procedure_name,
  };
  if (input.status) payload.status = input.status;
  if (input.medical_history !== undefined) payload.medical_history = input.medical_history;
  if (input.aesthetics_history !== undefined) payload.aesthetics_history = input.aesthetics_history;
  if (input.expectations !== undefined) payload.expectations = input.expectations;
  if (input.awareness !== undefined) payload.awareness = input.awareness;

  const { data, error } = await supabase
    .from('anamneses')
    .insert([payload])
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
