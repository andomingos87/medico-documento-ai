
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Send } from 'lucide-react';
import { ConsentDocument, SignedConsentDocument } from './types';
import { createStatusBadge } from '@/lib/statusBadgeUtils';

interface DocumentCardProps {
  document: ConsentDocument;
  formatDate: (dateString: string) => string;
  renderStatusBadge: (status: 'pending' | 'signed') => 'pending' | 'signed';
  onView: (doc: ConsentDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  formatDate,
  renderStatusBadge,
  onView,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <CardContent className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-neutral-900">{document.patientName}</h3>
                {createStatusBadge(renderStatusBadge(document.status as 'pending' | 'signed'))}
              </div>
              <p className="text-sm text-neutral-500 mt-1">{document.procedureType}</p>
            </div>
            
            <div className="flex flex-col text-sm text-neutral-500">
              {document.status === 'pending' ? (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Consulta: {formatDate(document.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Tempo de leitura: {document.readingTime} min</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Assinado em: {formatDate((document as SignedConsentDocument).signedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Send className="h-3.5 w-3.5" />
                    <span>Enviado via: {(document as SignedConsentDocument).deliveryMethod === 'email' ? 'E-mail' : 'WhatsApp'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
        
        <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end md:w-48">
          <Button 
            className="w-full"
            variant={document.status === 'pending' ? "default" : "outline"}
            onClick={() => onView(document)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </div>
      </div>
    </Card>
  );
};
