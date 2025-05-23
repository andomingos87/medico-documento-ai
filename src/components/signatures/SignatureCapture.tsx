
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, PenTool } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface SignatureCaptureProps {
  signatureData: string | null;
  onCaptureSignature: () => void;
  onSignDocument: () => void;
  onCancel: () => void;
  isSigning: boolean;
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  signatureData,
  onCaptureSignature,
  onSignDocument,
  onCancel,
  isSigning
}) => {
  return (
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
            onClick={onCaptureSignature}
          >
            <PenTool className="h-10 w-10 text-neutral-400 mb-2" />
            <p className="text-neutral-600 text-center">Clique para capturar assinatura digital</p>
          </div>
        )}
      </div>
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          className="bg-medico-600 hover:bg-medico-700" 
          disabled={!signatureData || isSigning}
          onClick={onSignDocument}
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
  );
};
