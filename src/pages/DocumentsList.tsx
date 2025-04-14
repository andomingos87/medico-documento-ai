
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FilePlus, Search } from 'lucide-react';
import { toast } from 'sonner';

// Dados fictícios de documentos
const MOCK_DOCUMENTS = [
  {
    id: '1',
    title: 'Atestado Médico - João Silva',
    status: 'assinado' as const,
    createdAt: '2025-04-15T10:30:00',
    documentType: 'Atestado Médico',
  },
  {
    id: '2',
    title: 'Receita - Maria Oliveira',
    status: 'pendente' as const,
    createdAt: '2025-04-14T15:45:00',
    documentType: 'Receita',
  },
  {
    id: '3',
    title: 'Laudo Médico - Pedro Santos',
    status: 'rascunho' as const,
    createdAt: '2025-04-13T09:15:00',
    documentType: 'Laudo Médico',
  },
  {
    id: '4',
    title: 'Solicitação de Exame - Ana Costa',
    status: 'pendente' as const,
    createdAt: '2025-04-12T11:20:00',
    documentType: 'Solicitação de Exame',
  },
  {
    id: '5',
    title: 'Declaração - Carlos Pereira',
    status: 'assinado' as const,
    createdAt: '2025-04-11T16:00:00',
    documentType: 'Declaração',
  },
  {
    id: '6',
    title: 'Atestado Médico - Fernanda Lima',
    status: 'assinado' as const,
    createdAt: '2025-04-10T13:45:00',
    documentType: 'Atestado Médico',
  },
];

export const DocumentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);

  // Handlers para ações de documentos
  const handleViewDocument = (id: string) => {
    navigate(`/documentos/${id}`);
  };

  const handleEditDocument = (id: string) => {
    navigate(`/documentos/${id}/editar`);
  };

  const handleDeleteDocument = (id: string) => {
    // Simulando exclusão
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Documento excluído com sucesso!');
  };

  const handleSignDocument = (id: string) => {
    navigate(`/documentos/${id}/assinar`);
  };

  // Filtragem de documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter !== 'all' ? doc.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Documentos</h1>
        <Button 
          onClick={() => navigate('/criar-documento')}
          className="bg-medico-600 hover:bg-medico-700"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <Input
              placeholder="Buscar documentos..."
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
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="assinado">Assinado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                status={doc.status}
                createdAt={doc.createdAt}
                documentType={doc.documentType}
                onView={handleViewDocument}
                onEdit={handleEditDocument}
                onDelete={handleDeleteDocument}
                onSign={handleSignDocument}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">Nenhum documento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
