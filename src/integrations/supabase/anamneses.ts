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

export type AnamnesisWithPatient = AnamnesisRow & { 
  patient?: { 
    id: string; 
    name: string; 
    phone: string; 
    email: string; 
    birth_date: string; 
  } 
};

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

// Função para buscar anamnese por ID com dados do paciente
export async function getAnamnesisById(id: string): Promise<AnamnesisWithPatient | null> {
  const { data, error } = await supabase
    .from('anamneses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  // Buscar dados do paciente separadamente
  let patientData = null;
  if (data.patient_id) {
    try {
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('id, name, phone, email, birth_date')
        .eq('id', data.patient_id)
        .single();
      
      if (!patientError && patient) {
        patientData = patient;
      }
    } catch (err) {
      console.warn('Erro ao buscar dados do paciente:', err);
    }
  }
  
  return {
    ...data,
    patient: patientData
  } as AnamnesisWithPatient;
}

// Nova função centralizada para envio de links
export async function sendAnamnesisLink(anamnesisId: string, patientId: string, patientName: string, procedureId: string, procedureName: string, whatsapp: string) {
  // Formatar WhatsApp para E164
  const digits = whatsapp.replace(/\D/g, '');
  const whatsappE164 = digits.startsWith('55') ? digits : `55${digits}`;

  // Construir a URL do link
  const baseUrl = window.location.origin;
  const anamneseUrl = `${baseUrl}/anamnese?id=${anamnesisId}`;
  
  // Log para debug
  console.log('=== Enviando Link de Anamnese ===');
  console.log('Anamnese ID:', anamnesisId);
  console.log('URL gerada:', anamneseUrl);
  console.log('WhatsApp formatado:', whatsappE164);

  // Preparar o payload completo
  const payload = {
    patientId,
    patientName,
    procedureId,
    procedureName,
    whatsapp: whatsappE164,
    anamneseUrl,
    anamnesisId
  };

  console.log('Payload completo:', payload);

  // Enviar para o webhook
  const resp = await fetch('https://smart-termos-n8n.t9frad.easypanel.host/webhook/send-anamnese', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`Erro ao enviar link: ${resp.status} ${resp.statusText}`);
  }

  return { success: true, anamneseUrl };
}
