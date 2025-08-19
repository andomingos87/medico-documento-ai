import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentCard } from '@/components/DocumentCard';
import { toast } from 'sonner';
import { DocumentsFilterBar } from '@/components/documents/DocumentsFilterBar';
import { usePaginatedDocuments } from '@/hooks/usePaginatedDocuments';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
    search,
    setSearch,
    status,
    setStatus,
    loading,
    error,
    remove,
  } = usePaginatedDocuments(12);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Handlers para ações de documentos
  const handleViewDocument = (id: string) => {
    navigate(`/documentos/${id}`);
  };
  
  const handleEditDocument = (id: string) => {
    navigate(`/documentos/${id}/editar`);
  };
  
  const handleDeleteDocument = (id: string) => {
    setSelectedId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;
    remove(selectedId)
      .then(() => toast.success('Termo de consentimento excluído com sucesso!'))
      .catch((e) => toast.error(e?.message ?? 'Erro ao excluir termo'))
      .finally(() => {
        setIsDeleteAlertOpen(false);
        setSelectedId(null);
      });
  };
  
  const handleSignDocument = (id: string) => {
    navigate(`/assinaturas`);
    toast.info('Redirecionando para página de assinatura');
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
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4">
        <DocumentsFilterBar
          search={search}
          onSearch={setSearch}
          status={(status === 'all' ? 'Todos' : (status as any))}
          onStatus={(v) => setStatus(v === 'Todos' ? 'all' : v)}
          total={total}
        />

        {loading ? (
          <div className="text-center py-12 text-neutral-500">Carregando...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(doc => (
              <DocumentCard 
                key={doc.id} 
                id={doc.id} 
                title={doc.title}
                status={doc.status as any}
                createdAt={doc.created_at}
                documentType={doc.document_type}
                onView={handleViewDocument} 
                onEdit={handleEditDocument} 
                onDelete={handleDeleteDocument} 
                onSign={handleSignDocument} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">Nenhum termo de consentimento encontrado.</p>
          </div>
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
      </div>
    </div>
  );
};
