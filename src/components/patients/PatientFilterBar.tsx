
import React from 'react';
import { FilterOptions } from './types';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientFilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  totalResults: number;
}

export const PatientFilterBar = ({ filters, onFilterChange, totalResults }: PatientFilterBarProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleGenderChange = (value: string) => {
    onFilterChange({ 
      gender: value as 'male' | 'female' | 'other' | 'all' 
    });
  };

  const handleSortByChange = (value: string) => {
    onFilterChange({ 
      sortBy: value as 'name' | 'createdAt' | 'updatedAt' 
    });
  };

  const toggleSortDirection = () => {
    onFilterChange({ 
      sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9 h-9"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filters.gender || 'all'} onValueChange={handleGenderChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="createdAt">Data de cadastro</SelectItem>
              <SelectItem value="updatedAt">Última atualização</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSortDirection} 
            className="h-9 w-9"
          >
            {filters.sortDirection === 'asc' ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown size={16} />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-600">
          {totalResults} {totalResults === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
        </span>
      </div>
    </div>
  );
};
