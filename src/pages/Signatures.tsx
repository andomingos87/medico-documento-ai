
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Clock, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Import components and types
import { BenefitsCard } from '@/components/signatures/BenefitsCard';
import { DocumentsTabPanel } from '@/components/signatures/DocumentsTabPanel';
import { SearchFilterBar } from '@/components/signatures/SearchFilterBar';
import { NewDocumentForm, NewDocumentFormValues } from '@/components/signatures/NewDocumentForm';
import { DocumentViewDialog } from '@/components/signatures/DocumentViewDialog';
import { 
  Document, 
  PendingDocument, 
  SignedDocument, 
  PENDING_DOCUMENTS, 
  SIGNED_DOCUMENTS 
} from '@/components/signatures/types';
import { generateConsentText } from '@/components/signatures/ConsentTextGenerator';
import { PROCEDURE_TYPES } from '@/components/signatures/NewDocumentForm';

export const Signatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [documents, setDocuments] = useState<Document[]>([...PENDING_DOCUMENTS, ...SIGNED_DOCUMENTS]);
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [consentText, setConsentText] = useState<string>('');

  // Filtra os documentos com base na pesquisa e no filtro de status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.procedureType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filteredStatus === 'all') return matchesSearch;
    if (filteredStatus === 'pending') return matchesSearch && doc.status === 'pending';
    if (filteredStatus === 'signed') return matchesSearch && doc.status === 'signed';
    
    return matchesSearch;
  });

  // Documentos pendentes e assinados após filtragem
  const pendingDocuments = filteredDocuments.filter(doc => doc.status === 'pending');
  const signedDocuments = filteredDocuments.filter(doc => doc.status === 'signed');

  // Gerenciamento da visualização do documento
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setConsentText(generateConsentText(document.procedureType, document.patientName));
    setIsViewDocumentDialogOpen(true);
  };

  // Geração do documento de consentimento
  const handleGenerateDocument = async (values: NewDocumentFormValues) => {
    setIsGenerating(true);
    
    // Simular o tempo de geração do documento
    setTimeout(() => {
      const newDocument: PendingDocument = {
        id: `doc${documents.length + 1}`,
        patientName: values.patientName,
        procedureType: PROCEDURE_TYPES.find(p => p.id === values.procedureType)?.name || values.procedureType,
        appointmentDate: values.appointmentDate,
        readingTime: Math.floor(Math.random() * 5) + 3, // 3-7 minutos
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      setDocuments([newDocument, ...documents]);
      setIsGenerating(false);
      setIsNewDocumentDialogOpen(false);
      toast.success('Termo de consentimento gerado com sucesso!');
    }, 2000);
  };

  // Simula a captura da assinatura digital
  const handleCaptureSignature = () => {
    // Em uma implementação real, isso seria conectado a um componente de captura de assinatura
    setSignatureData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEX///+nxBvIAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=');
    toast.success('Assinatura capturada!');
  };

  // Processo de assinatura do documento
  const handleSignDocument = () => {
    if (!signatureData) {
      toast.error('Por favor, capture a assinatura primeiro');
      return;
    }
    
    setIsSigning(true);
    
    // Simular o tempo de processamento da assinatura
    setTimeout(() => {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === selectedDocument?.id) {
          return {
            ...doc,
            status: 'signed' as const,
            signedAt: new Date().toISOString(),
            deliveryMethod: 'email' as const,
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      setIsSigning(false);
      setIsViewDocumentDialogOpen(false);
      setSignatureData(null);
      toast.success('Documento assinado com sucesso! Uma cópia foi enviada por e-mail ao paciente.');
    }, 1500);
  };

  // Renderização do badge de status
  const renderStatusBadge = (status: 'pending' | 'signed') => {
    if (status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
    }
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Assinado</Badge>;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Assinaturas Digitais</h1>
          <p className="text-neutral-500 mt-1">
            Gerencie termos de consentimento e assinaturas para procedimentos
          </p>
        </div>
        
        <Dialog open={isNewDocumentDialogOpen} onOpenChange={setIsNewDocumentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-medico-600 hover:bg-medico-700">
              <FileText className="mr-2 h-4 w-4" />
              Novo Termo de Consentimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Gerar Termo de Consentimento</DialogTitle>
              <DialogDescription>
                Preencha os dados do paciente e do procedimento para gerar um termo de consentimento personalizado.
              </DialogDescription>
            </DialogHeader>
            
            <NewDocumentForm 
              onSubmit={handleGenerateDocument}
              onCancel={() => setIsNewDocumentDialogOpen(false)}
              isGenerating={isGenerating}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredStatus={filteredStatus}
        onStatusChange={setFilteredStatus}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Benefícios e Recursos */}
        <BenefitsCard />
        
        {/* Lista de documentos */}
        <Card className="lg:col-span-3">
          <Tabs defaultValue="pending">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="pending" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Pendentes ({pendingDocuments.length})
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Assinados ({signedDocuments.length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <DocumentsTabPanel
                value="pending"
                documents={pendingDocuments}
                formatDate={formatDate}
                renderStatusBadge={renderStatusBadge}
                onView={handleViewDocument}
              />
              
              <DocumentsTabPanel
                value="signed"
                documents={signedDocuments}
                formatDate={formatDate}
                renderStatusBadge={renderStatusBadge}
                onView={handleViewDocument}
              />
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Dialog para visualização e assinatura do documento */}
      <DocumentViewDialog
        isOpen={isViewDocumentDialogOpen}
        onOpenChange={setIsViewDocumentDialogOpen}
        selectedDocument={selectedDocument}
        consentText={consentText}
        signatureData={signatureData}
        formatDate={formatDate}
        onCaptureSignature={handleCaptureSignature}
        onSignDocument={handleSignDocument}
        isSigning={isSigning}
      />
    </div>
  );
};
