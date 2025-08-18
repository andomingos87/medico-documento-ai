
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SecondaryActionButton } from '@/components/ui/secondary-action-button';
import { PrimaryActionButton } from '@/components/ui/primary-action-button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FileText, Download, Share2, Printer, PenTool, MoreVertical, Calendar, User, Tag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Tipos para o documento
type DocumentStatus = 'rascunho' | 'pendente' | 'assinado';

interface DocumentData {
  id: string;
  title: string;
  content: string;
  status: DocumentStatus;
  createdAt: string;
  documentType: string;
  patient?: string;
}

export const ViewDocument = () => {
  const { id } = useParams<{ id: string }>();
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados fictícios do documento
  const [document, setDocument] = useState<DocumentData>({
    id: id || '1',
    title: 'Atestado Médico - João Silva',
    content: `
      <div>
        <h2 style="text-align: center; margin-bottom: 20px;">ATESTADO MÉDICO</h2>
        
        <p style="margin-bottom: 15px;">Atesto para os devidos fins que o(a) paciente <strong>João Silva</strong>, 
        portador(a) do CPF 123.456.789-00, foi atendido(a) nesta data, necessitando de 
        afastamento de suas atividades por 3 (três) dias a partir de 15/04/2025.</p>
        
        <p style="margin-bottom: 15px;">CID-10: J11 (Influenza devido a vírus não identificado)</p>
        
        <div style="margin-top: 40px; text-align: center;">
          <p>São Paulo, 15 de Abril de 2025</p>
          <div style="margin-top: 40px; border-top: 1px solid #000; width: 200px; margin-left: auto; margin-right: auto; padding-top: 5px;">
            Dr. Ricardo Silva<br>
            CRM/SP 123456<br>
            Clínica Médica
          </div>
        </div>
      </div>
    `,
    status: 'pendente',
    createdAt: '2025-04-15T10:30:00',
    documentType: 'Atestado Médico',
    patient: 'João Silva'
  });

  // Função para assinar o documento
  const handleSignDocument = () => {
    setIsLoading(true);
    
    // Simulando o processo de assinatura
    setTimeout(() => {
      setDocument({
        ...document,
        status: 'assinado' as DocumentStatus // Garantir que o tipo é correto
      });
      setIsLoading(false);
      setIsSignDialogOpen(false);
      toast.success('Documento assinado com sucesso!');
    }, 1500);
  };

  // Função para baixar o documento
  const handleDownload = () => {
    toast.success('Documento baixado com sucesso!');
  };

  // Função para compartilhar o documento
  const handleShare = () => {
    toast.success('Link de compartilhamento copiado para a área de transferência!');
  };

  // Função para imprimir o documento
  const handlePrint = () => {
    window.print();
  };

  // Função para excluir o documento
  const handleDelete = () => {
    setIsLoading(true);
    
    // Simulando o processo de exclusão
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteAlertOpen(false);
      toast.success('Documento excluído com sucesso!');
      // Redirecionaria para a lista de documentos em uma aplicação real
    }, 1000);
  };

  // Renderiza o selo de status do documento
  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'rascunho':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Rascunho</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pendente</Badge>;
      case 'assinado':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Assinado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{document.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            {renderStatusBadge(document.status)}
            <span className="text-sm text-neutral-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(document.createdAt).toLocaleDateString('pt-BR')}
            </span>
            {document.patient && (
              <span className="text-sm text-neutral-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                {document.patient}
              </span>
            )}
            <span className="text-sm text-neutral-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {document.documentType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document.status !== 'assinado' && (
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryActionButton icon={<PenTool className="h-4 w-4" />}>
                  Assinar
                </PrimaryActionButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assinar Documento</DialogTitle>
                  <DialogDescription>
                    Ao assinar este documento, você confirma sua validade legal.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-neutral-500">
                    Documento: <span className="font-medium text-neutral-900">{document.title}</span>
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
                <DialogFooter>
                  <SecondaryActionButton onClick={() => setIsSignDialogOpen(false)}>Cancelar</SecondaryActionButton>
                  <PrimaryActionButton 
                    onClick={handleSignDocument}
                    isLoading={isLoading}
                    loadingText="Processando..."
                  >
                    Confirmar Assinatura
                  </PrimaryActionButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                <span>Baixar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Compartilhar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Imprimir</span>
              </DropdownMenuItem>
              <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <DropdownMenuItem 
                  className="text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsDeleteAlertOpen(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  <span>Excluir</span>
                </DropdownMenuItem>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O documento será permanentemente removido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Visualizar</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              <div 
                className="document-content"
                dangerouslySetInnerHTML={{ __html: document.content }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Título</h3>
                    <p className="mt-1">{document.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Tipo de Documento</h3>
                    <p className="mt-1">{document.documentType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Status</h3>
                    <div className="mt-1">{renderStatusBadge(document.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Data de Criação</h3>
                    <p className="mt-1">{new Date(document.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {document.patient && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Paciente</h3>
                      <p className="mt-1">{document.patient}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Histórico de Alterações</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <div className="w-4 h-4 rounded-full bg-neutral-200 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Documento criado</p>
                        <p className="text-neutral-500">15/04/2025 às 10:30 - Dr. Ricardo Silva</p>
                      </div>
                    </div>
                    {document.status === 'assinado' && (
                      <div className="flex">
                        <div className="w-4 h-4 rounded-full bg-green-200 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Documento assinado</p>
                          <p className="text-neutral-500">15/04/2025 às 14:45 - Dr. Ricardo Silva</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
