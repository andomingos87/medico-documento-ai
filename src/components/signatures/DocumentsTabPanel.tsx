
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { FileText, CheckCircle } from 'lucide-react';
import { DocumentCard } from './DocumentCard';

interface DocumentsTabPanelProps {
  value: string;
  documents: Document[];
  formatDate: (dateString: string) => string;
  renderStatusBadge: (status: 'pending' | 'signed') => React.ReactNode;
  onView: (doc: Document) => void;
}

export const DocumentsTabPanel: React.FC<DocumentsTabPanelProps> = ({ 
  value, 
  documents, 
  formatDate, 
  renderStatusBadge, 
  onView 
}) => {
  const isEmpty = documents.length === 0;
  const isPending = value === 'pending';
  
  return (
    <TabsContent value={value} className="space-y-4">
      {isEmpty ? (
        <div className="text-center py-12 text-neutral-500">
          {isPending ? (
            <FileText className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
          ) : (
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
          )}
          <p>Nenhum documento {isPending ? 'pendente de assinatura' : 'assinado'}</p>
        </div>
      ) : (
        documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            formatDate={formatDate}
            renderStatusBadge={renderStatusBadge}
            onView={onView}
          />
        ))
      )}
    </TabsContent>
  );
};
