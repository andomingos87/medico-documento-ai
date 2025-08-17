
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash, 
  PenLine,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type DocumentStatus = 'rascunho' | 'pendente' | 'assinado';

type DocumentCardProps = {
  id: string;
  title: string;
  status: DocumentStatus;
  createdAt: string;
  documentType: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSign: (id: string) => void;
};

export const DocumentCard = ({
  id,
  title,
  status,
  createdAt,
  documentType,
  onView,
  onEdit,
  onDelete,
  onSign,
}: DocumentCardProps) => {
  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'rascunho':
        return 'bg-neutral-100 text-neutral-700';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'assinado':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'rascunho':
        return 'Rascunho';
      case 'pendente':
        return 'Pendente';
      case 'assinado':
        return 'Assinado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-card p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <FileText size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 line-clamp-1">{title}</h3>
            <p className="text-xs text-neutral-500">{documentType}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={16} className="text-neutral-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(id)}>
              <Eye size={16} className="mr-2" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit size={16} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSign(id)}>
              <PenLine size={16} className="mr-2" />
              Assinar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash size={16} className="mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <Badge variant="secondary" className={cn("font-normal", getStatusColor(status))}>
          {getStatusLabel(status)}
        </Badge>
        <div className="flex items-center text-xs text-neutral-500">
          <Clock size={14} className="mr-1" />
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
};
