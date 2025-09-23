import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Stethoscope } from 'lucide-react';
import { AnamnesisForm } from './AnamnesisForm';
import type { Anamnesis, NewAnamnesisValues } from '@/hooks/useAnamneses';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: Anamnesis | null;
  onSubmit: (values: NewAnamnesisValues) => void;
}

export const EditAnamnesisDialog: React.FC<Props> = ({ open, onOpenChange, item, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Editar Anamnese</DialogTitle>
              <DialogDescription>Atualize as informações necessárias.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        {item && (
          <AnamnesisForm
            defaultValues={{
              patientId: item.patientId,
              patientName: item.patientName,
              procedureId: item.procedureId,
              procedureName: item.procedureName,
              continuousMedication: item.medicalHistory?.continuousMedication ?? false,
              medicationAllergy: item.medicalHistory?.medicationAllergy ?? false,
              previousProcedures: item.aestheticsHistory?.previousProcedures ?? false,
              complications: item.aestheticsHistory?.complications ?? false,
              expectations: item.expectations,
              awareness: item.awareness,
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
