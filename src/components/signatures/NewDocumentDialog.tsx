import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Gerar Termo de Consentimento</DialogTitle>
              <DialogDescription className="text-sm">
                Preencha os dados do paciente e do procedimento para gerar um termo personalizado.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <Separator />
        
        <NewDocumentForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} isGenerating={isGenerating} />
      </DialogContent>
    </Dialog>;
};