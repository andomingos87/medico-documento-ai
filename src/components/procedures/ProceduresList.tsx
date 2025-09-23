import React from 'react';
import { ProcedureItem } from './types';
import { DataTable, type Column } from '@/components/shared/DataTable';

interface Props {
  items: ProcedureItem[];
  onView: (item: ProcedureItem) => void;
  onEdit: (item: ProcedureItem) => void;
  onDelete: (item: ProcedureItem) => void;
}

export const ProceduresList: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  const columns: Column<ProcedureItem>[] = [
    { header: 'Procedimento', cell: (r) => <span className="font-medium">{r.name}</span> },
    { header: 'Categoria', accessor: 'category' as any },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      emptyMessage="Nenhum procedimento encontrado"
      getRowId={(r) => r.id}
      actions={[
        { label: 'Visualizar', onClick: (row) => onView(row) },
        { label: 'Editar', onClick: (row) => onEdit(row) },
        { label: 'Excluir', onClick: (row) => onDelete(row), variant: 'destructive' },
      ]}
    />
  );
};
