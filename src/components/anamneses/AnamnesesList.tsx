import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Anamnesis } from '@/hooks/useAnamneses';
import { DataTable, type Column } from '@/components/shared/DataTable';

interface Props {
  items: Anamnesis[];
  onView: (item: Anamnesis) => void;
  onEdit: (item: Anamnesis) => void;
  onDelete: (item: Anamnesis) => void;
  onSendLink: (item: Anamnesis) => void;
}

const StatusBadge: React.FC<{ status: Anamnesis['status'] | undefined | null }> = ({ status }) => {
  const map: Record<NonNullable<Anamnesis['status']>, { label: string; className: string }> = {
    draft: { label: 'Rascunho', className: 'bg-neutral-200 text-neutral-800' },
    link_sent: { label: 'Link enviado', className: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Concluída', className: 'bg-green-100 text-green-700' },
  };
  const fallback = { label: 'Rascunho', className: 'bg-neutral-200 text-neutral-800' };
  const s = (status ? map[status as keyof typeof map] : undefined) ?? fallback;
  return <Badge className={s.className}>{s.label}</Badge>;
};

export const AnamnesesList: React.FC<Props> = ({ items, onView, onEdit, onDelete, onSendLink }) => {
  const columns: Column<Anamnesis>[] = [
    { header: 'Paciente', cell: (r) => <span className="font-medium">{r.patientName}</span> },
    { header: 'Procedimento', accessor: 'procedureName' as any },
    {
      header: 'Data',
      cell: (r) => new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      emptyMessage="Nenhum registro"
      getRowId={(r) => r.id}
      onRowClick={(row) => onView(row)}
      actions={[
        { label: 'Visualizar', onClick: (row) => onView(row) },
        { label: 'Editar', onClick: (row) => onEdit(row) },
        { label: 'Enviar link', onClick: (row) => onSendLink(row) },
        { label: 'Deletar', onClick: (row) => onDelete(row), variant: 'destructive' },
      ]}
    />
  );
};
