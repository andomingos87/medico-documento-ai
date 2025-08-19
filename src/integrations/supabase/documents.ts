import { supabase } from '@/integrations/supabase/client';

export type DocumentStatus = 'rascunho' | 'pendente' | 'assinado';
export type ComprehensionLevel = 'leigo' | 'tecnico' | 'avancado';
export type DeliveryChannel = 'email' | 'whatsapp';

export interface DocumentRow {
  id: string;
  title: string;
  document_type: string;
  status: DocumentStatus;
  patient: string | null; // legado (mantido para compat)
  created_at: string;
  updated_at: string;
  // Novos campos
  procedure_id?: string | null;
  patient_id?: string | null;
  comprehension_level?: ComprehensionLevel | null;
  delivery_channel?: DeliveryChannel | null;
  expires_at?: string | null; // YYYY-MM-DD
  // Relacionais (quando listado)
  procedure?: { id: string; name: string } | null;
  patient_ref?: { id: string; name: string } | null;
}

export interface ListDocumentsParams {
  search?: string;
  status?: DocumentStatus | 'all';
  page?: number;
  pageSize?: number;
  procedureId?: string | 'all';
  patientId?: string | 'all';
  comprehension?: ComprehensionLevel | 'all';
  channel?: DeliveryChannel | 'all';
  expiresUntil?: string | null; // YYYY-MM-DD
}

export interface ListDocumentsResult {
  items: DocumentRow[];
  total: number;
}

export async function listDocuments(params: ListDocumentsParams): Promise<ListDocumentsResult> {
  const {
    search = '',
    status = 'all',
    page = 1,
    pageSize = 12,
    procedureId = 'all',
    patientId = 'all',
    comprehension = 'all',
    channel = 'all',
    expiresUntil = null,
  } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = (supabase as any)
    .from('documents')
    .select(
      'id,title,document_type,status,patient,created_at,updated_at,procedure_id,patient_id,comprehension_level,delivery_channel,expires_at, procedure:procedures(id,name), patient_ref:patients(id,name)'
      , { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') query = query.eq('status', status);
  if (procedureId !== 'all') query = query.eq('procedure_id', procedureId);
  if (patientId !== 'all') query = query.eq('patient_id', patientId);
  if (comprehension !== 'all') query = query.eq('comprehension_level', comprehension);
  if (channel !== 'all') query = query.eq('delivery_channel', channel);
  if (expiresUntil) query = query.lte('expires_at', expiresUntil);

  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    // Busca por título e nome do paciente legado
    query = query.or(`title.ilike.${s},patient.ilike.${s}`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { items: (data as DocumentRow[]) || [], total: count || 0 };
}

export type NewDocumentPayload = {
  title: string;
  document_type: string;
  status: DocumentStatus;
  // campos novos/relacionais
  procedure_id?: string | null;
  patient_id?: string | null;
  comprehension_level?: ComprehensionLevel | null;
  delivery_channel?: DeliveryChannel | null;
  expires_at?: string | null; // YYYY-MM-DD
  // compat
  patient?: string | null;
};

export async function createDocument(payload: NewDocumentPayload): Promise<DocumentRow> {
  const { data, error } = await (supabase as any)
    .from('documents')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as DocumentRow;
}

export async function deleteDocument(id: string) {
  const { error } = await (supabase as any).from('documents').delete().eq('id', id);
  if (error) throw error;
}

export async function getDocument(id: string) {
  const { data, error } = await (supabase as any)
    .from('documents')
    .select('*, procedure:procedures(id,name), patient_ref:patients(id,name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as DocumentRow;
}

export async function updateDocument(
  id: string,
  payload: Partial<NewDocumentPayload>
) {
  const { data, error } = await (supabase as any)
    .from('documents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DocumentRow;
}
