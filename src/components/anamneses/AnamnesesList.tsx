import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { Anamnesis } from '@/hooks/useAnamneses';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

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
  const [selectedForAction, setSelectedForAction] = useState<Anamnesis | null>(null);

  const handleViewClick = (item: Anamnesis) => {
    setSelectedForAction(item);
    onView(item);
  };

  const handleEditClick = (item: Anamnesis) => {
    setSelectedForAction(item);
    onEdit(item);
  };

  const handleDeleteClick = (item: Anamnesis) => {
    setSelectedForAction(item);
    onDelete(item);
  };

  const handleSendLinkClick = (item: Anamnesis) => {
    onSendLink(item);
  };

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
      renderActions={(row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewClick(row)}>
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditClick(row)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSendLinkClick(row)}>
              Enviar link
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => handleDeleteClick(row)}
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    />
  );
};
