import React from 'react';
import type { Professional } from '@/hooks/useProfessionals';
import { DataTable, type Column } from '@/components/shared/DataTable';

interface Props {
  items: Professional[];
  onEdit: (item: Professional) => void;
  onDelete: (item: Professional) => void;
}

export const ProfessionalsList: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  const columns: Column<Professional>[] = [
    { header: 'Nome', cell: (r) => <span className="font-medium">{r.name}</span> },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefone', cell: (r) => r.phone || '-' },
    { header: 'Função', accessor: 'role' },
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
