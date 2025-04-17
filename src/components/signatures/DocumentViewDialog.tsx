
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { SignatureCapture } from './SignatureCapture';
import { ConsentDocument, SignedConsentDocument } from './types';

interface DocumentViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDocument: ConsentDocument | null;
  consentText: string;
  signatureData: string | null;
  formatDate: (dateString: string) => string;
  onCaptureSignature: () => void;
  onSignDocument: () => void;
  isSigning: boolean;
}

export const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedDocument,
  consentText,
  signatureData,
  formatDate,
  onCaptureSignature,
  onSignDocument,
  isSigning
}) => {
  if (!selectedDocument) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Termo de Consentimento</DialogTitle>
          <DialogDescription>
            {selectedDocument.status === 'pending' 
              ? `Solicite que o paciente leia e assine o documento abaixo`
              : `Documento assinado em ${selectedDocument.status === 'signed' ? formatDate((selectedDocument as SignedConsentDocument).signedAt) : ''}`
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
              Assinado em {formatDate((selectedDocument as SignedConsentDocument).signedAt)}
            </Badge>
          )}
        </div>
        
        {selectedDocument.status === 'pending' ? (
          <SignatureCapture
            signatureData={signatureData}
            onCaptureSignature={onCaptureSignature}
            onSignDocument={onSignDocument}
            onCancel={() => onOpenChange(false)}
            isSigning={isSigning}
          />
        ) : (
          <DialogClose asChild>
            <Button className="mt-4 ml-auto">Fechar</Button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
};
