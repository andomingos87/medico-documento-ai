
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentCard } from '@/components/DocumentCard';
import { Search, FileSignature } from 'lucide-react';

// Mock data for signatures
const MOCK_SIGNATURES = [
  {
    id: '1',
    title: 'Laudo Médico - Ana Silva',
    status: 'pendente' as const,
    createdAt: '2025-04-14T10:30:00',
    documentType: 'Laudo Médico',
    deadline: '2025-04-20',
  },
  {
    id: '2',
    title: 'Atestado - João Santos',
    status: 'assinado' as const,
    createdAt: '2025-04-13T15:45:00',
    documentType: 'Atestado Médico',
    signedAt: '2025-04-13T16:00:00',
  },
  {
    id: '3',
    title: 'Prescrição - Maria Oliveira',
    status: 'pendente' as const,
    createdAt: '2025-04-12T09:15:00',
    documentType: 'Prescrição Médica',
    deadline: '2025-04-15',
  },
];

export const Signatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [signatures, setSignatures] = useState(MOCK_SIGNATURES);

  // Filtragem de assinaturas
  const filteredSignatures = signatures.filter(sig => {
    const matchesSearch = sig.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter !== 'all' ? sig.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Assinaturas</h1>
        <Button 
          onClick={() => {}} 
          className="bg-medico-600 hover:bg-medico-700"
        >
          <FileSignature className="mr-2 h-4 w-4" />
          Nova Assinatura
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Buscar assinaturas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="assinado">Assinado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredSignatures.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSignatures.map((signature) => (
              <DocumentCard
                key={signature.id}
                id={signature.id}
                title={signature.title}
                status={signature.status}
                createdAt={signature.createdAt}
                documentType={signature.documentType}
                onView={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onSign={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">Nenhuma assinatura encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};
