
import React from 'react';

interface SignaturesHeaderProps {
  onNewDocumentClick?: () => void;
}

export const SignaturesHeader: React.FC<SignaturesHeaderProps> = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Assinaturas Digitais</h1>
        <p className="text-neutral-500 mt-1">
          Gerencie termos de consentimento e assinaturas para procedimentos
        </p>
      </div>
    </div>
  );
};
