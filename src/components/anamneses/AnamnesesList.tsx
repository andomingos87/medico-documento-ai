import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { Anamnesis } from '@/hooks/useAnamneses';

interface Props {
  items: Anamnesis[];
  onView: (item: Anamnesis) => void;
  onEdit: (item: Anamnesis) => void;
  onDelete: (item: Anamnesis) => void;
  onSendLink: (item: Anamnesis) => void;
}

const StatusBadge: React.FC<{ status: Anamnesis['status'] }> = ({ status }) => {
  const map: Record<Anamnesis['status'], { label: string; className: string }> = {
    draft: { label: 'Rascunho', className: 'bg-neutral-200 text-neutral-800' },
    link_sent: { label: 'Link enviado', className: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Concluída', className: 'bg-green-100 text-green-700' },
  };
  const s = map[status];
  return <Badge className={s.className}>{s.label}</Badge>;
};

export const AnamnesesList: React.FC<Props> = ({ items, onView, onEdit, onDelete, onSendLink }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Procedimento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.patientName}</TableCell>
              <TableCell>{item.procedureName}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
              <TableCell><StatusBadge status={item.status} /></TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(item)}>Visualizar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendLink(item)}>Enviar link</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item)}>Deletar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-neutral-500 py-8">Nenhum registro</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
