
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles, Clock, CheckCircle, Calendar, Search, Filter, TabletSmartphone, Send, FileText, PenTool, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

// Tipos de procedimentos disponíveis
const PROCEDURE_TYPES = [
  { id: 'botox', name: 'Toxina Botulínica (Botox)' },
  { id: 'filling', name: 'Preenchimento Facial' },
  { id: 'threads', name: 'Fios de Sustentação' },
  { id: 'peel', name: 'Peeling Químico' },
  { id: 'laser', name: 'Tratamento a Laser' },
  { id: 'lip', name: 'Preenchimento Labial' },
  { id: 'bioestimulator', name: 'Bioestimulador de Colágeno' },
];

// Types for documents
interface BaseDocument {
  id: string;
  patientName: string;
  procedureType: string;
  appointmentDate: string;
  readingTime: number;
  createdAt: string;
  status: string;
}

interface PendingDocument extends BaseDocument {
  status: 'pending';
}

interface SignedDocument extends BaseDocument {
  status: 'signed';
  signedAt: string;
  deliveryMethod: 'email' | 'whatsapp';
}

type Document = PendingDocument | SignedDocument;

// Dados fictícios para documentos pendentes e assinados
const PENDING_DOCUMENTS: PendingDocument[] = [
  {
    id: 'doc1',
    patientName: 'Mariana Oliveira',
    procedureType: 'Toxina Botulínica (Botox)',
    appointmentDate: '2025-04-18T14:30:00',
    readingTime: 4,
    createdAt: '2025-04-17T10:15:00',
    status: 'pending',
  },
  {
    id: 'doc2',
    patientName: 'Carlos Eduardo Santos',
    procedureType: 'Preenchimento Facial',
    appointmentDate: '2025-04-18T16:00:00',
    readingTime: 6,
    createdAt: '2025-04-17T11:30:00',
    status: 'pending',
  },
  {
    id: 'doc3',
    patientName: 'Patrícia Mendes',
    procedureType: 'Fios de Sustentação',
    appointmentDate: '2025-04-19T09:15:00',
    readingTime: 7,
    createdAt: '2025-04-17T14:45:00',
    status: 'pending',
  },
];

const SIGNED_DOCUMENTS: SignedDocument[] = [
  {
    id: 'doc4',
    patientName: 'Juliana Costa',
    procedureType: 'Toxina Botulínica (Botox)',
    appointmentDate: '2025-04-16T10:00:00',
    readingTime: 4,
    createdAt: '2025-04-15T15:20:00',
    signedAt: '2025-04-16T10:15:00',
    status: 'signed',
    deliveryMethod: 'email',
  },
  {
    id: 'doc5',
    patientName: 'Roberto Almeida',
    procedureType: 'Peeling Químico',
    appointmentDate: '2025-04-16T14:30:00',
    readingTime: 5,
    createdAt: '2025-04-15T16:40:00',
    signedAt: '2025-04-16T14:45:00',
    status: 'signed',
    deliveryMethod: 'whatsapp',
  },
];

interface NewDocumentFormValues {
  patientName: string;
  procedureType: string;
  appointmentDate: string;
  additionalInfo: string;
}

