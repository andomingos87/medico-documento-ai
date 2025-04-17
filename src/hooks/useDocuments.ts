
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  ConsentDocument, 
  PendingConsentDocument, 
  SignedConsentDocument,
  PENDING_DOCUMENTS,
  SIGNED_DOCUMENTS 
} from '@/components/signatures/types';
import { generateConsentText } from '@/components/signatures/ConsentTextGenerator';
import { NewDocumentFormValues, PROCEDURE_TYPES } from '@/components/signatures/NewDocumentForm';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<ConsentDocument[]>([...PENDING_DOCUMENTS, ...SIGNED_DOCUMENTS]);
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<ConsentDocument | null>(null);
  const [consentText, setConsentText] = useState<string>('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Filter documents based on search term and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.procedureType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filteredStatus === 'all') return matchesSearch;
    if (filteredStatus === 'pending') return matchesSearch && doc.status === 'pending';
    if (filteredStatus === 'signed') return matchesSearch && doc.status === 'signed';
    
    return matchesSearch;
  });

  // Split documents by status
  const pendingDocuments = filteredDocuments.filter(doc => doc.status === 'pending') as PendingConsentDocument[];
  const signedDocuments = filteredDocuments.filter(doc => doc.status === 'signed') as SignedConsentDocument[];

  // View document details
  const handleViewDocument = (document: ConsentDocument) => {
    setSelectedDocument(document);
    setConsentText(generateConsentText(document.procedureType, document.patientName));
  };

  // Generate new document
  const handleGenerateDocument = async (values: NewDocumentFormValues) => {
    setIsGenerating(true);
    
    // Simulate document generation
    setTimeout(() => {
      const newDocument: PendingConsentDocument = {
        id: `doc${documents.length + 1}`,
        patientName: values.patientName,
        procedureType: PROCEDURE_TYPES.find(p => p.id === values.procedureType)?.name || values.procedureType,
        appointmentDate: values.appointmentDate,
        readingTime: Math.floor(Math.random() * 5) + 3, // 3-7 minutes
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      
      setDocuments([newDocument, ...documents]);
      setIsGenerating(false);
      toast.success('Termo de consentimento gerado com sucesso!');
    }, 2000);
  };

  // Capture signature
  const handleCaptureSignature = () => {
    // In a real implementation, this would connect to a signature capture component
    setSignatureData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEX///+nxBvIAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII=');
    toast.success('Assinatura capturada!');
  };

  // Sign document
  const handleSignDocument = () => {
    if (!signatureData) {
      toast.error('Por favor, capture a assinatura primeiro');
      return;
    }
    
    setIsSigning(true);
    
    // Simulate signature processing
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
      setSignatureData(null);
      toast.success('Documento assinado com sucesso! Uma cópia foi enviada por e-mail ao paciente.');
    }, 1500);
  };

  // Format date for display
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

  // Status badge rendering function
  const renderStatusBadge = (status: 'pending' | 'signed') => status;

  return {
    documents,
    searchTerm,
    setSearchTerm,
    filteredStatus,
    setFilteredStatus,
    pendingDocuments,
    signedDocuments,
    selectedDocument,
    setSelectedDocument,
    consentText,
    signatureData,
    setSignatureData,
    isGenerating,
    isSigning,
    handleViewDocument,
    handleGenerateDocument,
    handleCaptureSignature,
    handleSignDocument,
    formatDate,
    renderStatusBadge
  };
};
