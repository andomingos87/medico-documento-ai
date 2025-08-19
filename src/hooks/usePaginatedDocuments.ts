import { useEffect, useMemo, useState } from 'react';
import { listDocuments, deleteDocument, DocumentStatus, DocumentRow, ComprehensionLevel, DeliveryChannel } from '@/integrations/supabase/documents';

export type StatusFilter = 'all' | DocumentStatus;
export type ComprehensionFilter = 'all' | ComprehensionLevel;
export type ChannelFilter = 'all' | DeliveryChannel;

export function usePaginatedDocuments(initialPageSize = 12) {
  const [items, setItems] = useState<DocumentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [procedureId, setProcedureId] = useState<string | 'all'>('all');
  const [patientId, setPatientId] = useState<string | 'all'>('all');
  const [comprehension, setComprehension] = useState<ComprehensionFilter>('all');
  const [channel, setChannel] = useState<ChannelFilter>('all');
  const [expiresUntil, setExpiresUntil] = useState<string | null>(null); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const { items, total } = await listDocuments({
          search,
          status,
          page,
          pageSize,
          procedureId,
          patientId,
          comprehension,
          channel,
          expiresUntil,
        });
        if (!cancelled) {
          setItems(items);
          setTotal(total);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Erro ao carregar termos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const handle = setTimeout(run, 300); // debounce para busca
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(handle);
    };
  }, [search, status, page, pageSize, procedureId, patientId, comprehension, channel, expiresUntil]);

  const refetch = () => {
    // força re-execução alterando page para ela mesma
    setPage((p) => p);
  };

  const remove = async (id: string) => {
    await deleteDocument(id);
    // após deletar, se a página ficar vazia, retrocede uma página (quando possível)
    if (items.length === 1 && page > 1) setPage(page - 1);
    else refetch();
  };

  return {
    items,
    total,
    page,
    setPage,
    totalPages,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    procedureId,
    setProcedureId,
    patientId,
    setPatientId,
    comprehension,
    setComprehension,
    channel,
    setChannel,
    expiresUntil,
    setExpiresUntil,
    loading,
    error,
    refetch,
    remove,
    setItems,
    setTotal,
  };
}
