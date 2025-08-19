import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { UserPlus } from 'lucide-react';
import { ProfessionalForm } from './ProfessionalForm';
import type { NewProfessionalValues } from '@/hooks/useProfessionals';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: NewProfessionalValues) => void;
}

export const NewProfessionalDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Novo Profissional</DialogTitle>
              <DialogDescription>Cadastre um novo profissional para sua clínica.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        <ProfessionalForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar" />
      </DialogContent>
    </Dialog>
  );
};
