import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-subtle opacity-50 -z-10" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Gerar Termo de Consentimento
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground leading-relaxed">
            Preencha os dados do paciente e do procedimento para gerar um termo de consentimento personalizado com inteligência artificial.
          </DialogDescription>
          <Separator className="mt-4" />
        </DialogHeader>
        
        <div className="pt-2">
          <NewDocumentForm 
            onSubmit={onSubmit} 
            onCancel={() => onOpenChange(false)} 
            isGenerating={isGenerating} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};