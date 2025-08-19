import React from 'react';
import { ProcedureItem } from './types';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface Props {
  items: ProcedureItem[];
  onView: (item: ProcedureItem) => void;
  onEdit: (item: ProcedureItem) => void;
  onDelete: (item: ProcedureItem) => void;
}

export const ProceduresList: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="grid grid-cols-12 bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-600">
        <div className="col-span-6">Procedimento</div>
        <div className="col-span-3">Categoria</div>
        <div className="col-span-3 text-right">Ações</div>
      </div>
      <div>
        {items.length === 0 ? (
          <div className="p-6 text-center text-neutral-500 text-sm">Nenhum procedimento encontrado</div>
        ) : (
          items.map(item => (
            <div key={item.id} className="grid grid-cols-12 items-center px-4 py-3 border-t border-neutral-100 hover:bg-neutral-50">
              <div className="col-span-6 font-medium text-neutral-900">{item.name}</div>
              <div className="col-span-3 text-neutral-700">{item.category}</div>
              <div className="col-span-3 flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onView(item)} title="Visualizar">
                  <Eye size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title="Editar">
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item)} title="Excluir">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
