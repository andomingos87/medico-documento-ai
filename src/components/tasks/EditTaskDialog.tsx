import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Pencil } from 'lucide-react';
import { TaskForm } from './TaskForm';
import type { Task } from '@/integrations/supabase/tasks';
import type { NewTaskValues } from '@/hooks/useTasks';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: Task | null;
  onSubmit: (values: NewTaskValues) => void;
}

export const EditTaskDialog: React.FC<Props> = ({ open, onOpenChange, item, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Pencil className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Editar Tarefa</DialogTitle>
              <DialogDescription>Atualize os detalhes da tarefa selecionada.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        {item && (
          <TaskForm
            defaultValues={{
              title: item.title,
              description: item.description ?? '',
              priority: item.priority,
              assignee_id: item.assignee_id ?? null,
              due_date: item.due_date ?? '',
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
