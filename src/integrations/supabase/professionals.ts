import { supabase } from './client';

export type ProfessionalRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: 'Médico' | 'Dentista' | 'Biomédico' | 'enfermeiro' | 'Esteticista' | 'Farmaceutico' | 'Outros';
  created_at: string;
  updated_at: string;
};

export type CreateProfessionalInput = Omit<ProfessionalRow, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProfessionalInput = Partial<CreateProfessionalInput>;

export async function listProfessionals(params?: { search?: string; role?: string }) {
  let query = supabase
    .from('professionals')
    .select('*')
    .order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  let items = (data as ProfessionalRow[]);

  if (params?.search) {
    const s = params.search.toLowerCase();
    items = items.filter(
      (r) => r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || (r.phone || '').toLowerCase().includes(s)
    );
  }
  if (params?.role && params.role !== 'todos') {
    items = items.filter((r) => r.role === params.role);
  }
  return items;
}

export async function createProfessional(input: CreateProfessionalInput) {
  const { data, error } = await supabase
    .from('professionals')
    .insert([{ ...input }])
    .select()
    .single();
  if (error) throw error;
  return data as ProfessionalRow;
}

export async function updateProfessional(id: string, input: UpdateProfessionalInput) {
  const { data, error } = await supabase
    .from('professionals')
    .update({ ...input })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ProfessionalRow;
}

export async function deleteProfessional(id: string) {
  const { error } = await supabase.from('professionals').delete().eq('id', id);
  if (error) throw error;
  return true;
}
