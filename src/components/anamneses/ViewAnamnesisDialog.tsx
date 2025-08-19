import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Stethoscope } from 'lucide-react';
import type { Anamnesis } from '@/hooks/useAnamneses';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: Anamnesis | null;
}

export const ViewAnamnesisDialog: React.FC<Props> = ({ open, onOpenChange, item }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Detalhes da Anamnese</DialogTitle>
              <DialogDescription>Visualize as informações preenchidas.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        {item && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500">Paciente</p>
                <p className="font-medium">{item.patientName}</p>
              </div>
              <div>
                <p className="text-neutral-500">Procedimento</p>
                <p className="font-medium">{item.procedureName}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Histórico Médico</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uso contínuo de medicamentos: <b>{item.medicalHistory.continuousMedication ? 'Sim' : 'Não'}</b></li>
                <li>Alergia a medicamentos: <b>{item.medicalHistory.medicationAllergy ? 'Sim' : 'Não'}</b></li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Procedimentos Estéticos</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Anteriores: <b>{item.aestheticsHistory.previousProcedures ? 'Sim' : 'Não'}</b></li>
                <li>Complicações: <b>{item.aestheticsHistory.complications ? 'Sim' : 'Não'}</b></li>
              </ul>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500">Expectativas e características</p>
                <p className="whitespace-pre-wrap">{item.expectations || '-'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Consciência sobre resultados</p>
                <p className="whitespace-pre-wrap">{item.awareness || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
