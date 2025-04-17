
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-medico-600 hover:bg-medico-700">
          <FileText className="mr-2 h-4 w-4" />
          Novo Termo de Consentimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Gerar Termo de Consentimento</DialogTitle>
          <DialogDescription>
            Preencha os dados do paciente e do procedimento para gerar um termo de consentimento personalizado.
          </DialogDescription>
        </DialogHeader>
        
        <NewDocumentForm 
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isGenerating={isGenerating}
        />
      </DialogContent>
    </Dialog>
  );
};
