import { supabase } from './client';

// Mapeamento de status entre UI (pt-BR) e DB (en)
const statusMapUIToDB: Record<string, string> = {
  agendado: 'scheduled',
  confirmado: 'confirmed',
  cancelado: 'cancelled',
  concluido: 'completed',
};

const statusMapDBToUI: Record<string, 'agendado' | 'confirmado' | 'cancelado' | 'concluido'> = {
  scheduled: 'agendado',
  confirmed: 'confirmado',
  cancelled: 'cancelado',
  completed: 'concluido',
};

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
      patient:patients(id,name),
      professional:professionals(id,name),
      procedure:procedures(id,name)
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
    const dbStatus = (statusMapUIToDB as any)[status] || status;
    query = query.eq('status', dbStatus);
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
  // Converte status do DB (en) para UI (pt-BR)
  const normalized = (data as any[]).map((row) => ({
    ...row,
    status: (statusMapDBToUI as any)[row.status] || row.status,
  }));
  return normalized as unknown as Appointment[];
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
  // Deriva appointment_date (YYYY-MM-DD) a partir de scheduled_at
  const appointmentDate = values.scheduled_at
    ? (() => {
        const d = new Date(values.scheduled_at);
        // Usa componentes locais para manter a data do usuário
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      })()
    : undefined;
  // Deriva appointment_time (HH:MM:SS) a partir de scheduled_at
  const appointmentTime = values.scheduled_at
    ? (() => {
        const d = new Date(values.scheduled_at);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      })()
    : undefined;

  const payload: any = {
    duration_minutes: 60,
    notes: null,
    ...values,
    // Usa default do DB ('scheduled') se não vier status; caso venha, converte p/ DB
    ...(values.status ? { status: (statusMapUIToDB as any)[values.status] || values.status } : {}),
    ...(appointmentDate ? { appointment_date: appointmentDate } : {}),
    ...(appointmentTime ? { appointment_time: appointmentTime } : {}),
  };
  const { data, error } = await (supabase as any)
    .from('appointments')
    .insert(payload)
    .select(`
      id, patient_id, professional_id, procedure_id, scheduled_at, duration_minutes, status, notes, created_at, updated_at
    `)
    .single();
  if (error) throw error;
  // Normaliza status ao formato UI
  const normalized = { ...data, status: (statusMapDBToUI as any)[(data as any).status] || (data as any).status };
  return normalized as Appointment;
}

export type UpdateAppointment = Partial<NewAppointment>;

export async function updateAppointment(id: string, values: UpdateAppointment): Promise<Appointment> {
  // Se scheduled_at for atualizado, mantém appointment_date em sincronia
  const patch: any = { ...values };
  // Converte status para DB, se presente
  if (values.status) {
    patch.status = (statusMapUIToDB as any)[values.status] || values.status;
  }
  if (values.scheduled_at) {
    const d = new Date(values.scheduled_at);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    patch.appointment_date = `${y}-${m}-${day}`;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    patch.appointment_time = `${hh}:${mm}:${ss}`;
  }

  const { data, error } = await (supabase as any)
    .from('appointments')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  // Normaliza status ao formato UI
  const normalized = { ...data, status: (statusMapDBToUI as any)[(data as any).status] || (data as any).status };
  return normalized as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from('appointments')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
