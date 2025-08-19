import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ListChecks } from 'lucide-react';
import { ProcedureForm, ProcedureFormValues } from './ProcedureForm';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: ProcedureFormValues) => void;
}

export const NewProcedureDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <ListChecks className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Novo Procedimento</DialogTitle>
              <DialogDescription>Cadastre um procedimento para utilizar nos termos.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        <ProcedureForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar" />
      </DialogContent>
    </Dialog>
  );
};
