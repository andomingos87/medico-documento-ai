import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { DocumentRow } from '@/integrations/supabase/documents';

interface Props {
  items: DocumentRow[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABEL: Record<string,string> = { rascunho: 'Rascunho', pendente: 'Pendente', assinado: 'Assinado' };

export const DocumentsListTable: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Procedimento</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{STATUS_LABEL[item.status] ?? item.status}</TableCell>
              <TableCell>{item.procedure?.name ?? '-'}</TableCell>
              <TableCell>{item.patient_ref?.name ?? item.patient ?? '-'}</TableCell>
              <TableCell>{new Date(item.created_at).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(item.id)}>Visualizar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item.id)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-neutral-500 py-8">Nenhum registro</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
