import React from 'react';
import type { DocumentRow } from '@/integrations/supabase/documents';
import { DataTable, type Column } from '@/components/shared/DataTable';

interface Props {
  items: DocumentRow[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABEL: Record<string,string> = { rascunho: 'Rascunho', pendente: 'Pendente', assinado: 'Assinado' };

export const DocumentsListTable: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  const columns: Column<DocumentRow>[] = [
    { header: 'Título', cell: (r) => <span className="font-medium">{r.title}</span> },
    { header: 'Status', cell: (r) => STATUS_LABEL[r.status] ?? r.status },
    { header: 'Procedimento', cell: (r) => r.procedure?.name ?? '-' },
    { header: 'Paciente', cell: (r) => r.patient_ref?.name ?? (r as any).patient ?? '-' },
    { header: 'Criado em', cell: (r) => new Date(r.created_at).toLocaleDateString('pt-BR') },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      emptyMessage="Nenhum registro"
      getRowId={(r) => r.id}
      className="border-0 rounded-none"
      actions={[
        { label: 'Visualizar', onClick: (row) => onView(row.id) },
        { label: 'Editar', onClick: (row) => onEdit(row.id) },
        { label: 'Excluir', onClick: (row) => onDelete(row.id), variant: 'destructive' },
      ]}
    />
  );
};
