
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle } from 'lucide-react';
import { DocumentsTabPanel } from './DocumentsTabPanel';
import { BenefitsCard } from './BenefitsCard';
import { ConsentDocument } from './types';

interface SignaturesContentProps {
  pendingDocuments: ConsentDocument[];
  signedDocuments: ConsentDocument[];
  formatDate: (dateString: string) => string;
  renderStatusBadge: (status: 'pending' | 'signed') => React.ReactNode;
  onView: (doc: ConsentDocument) => void;
}

export const SignaturesContent: React.FC<SignaturesContentProps> = ({
  pendingDocuments,
  signedDocuments,
  formatDate,
  renderStatusBadge,
  onView
}) => {
  return (
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
              onView={onView}
            />
            
            <DocumentsTabPanel
              value="signed"
              documents={signedDocuments}
              formatDate={formatDate}
              renderStatusBadge={renderStatusBadge}
              onView={onView}
            />
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};
