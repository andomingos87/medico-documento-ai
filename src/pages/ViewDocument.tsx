
import React, { useEffect, useState } from 'react';
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
import { getDocument } from '@/integrations/supabase/documents';

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
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [document, setDocument] = useState<DocumentData | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) return;
      try {
        setIsLoadingDoc(true);
        setLoadError(null);
        const data = await getDocument(id);
        // Adaptar do formato do banco para o formato local de exibição
        const mapped: DocumentData = {
          id: data.id,
          title: data.title,
          content: `<div><h2 style="text-align:center;margin-bottom:20px;">${data.document_type}</h2><p style="margin-bottom: 15px;">Visualização do termo.</p></div>`,
          status: data.status as DocumentStatus,
          createdAt: data.created_at,
          documentType: data.document_type,
          patient: data.patient ?? undefined,
        };
        if (!cancelled) setDocument(mapped);
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message ?? 'Erro ao carregar documento');
      } finally {
        if (!cancelled) setIsLoadingDoc(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

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
          <h1 className="text-2xl font-bold text-neutral-900">{document?.title ?? 'Carregando...'}</h1>
          <div className="flex items-center gap-2 mt-2">
            {document && renderStatusBadge(document.status)}
            <span className="text-sm text-neutral-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {document ? new Date(document.createdAt).toLocaleDateString('pt-BR') : '--/--/----'}
            </span>
            {document?.patient && (
              <span className="text-sm text-neutral-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                {document.patient}
              </span>
            )}
            <span className="text-sm text-neutral-500 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {document?.documentType ?? '--'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {document && document.status !== 'assinado' && (
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
              <DialogTrigger asChild>
                <PrimaryActionButton icon={<PenTool className="h-4 w-4" />}>
                  Assinar
                </PrimaryActionButton>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
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
    </div>
  );
};
