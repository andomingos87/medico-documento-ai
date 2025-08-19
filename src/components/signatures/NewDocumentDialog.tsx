import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { NewDocumentForm, NewDocumentFormValues } from './NewDocumentForm';

interface NewDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewDocumentFormValues) => void;
  isGenerating: boolean;
}

export const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isGenerating
}) => {
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Gerar Termo de Consentimento</DialogTitle>
              <DialogDescription className="mt-1">
                Preencha os dados do paciente e do procedimento para gerar um termo personalizado.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />

        <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-sm text-neutral-800 mb-4">
          Dica: você pode buscar o paciente por nome, CPF ou email. Se não existir, cadastre um novo diretamente no campo de paciente.
        </div>

        <NewDocumentForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>;
};