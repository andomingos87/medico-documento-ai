import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProcedureForm, ProcedureFormValues } from './ProcedureForm';
import { ProcedureItem } from './types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: ProcedureItem | null;
  onSubmit: (values: ProcedureFormValues) => void;
}

export const EditProcedureDialog: React.FC<Props> = ({ open, onOpenChange, item, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Procedimento</DialogTitle>
        </DialogHeader>
        {item && (
          <ProcedureForm
            defaultValues={{ 
              name: item.name, 
              category: item.category,
              description: item.description || '',
              risks: item.risks || '',
              contraindications: item.contraindications || ''
            }}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Salvar"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
