import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Task } from '@/integrations/supabase/tasks';

interface Props {
  items: Task[];
  onEdit: (item: Task) => void;
  onDelete: (item: Task) => void;
}

const PRIORITY_LABEL: Record<string,string> = { baixa: 'Baixa', media: 'Média', alta: 'Alta', critica: 'Crítica' };
const STATUS_LABEL: Record<string,string> = { aberta: 'Aberta', em_progresso: 'Em progresso', concluida: 'Concluída', arquivada: 'Arquivada' };

export const TasksList: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{PRIORITY_LABEL[item.priority] ?? item.priority}</TableCell>
              <TableCell>{STATUS_LABEL[item.status] ?? item.status}</TableCell>
              <TableCell>{item.assignee?.name ?? '-'}</TableCell>
              <TableCell>{item.due_date ?? '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(item)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item)}>Deletar</DropdownMenuItem>
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
