
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  PenLine, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  Clock,
  ClipboardCopy
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Dados fictícios para o documento
const MOCK_DOCUMENT = {
  id: '1',
  title: 'Atestado Médico - João Silva',
  status: 'pendente' as const,
  createdAt: '2025-04-15T10:30:00',
  documentType: 'Atestado Médico',
  content: `ATESTADO MÉDICO

Atesto para os devidos fins que o(a) paciente João Silva compareceu à consulta médica na especialidade de Clínica Geral na data de 15/04/2025 e necessita de afastamento de suas atividades por um período de 3 (três) dias a contar desta data.

Observações: Paciente apresentou sintomas de infecção respiratória aguda.

Código CID: J00

15/04/2025

Dr. Ricardo Silva
CRM 12345 - Clínica Geral`,
};

export const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(MOCK_DOCUMENT);
  const [isSigning, setIsSigning] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: 'rascunho' | 'pendente' | 'assinado') => {
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

  const getStatusLabel = (status: 'rascunho' | 'pendente' | 'assinado') => {
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

  const handleSign = () => {
    setIsSigning(true);
    
    // Simulando o processo de assinatura
    setTimeout(() => {
      setDocument({
        ...document,
        status: 'assinado' as const
      });
      setIsSigning(false);
      toast.success('Documento assinado com sucesso!');
    }, 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    toast.success('Conteúdo copiado para a área de transferência!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => navigate('/documentos')}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">Visualizar Documento</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{document.title}</CardTitle>
                <Badge variant="secondary" className={cn("font-normal", getStatusColor(document.status))}>
                  {getStatusLabel(document.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 relative">
              <div className="border border-neutral-200 rounded-md p-6 min-h-[500px] font-mono text-sm whitespace-pre-wrap relative bg-white">
                {document.content}
                
                {document.status === 'assinado' && (
                  <div className="absolute bottom-6 right-6 flex items-center opacity-70">
                    <div className="border-2 border-green-600 rounded-md p-2 text-green-600 text-xs font-medium rotate-[-5deg]">
                      ASSINADO DIGITALMENTE
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopyContent}
              >
                {copied ? (
                  <CheckCircle2 size={16} className="text-green-600" />
                ) : (
                  <ClipboardCopy size={16} />
                )}
              </Button>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <div className="text-xs text-neutral-500 flex items-center">
                <Clock size={14} className="mr-1" />
                Criado em {formatDate(document.createdAt)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer size={16} className="mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-neutral-700">Tipo de Documento</p>
                <p className="text-sm text-neutral-900">{document.documentType}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-neutral-700">Status</p>
                <Badge variant="secondary" className={cn("mt-1 font-normal", getStatusColor(document.status))}>
                  {getStatusLabel(document.status)}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-neutral-700">Data de Criação</p>
                <p className="text-sm text-neutral-900">{formatDate(document.createdAt)}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-neutral-700">Médico Responsável</p>
                <p className="text-sm text-neutral-900">Dr. Ricardo Silva</p>
                <p className="text-xs text-neutral-500">CRM 12345 - Clínica Geral</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-neutral-700">Paciente</p>
                <p className="text-sm text-neutral-900">João Silva</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {document.status !== 'assinado' ? (
                <Button
                  className="w-full bg-medico-600 hover:bg-medico-700"
                  onClick={handleSign}
                  disabled={isSigning}
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assinando...
                    </>
                  ) : (
                    <>
                      <PenLine className="mr-2 h-4 w-4" />
                      Assinar Documento
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Documento Assinado
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
              
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Editar Documento
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