export const Signatures = () => {
  const isMobile = useIsMobile();
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
  
  const form = useForm<NewDocumentFormValues>({
    defaultValues: {
      patientName: '',
      procedureType: '',
      appointmentDate: '',
      additionalInfo: '',
    },
  });

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
    
    // Gerando texto de consentimento fictício baseado no tipo de procedimento
    let consentTextContent = '';
    
    switch (document.procedureType) {
      case 'Toxina Botulínica (Botox)':
        consentTextContent = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO\nPROCEDIMENTO: APLICAÇÃO DE TOXINA BOTULÍNICA (BOTOX)\n\nEu, ${document.patientName}, declaro que fui informado(a) pelo(a) médico(a) sobre os detalhes do procedimento de aplicação de toxina botulínica, seus benefícios, riscos, possíveis complicações e alternativas. Compreendo que:\n\n1. A toxina botulínica é utilizada para relaxamento temporário da musculatura facial, reduzindo linhas de expressão e rugas dinâmicas;\n\n2. O efeito do procedimento é temporário, durando em média de 3 a 6 meses, sendo necessária nova aplicação para manutenção dos resultados;\n\n3. Possíveis efeitos colaterais incluem: dor leve no local da aplicação, edema (inchaço), eritema (vermelhidão), hematoma (roxo), assimetria facial temporária, ptose palpebral (queda da pálpebra), cefaleia (dor de cabeça);\n\n4. O resultado final do procedimento será observado entre 7 a 15 dias após a aplicação;\n\n5. Deverei seguir todas as recomendações pós-procedimento fornecidas pelo(a) médico(a), incluindo não massagear a área tratada, não se deitar ou abaixar a cabeça nas primeiras 4 horas, e evitar atividade física intensa nas primeiras 24 horas.\n\nDeclaro que tive a oportunidade de esclarecer todas as minhas dúvidas relativas ao procedimento e que as informações que prestei sobre meu histórico de saúde são verdadeiras, tendo informado sobre alergias, medicamentos em uso, gravidez/amamentação e condições médicas relevantes.`;
        break;
      case 'Preenchimento Facial':
        consentTextContent = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO\nPROCEDIMENTO: PREENCHIMENTO FACIAL COM ÁCIDO HIALURÔNICO\n\nEu, ${document.patientName}, declaro que fui informado(a) pelo(a) médico(a) sobre os detalhes do procedimento de preenchimento facial com ácido hialurônico, seus benefícios, riscos, possíveis complicações e alternativas. Compreendo que:\n\n1. O preenchimento facial com ácido hialurônico é utilizado para restaurar volume facial, corrigir sulcos, rugas e melhorar o contorno facial;\n\n2. O efeito do procedimento é temporário, durando em média de 6 a 18 meses, dependendo da área tratada e do produto utilizado;\n\n3. Possíveis efeitos colaterais incluem: dor no local da aplicação, edema (inchaço), eritema (vermelhidão), hematoma (roxo), sensibilidade local, assimetria, nódulos ou granulomas;\n\n4. Em casos muito raros, podem ocorrer complicações graves como necrose tecidual e obstrução vascular, que requerem tratamento imediato;\n\n5. O resultado final do procedimento será observado após a resolução do edema inicial, aproximadamente 7 a 14 dias;\n\n6. Deverei seguir todas as recomendações pós-procedimento fornecidas pelo(a) médico(a), incluindo evitar exposição solar intensa, saunas, atividade física e consumo de álcool nas primeiras 24 horas.\n\nDeclaro que tive a oportunidade de esclarecer todas as minhas dúvidas relativas ao procedimento e que as informações que prestei sobre meu histórico de saúde são verdadeiras, tendo informado sobre alergias, medicamentos em uso, gravidez/amamentação e condições médicas relevantes.`;
        break;
      default:
        consentTextContent = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO\nPROCEDIMENTO: ${document.procedureType.toUpperCase()}\n\nEu, ${document.patientName}, declaro que fui informado(a) pelo(a) médico(a) sobre os detalhes do procedimento, seus benefícios, riscos, possíveis complicações e alternativas. Compreendo que este procedimento possui características específicas que me foram explicadas detalhadamente.\n\nFui informado(a) sobre possíveis efeitos colaterais, duração esperada dos resultados e cuidados necessários pós-procedimento. Tive a oportunidade de esclarecer todas as minhas dúvidas e fui informado(a) sobre alternativas terapêuticas para minha condição.\n\nDecido, de forma livre e esclarecida, consentir com a realização do procedimento proposto, estando ciente de que posso revogar este consentimento a qualquer momento antes da realização do procedimento, sem penalização ou prejuízo ao meu atendimento.`;
    }
    
    setConsentText(consentTextContent);
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
      form.reset();
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerateDocument)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Paciente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="procedureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Procedimento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o procedimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROCEDURE_TYPES.map((procedure) => (
                            <SelectItem key={procedure.id} value={procedure.id}>
                              {procedure.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Consulta</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informações Adicionais (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações ou detalhes específicos sobre o paciente ou procedimento..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsNewDocumentDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-medico-600 hover:bg-medico-700"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar com IA
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          <Input
            placeholder="Buscar por paciente ou procedimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filteredStatus} onValueChange={setFilteredStatus}>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Benefícios e Recursos */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-medico-50 to-blue-50 border-neutral-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-medico-100 p-3 rounded-lg">
                  <TabletSmartphone className="h-6 w-6 text-medico-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Experiência Mobile</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Interface otimizada para tablets, facilitando o uso em consultórios e clínicas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <PenTool className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Assinatura Digital</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Pacientes assinam documentos diretamente no tablet com validação legal
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Envio Automático</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Documentos enviados automaticamente por e-mail ou WhatsApp
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">IA Integrada</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Geração automática de termos personalizados por tipo de procedimento
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Segurança LGPD</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Armazenamento seguro e criptografado, em conformidade com a LGPD
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-lg">
                  <User className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Multiusuário</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Diferentes níveis de acesso para cada profissional da clínica
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
              <TabsContent value="pending" className="space-y-4">
                {pendingDocuments.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <p>Nenhum documento pendente de assinatura</p>
                  </div>
                ) : (
                  pendingDocuments.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-neutral-900">{doc.patientName}</h3>
                                {renderStatusBadge(doc.status as 'pending' | 'signed')}
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">{doc.procedureType}</p>
                            </div>
                            
                            <div className="flex flex-col text-sm text-neutral-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Consulta: {formatDate(doc.appointmentDate)}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Tempo de leitura: {doc.readingTime} min</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end md:w-48">
                          <Button 
                            className="bg-medico-600 hover:bg-medico-700 w-full"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="signed" className="space-y-4">
                {signedDocuments.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <p>Nenhum documento assinado</p>
                  </div>
                ) : (
                  signedDocuments.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-neutral-900">{doc.patientName}</h3>
                                {renderStatusBadge(doc.status as 'pending' | 'signed')}
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">{doc.procedureType}</p>
                            </div>
                            
                            <div className="flex flex-col text-sm text-neutral-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Assinado em: {formatDate(doc.signedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Send className="h-3.5 w-3.5" />
                                <span>Enviado via: {doc.deliveryMethod === 'email' ? 'E-mail' : 'WhatsApp'}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end md:w-48">
                          <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Dialog para visualização e assinatura do documento */}
      {selectedDocument && (
        <Dialog open={isViewDocumentDialogOpen} onOpenChange={setIsViewDocumentDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Termo de Consentimento</DialogTitle>
              <DialogDescription>
                {selectedDocument.status === 'pending' 
                  ? `Solicite que o paciente leia e assine o documento abaixo`
                  : `Documento assinado em ${selectedDocument.status === 'signed' ? formatDate((selectedDocument as SignedDocument).signedAt) : ''}`
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-auto my-4 p-4 border rounded-md bg-neutral-50 font-mono text-sm whitespace-pre-wrap">
              {consentText}
            </div>
            
            <div className="flex items-center justify-between text-sm text-neutral-500 my-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Tempo estimado de leitura: {selectedDocument.readingTime} minutos</span>
              </div>
              
              {selectedDocument.status === 'signed' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Assinado em {formatDate((selectedDocument as SignedDocument).signedAt)}
                </Badge>
              )}
            </div>
            
            {selectedDocument.status === 'pending' && (
              <>
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm font-medium mb-2">Área de Assinatura</p>
                  
                  {signatureData ? (
                    <div className="border rounded-md p-4 bg-white flex justify-center">
                      <img 
                        src={signatureData} 
                        alt="Assinatura Digital" 
                        className="h-20 max-w-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div 
                      className="border border-dashed rounded-md p-6 bg-neutral-50 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors"
                      onClick={handleCaptureSignature}
                    >
                      <PenTool className="h-10 w-10 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 text-center">Clique para capturar assinatura digital</p>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsViewDocumentDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-medico-600 hover:bg-medico-700" 
                    disabled={!signatureData || isSigning}
                    onClick={handleSignDocument}
                  >
                    {isSigning ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Concluir Assinatura
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
