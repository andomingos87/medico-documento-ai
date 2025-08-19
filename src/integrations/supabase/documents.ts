import { supabase } from '@/integrations/supabase/client';

export type DocumentStatus = 'rascunho' | 'pendente' | 'assinado';

export interface DocumentRow {
  id: string;
  title: string;
  document_type: string;
  status: DocumentStatus;
  patient: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListDocumentsParams {
  search?: string;
  status?: DocumentStatus | 'all';
  page?: number;
  pageSize?: number;
}

export interface ListDocumentsResult {
  items: DocumentRow[];
  total: number;
}

export async function listDocuments(params: ListDocumentsParams): Promise<ListDocumentsResult> {
  const { search = '', status = 'all', page = 1, pageSize = 12 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = (supabase as any)
    .from('documents')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  if (search?.trim()) {
    // Busca simples por título ou paciente (ilike)
    const s = `%${search.trim()}%`;
    query = query.or(`title.ilike.${s},patient.ilike.${s}`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return { items: (data as DocumentRow[]) || [], total: count || 0 };
}

export async function deleteDocument(id: string) {
  const { error } = await (supabase as any).from('documents').delete().eq('id', id);
  if (error) throw error;
}

export async function getDocument(id: string) {
  const { data, error } = await (supabase as any).from('documents').select('*').eq('id', id).single();
  if (error) throw error;
  return data as DocumentRow;
}

export async function updateDocument(id: string, payload: Partial<Pick<DocumentRow, 'title' | 'status' | 'document_type' | 'patient'>>) {
  const { data, error } = await (supabase as any)
    .from('documents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as DocumentRow;
}
