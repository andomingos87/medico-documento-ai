import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcedureCategory } from './types';
import { Search } from 'lucide-react';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: ProcedureCategory | 'Todos';
  onCategory: (v: ProcedureCategory | 'Todos') => void;
  total: number;
}

const categories: (ProcedureCategory | 'Todos')[] = ['Todos', 'Geral', 'Cirúrgico', 'Estético', 'Diagnóstico', 'Terapêutico'];

export const ProcedureFilterBar: React.FC<Props> = ({ search, onSearch, category, onCategory, total }) => {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar procedimento..."
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={(v) => onCategory(v as any)}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-neutral-600">{total} {total === 1 ? 'procedimento' : 'procedimentos'}</div>
    </div>
  );
};
