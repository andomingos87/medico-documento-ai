import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProcedureItem } from './types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: ProcedureItem | null;
}

export const ViewProcedureDialog: React.FC<Props> = ({ open, onOpenChange, item }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Procedimento</DialogTitle>
          <DialogDescription>Informações básicas do procedimento</DialogDescription>
        </DialogHeader>
        {item && (
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-neutral-500">Procedimento</div>
              <div className="font-medium">{item.name}</div>
            </div>
            <div>
              <div className="text-neutral-500">Categoria</div>
              <div className="font-medium">{item.category}</div>
            </div>
            {item.description && (
              <div>
                <div className="text-neutral-500">Descrição</div>
                <div className="whitespace-pre-wrap">{item.description}</div>
              </div>
            )}
            {item.risks && (
              <div>
                <div className="text-neutral-500">Riscos</div>
                <div className="whitespace-pre-wrap">{item.risks}</div>
              </div>
            )}
            {item.contraindications && (
              <div>
                <div className="text-neutral-500">Contraindicações</div>
                <div className="whitespace-pre-wrap">{item.contraindications}</div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
