import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, listTasks, type ListTasksParams, type NewTask, type Task, type TaskPriority, type TaskStatus, updateTask } from '@/integrations/supabase/tasks';
import { useToast } from '@/hooks/use-toast';

export const TASK_PRIORITIES: TaskPriority[] = ['baixa','media','alta','critica'];
export const TASK_STATUSES: TaskStatus[] = ['aberta','em_progresso','concluida','arquivada'];

export type NewTaskValues = NewTask;

export function useTasks() {
  const qc = useQueryClient();
  const { toast } = useToast();

  // filtros e busca
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<TaskPriority | 'todas'>('todas');
  const [status, setStatus] = useState<TaskStatus | 'todas'>('todas');
  const [assigneeId, setAssigneeId] = useState<string | 'todos'>('todos');

  const params: ListTasksParams = useMemo(() => ({ search, priority, status, assigneeId }), [search, priority, status, assigneeId]);

  const { data } = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => listTasks(params),
  });

  const items = data ?? [];

  // seleção e diálogos
  const [selected, setSelected] = useState<Task | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // mutations
  const createMut = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({ title: 'Tarefa criada com sucesso' });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (e: any) => toast({ title: 'Erro ao criar tarefa', description: e?.message ?? String(e), variant: 'destructive' }),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Parameters<typeof updateTask>[1] }) => updateTask(id, values),
    onSuccess: () => {
      toast({ title: 'Tarefa atualizada' });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (e: any) => toast({ title: 'Erro ao atualizar', description: e?.message ?? String(e), variant: 'destructive' }),
  });

  const deleteMut = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({ title: 'Tarefa excluída' });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (e: any) => toast({ title: 'Erro ao excluir', description: e?.message ?? String(e), variant: 'destructive' }),
  });

  // API exposta
  return {
    // dados
    items,
    selected, setSelected,
    // busca/filtros
    search, setSearch,
    priority, setPriority,
    status, setStatus,
    assigneeId, setAssigneeId,
    // diálogos
    isNewOpen, setIsNewOpen,
    isEditOpen, setIsEditOpen,
    isDeleteOpen, setIsDeleteOpen,
    // mutations
    createItem: (v: NewTaskValues) => createMut.mutate(v),
    updateItem: (id: string, values: Parameters<typeof updateTask>[1]) => updateMut.mutate({ id, values }),
    deleteItem: (id: string) => deleteMut.mutate(id),
  };
}
