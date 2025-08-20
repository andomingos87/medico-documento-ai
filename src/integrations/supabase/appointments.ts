import { supabase } from './client';

export type AppointmentStatus = 'agendado' | 'confirmado' | 'cancelado' | 'concluido';

export type Appointment = {
  id: string;
  patient_id: string;
  professional_id: string | null;
  procedure_id: string | null;
  scheduled_at: string; // ISO datetime
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // denormalized joins
  patient?: { id: string; name: string };
  professional?: { id: string; name: string } | null;
  procedure?: { id: string; name: string } | null;
};

export type ListAppointmentsParams = {
  search?: string;
  status?: AppointmentStatus | 'todos';
  professionalId?: string | 'todos';
  from?: string; // ISO date
  to?: string;   // ISO date
  limit?: number;
  offset?: number;
};

export async function listAppointments(params: ListAppointmentsParams = {}): Promise<Appointment[]> {
  const { search, status, professionalId, from, to, limit = 50, offset = 0 } = params;

  let query = (supabase as any)
    .from('appointments')
    .select(`
      id, patient_id, professional_id, procedure_id, scheduled_at, duration_minutes, status, notes, created_at, updated_at,
      patient:patients!appointments_patient_id_fkey(id,name),
      professional:professionals!appointments_professional_id_fkey(id,name),
      procedure:procedures!appointments_procedure_id_fkey(id,name)
    `)
    .order('scheduled_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(
      `notes.ilike.${s},patient.name.ilike.${s},professional.name.ilike.${s}`
    );
  }
  if (status && status !== 'todos') {
    query = query.eq('status', status);
  }
  if (professionalId && professionalId !== 'todos') {
    query = query.eq('professional_id', professionalId);
  }
  if (from) {
    query = query.gte('scheduled_at', from);
  }
  if (to) {
    query = query.lte('scheduled_at', to);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as any) as Appointment[];
}

export type NewAppointment = {
  patient_id: string;
  professional_id?: string | null;
  procedure_id?: string | null;
  scheduled_at: string; // ISO datetime
  duration_minutes?: number;
  status?: AppointmentStatus;
  notes?: string | null;
};

export async function createAppointment(values: NewAppointment): Promise<Appointment> {
  const payload = { duration_minutes: 60, status: 'agendado', notes: null, ...values };
  const { data, error } = await (supabase as any)
    .from('appointments')
    .insert(payload)
    .select(`
      id, patient_id, professional_id, procedure_id, scheduled_at, duration_minutes, status, notes, created_at, updated_at
    `)
    .single();
  if (error) throw error;
  return data as Appointment;
}

export type UpdateAppointment = Partial<NewAppointment>;

export async function updateAppointment(id: string, values: UpdateAppointment): Promise<Appointment> {
  const { data, error } = await (supabase as any)
    .from('appointments')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('appointments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
