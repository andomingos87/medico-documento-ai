import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { UserCog } from 'lucide-react';
import { ProfessionalForm } from './ProfessionalForm';
import type { NewProfessionalValues, Professional } from '@/hooks/useProfessionals';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: Professional | null;
  onSubmit: (values: NewProfessionalValues) => void;
}

export const EditProfessionalDialog: React.FC<Props> = ({ open, onOpenChange, item, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <UserCog className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Editar Profissional</DialogTitle>
              <DialogDescription>Atualize os dados do profissional.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        <ProfessionalForm
          defaultValues={item ?? undefined}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Salvar"
        />
      </DialogContent>
    </Dialog>
  );
};
