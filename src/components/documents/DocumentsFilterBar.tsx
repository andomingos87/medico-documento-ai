import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export type DocumentStatusFilter = 'Todos' | 'rascunho' | 'pendente' | 'assinado';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: DocumentStatusFilter;
  onStatus: (v: DocumentStatusFilter) => void;
  total: number;
}

const statusOptions: DocumentStatusFilter[] = ['Todos', 'rascunho', 'pendente', 'assinado'];

export const DocumentsFilterBar: React.FC<Props> = ({ search, onSearch, status, onStatus, total }) => {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por paciente, procedimento ou título..."
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => onStatus(v as DocumentStatusFilter)}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => (
                <SelectItem key={s} value={s}>{s === 'Todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-neutral-600">{total} {total === 1 ? 'termo' : 'termos'}</div>
    </div>
  );
};
