
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredStatus: string;
  onStatusChange: (value: string) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filteredStatus,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
        <Input
          placeholder="Buscar por paciente ou procedimento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={filteredStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-48">
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-neutral-500" />
            <SelectValue placeholder="Filtrar por status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="signed">Assinados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
