import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DocumentsFilterBar } from '@/components/documents/DocumentsFilterBar';
import { usePaginatedDocuments } from '@/hooks/usePaginatedDocuments';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewDocumentDialog } from '@/components/documents/NewDocumentDialog';
import { createDocument, updateDocument, type DocumentRow } from '@/integrations/supabase/documents';
import { DocumentsListTable } from '@/components/documents/DocumentsListTable';
import { EditDocumentDialog } from '@/components/documents/EditDocumentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Passa a usar dados reais do Supabase via hook

export const DocumentsList = () => {
  const navigate = useNavigate();
  const {
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
    refetch,
    loading,
    error,
    remove,
    setItems,
    setTotal,
  } = usePaginatedDocuments(12);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentRow | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Handlers para ações de documentos
  const handleViewDocument = (id: string) => {
    navigate(`/documentos/${id}`);
  };
  
  const handleEditDocument = (id: string) => {
    const item = items.find(i => i.id === id) || null;
    setEditingItem(item);
    setIsEditOpen(true);
  };
  
  const handleDeleteDocument = (id: string) => {
    setSelectedId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    // otimismo: remove da lista e decrementa o total
    const prevItems = items;
    setItems(prev => prev.filter((d: DocumentRow) => d.id !== selectedId));
    setTotal(t => Math.max(0, (t as number) - 1));
    remove(selectedId)
      .then(() => toast.success('Termo de consentimento excluído com sucesso!'))
      .catch((e) => {
        toast.error(e?.message ?? 'Erro ao excluir termo');
        // em caso de erro, refaz o fetch para voltar estado
        refetch();
      })
      .finally(() => {
        setIsDeleteAlertOpen(false);
        setSelectedId(null);
      });
  };

  const handleUpdate = async (values: any) => {
    if (!editingItem) return;
    try {
      const updated = await updateDocument(editingItem.id, {
        title: values.title,
        document_type: values.document_type,
        status: values.status,
        procedure_id: values.procedure_id ?? null,
        patient_id: values.patient_id ?? null,
        comprehension_level: values.comprehension_level ?? null,
        delivery_channel: values.delivery_channel ?? null,
        expires_at: values.expires_at ?? null,
      });
      // otimista: troca o item na lista
      setItems((prev: any[]) => prev.map(it => it.id === updated.id ? updated : it));
      toast.success('Termo atualizado com sucesso!');
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao atualizar termo');
      throw e;
    }
  };
  
  // assinatura é tratada em outra página; ação removida da lista

  const handleCreate = async (values: any) => {
    try {
      const created = await createDocument({
        title: values.title,
        document_type: values.document_type,
        status: values.status,
        procedure_id: values.procedure_id ?? null,
        patient_id: values.patient_id ?? null,
        comprehension_level: values.comprehension_level ?? null,
        delivery_channel: values.delivery_channel ?? null,
        expires_at: values.expires_at ?? null,
      });
      toast.success('Termo criado com sucesso!');
      // Atualização otimista: insere na lista atual
      setItems((prev: any[]) => [created, ...prev]);
      setTotal((t: number) => (isNaN(t) ? 1 : t + 1));
      // Reposiciona e sincroniza
      if (page !== 1) setPage(1);
      refetch();
    } catch (e: any) {
      toast.error(e?.message ?? 'Erro ao criar termo');
      throw e;
    }
  };

  const filteredDocuments = items; // já vem filtrado/paginado do hook
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Termos de Consentimento</h1>
          <p className="text-neutral-500 mt-1">
            Gerencie todos os termos de consentimento para procedimentos estéticos
          </p>
        </div>
        <div>
          <Button onClick={() => setIsNewOpen(true)}>
            <Plus className="mr-2" size={16} /> Novo termo
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4">
        <DocumentsFilterBar
          search={search}
          onSearch={setSearch}
          status={(status === 'all' ? 'Todos' : (status as any))}
          onStatus={(v) => setStatus(v === 'Todos' ? 'all' : v)}
          total={total}
          procedureId={(procedureId === 'all' ? 'Todos' : (procedureId as any))}
          onProcedureId={(v) => setProcedureId(v === 'Todos' ? 'all' : v)}
          patientId={(patientId === 'all' ? 'Todos' : (patientId as any))}
          onPatientId={(v) => setPatientId(v === 'Todos' ? 'all' : v)}
          comprehension={(comprehension === 'all' ? 'Todos' : (comprehension as any))}
          onComprehension={(v) => setComprehension(v === 'Todos' ? 'all' : v as any)}
          channel={(channel === 'all' ? 'Todos' : (channel as any))}
          onChannel={(v) => setChannel(v === 'Todos' ? 'all' : v as any)}
          expiresUntil={expiresUntil}
          onExpiresUntil={setExpiresUntil}
        />

        {loading ? (
          <div className="text-center py-12 text-neutral-500">Carregando...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <DocumentsListTable
            items={filteredDocuments}
            onView={handleViewDocument}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
          />
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} />
                </PaginationItem>
                {/* páginas simples: atual, anterior e próxima (quando aplicável) */}
                {page > 2 && (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1); }}>1</PaginationLink>
                  </PaginationItem>
                )}
                {page > 1 && (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(page - 1); }}>{page - 1}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href="#" isActive>{page}</PaginationLink>
                </PaginationItem>
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>{page + 1}</PaginationLink>
                  </PaginationItem>
                )}
                {page + 1 < totalPages && (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages); }}>{totalPages}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir termo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O termo será permanentemente removido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <NewDocumentDialog
          open={isNewOpen}
          onOpenChange={setIsNewOpen}
          onCreate={handleCreate}
        />

        <EditDocumentDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          initialValues={editingItem ? {
            title: editingItem.title,
            document_type: editingItem.document_type,
            status: editingItem.status,
            procedure_id: editingItem.procedure_id ?? null,
            patient_id: editingItem.patient_id ?? null,
            comprehension_level: editingItem.comprehension_level ?? null,
            delivery_channel: editingItem.delivery_channel ?? null,
            expires_at: editingItem.expires_at ?? null,
          } : {}}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};
