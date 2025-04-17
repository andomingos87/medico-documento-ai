import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { SearchFilterBar } from '@/components/signatures/SearchFilterBar';
import { SignaturesHeader } from '@/components/signatures/SignaturesHeader';
import { SignaturesContent } from '@/components/signatures/SignaturesContent';
import { NewDocumentDialog } from '@/components/signatures/NewDocumentDialog';
import { DocumentViewDialog } from '@/components/signatures/DocumentViewDialog';
import { Badge } from '@/components/ui/badge';
import { ConsentDocument } from '@/components/signatures/types';

export const Signatures = () => {
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState(false);
  
  const {
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
    isGenerating,
    isSigning,
    handleViewDocument,
    handleGenerateDocument,
    handleCaptureSignature,
    handleSignDocument,
    formatDate,
    renderStatusBadge
  } = useDocuments();

  // Handler for viewing a document
  const onViewDocument = (document: ConsentDocument) => {
    handleViewDocument(document);
    setIsViewDocumentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <SignaturesHeader
        onNewDocumentClick={() => setIsNewDocumentDialogOpen(true)}
      />
      
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredStatus={filteredStatus}
        onStatusChange={setFilteredStatus}
      />
      
      <SignaturesContent
        pendingDocuments={pendingDocuments}
        signedDocuments={signedDocuments}
        formatDate={formatDate}
        renderStatusBadge={renderStatusBadge}
        onView={onViewDocument}
      />
      
      <NewDocumentDialog
        isOpen={isNewDocumentDialogOpen}
        onOpenChange={setIsNewDocumentDialogOpen}
        onSubmit={(values) => {
          handleGenerateDocument(values);
          setIsNewDocumentDialogOpen(false);
        }}
        isGenerating={isGenerating}
      />
      
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
