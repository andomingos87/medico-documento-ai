import React from 'react';
import type { Task } from '@/integrations/supabase/tasks';
import { DataTable, type Column } from '@/components/shared/DataTable';

interface Props {
  items: Task[];
  onEdit: (item: Task) => void;
  onDelete: (item: Task) => void;
}

const PRIORITY_LABEL: Record<string,string> = { baixa: 'Baixa', media: 'Média', alta: 'Alta', critica: 'Crítica' };
const STATUS_LABEL: Record<string,string> = { aberta: 'Aberta', em_progresso: 'Em progresso', concluida: 'Concluída', arquivada: 'Arquivada' };

export const TasksList: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  const columns: Column<Task>[] = [
    { header: 'Título', cell: (r) => <span className="font-medium">{r.title}</span> },
    { header: 'Prioridade', cell: (r) => PRIORITY_LABEL[r.priority] ?? r.priority },
    { header: 'Status', cell: (r) => STATUS_LABEL[r.status] ?? r.status },
    { header: 'Responsável', cell: (r) => r.assignee?.name ?? '-' },
    { header: 'Vencimento', accessor: 'due_date' },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      emptyMessage="Nenhum registro"
      getRowId={(r) => r.id}
      actions={[
        { label: 'Editar', onClick: (row) => onEdit(row) },
        { label: 'Deletar', onClick: (row) => onDelete(row), variant: 'destructive' },
      ]}
    />
  );
};
