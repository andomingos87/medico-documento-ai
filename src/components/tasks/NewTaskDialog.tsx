import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { TaskForm } from './TaskForm';
import type { NewTaskValues } from '@/hooks/useTasks';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: NewTaskValues) => void;
}

export const NewTaskDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Nova Tarefa</DialogTitle>
              <DialogDescription>Cadastre uma nova tarefa com prioridade, responsável e vencimento.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        <TaskForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} submitLabel="Criar" />
      </DialogContent>
    </Dialog>
  );
};
