
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsentDocument } from './types';
import { DocumentsTabPanel } from './DocumentsTabPanel';

interface SignaturesContentProps {
  pendingDocuments: ConsentDocument[];
  signedDocuments: ConsentDocument[];
  formatDate: (dateString: string) => string;
  renderStatusBadge: (status: 'pending' | 'signed') => 'pending' | 'signed';
  onView: (doc: ConsentDocument) => void;
}

export const SignaturesContent: React.FC<SignaturesContentProps> = ({
  pendingDocuments,
  signedDocuments,
  formatDate,
  renderStatusBadge,
  onView,
}) => {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending" className="relative">
          Pendentes
          {pendingDocuments.length > 0 && (
            <span className="ml-1 rounded-full bg-medico-600 px-1.5 py-0.5 text-xs text-white">
              {pendingDocuments.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="signed">
          Assinados
          {signedDocuments.length > 0 && (
            <span className="ml-1 rounded-full bg-neutral-200 px-1.5 py-0.5 text-xs text-neutral-700">
              {signedDocuments.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <DocumentsTabPanel
        value="pending"
        documents={pendingDocuments}
        formatDate={formatDate}
        renderStatusBadge={renderStatusBadge}
        onView={onView}
      />
      
      <DocumentsTabPanel
        value="signed"
        documents={signedDocuments}
        formatDate={formatDate}
        renderStatusBadge={renderStatusBadge}
        onView={onView}
      />
    </Tabs>
  );
};
