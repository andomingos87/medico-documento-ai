import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useTasks, TASK_PRIORITIES, TASK_STATUSES } from '@/hooks/useTasks';
import { useProfessionals } from '@/hooks/useProfessionals';
import { TasksList } from '@/components/tasks/TasksList';
import { NewTaskDialog } from '@/components/tasks/NewTaskDialog';
import { EditTaskDialog } from '@/components/tasks/EditTaskDialog';
import { DeleteTaskDialog } from '@/components/tasks/DeleteTaskDialog';

const PRIORITY_LABEL: Record<string,string> = { baixa: 'Baixa', media: 'Média', alta: 'Alta', critica: 'Crítica' };
const STATUS_LABEL: Record<string,string> = { aberta: 'Aberta', em_progresso: 'Em progresso', concluida: 'Concluída', arquivada: 'Arquivada' };

export const Tasks: React.FC = () => {
  const {
    items,
    search, setSearch,
    priority, setPriority,
    status, setStatus,
    assigneeId, setAssigneeId,
    selected, setSelected,
    isNewOpen, setIsNewOpen,
    isEditOpen, setIsEditOpen,
    isDeleteOpen, setIsDeleteOpen,
    createItem, updateItem, deleteItem,
  } = useTasks();

  const { items: professionals } = useProfessionals();

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Buscar por título ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[260px]"
          />

          <div className="flex items-center gap-2">
            <Label className="text-sm">Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {TASK_PRIORITIES.map(p => (
                  <SelectItem key={p} value={p}>{PRIORITY_LABEL[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos</SelectItem>
                {TASK_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Responsável</Label>
            <Select value={assigneeId} onValueChange={(v) => setAssigneeId(v as any)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {professionals.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <TasksList
        items={items}
        onEdit={(item) => { setSelected(item); setIsEditOpen(true); }}
        onDelete={(item) => { setSelected(item); setIsDeleteOpen(true); }}
      />

      <NewTaskDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSubmit={(values) => { createItem(values); setIsNewOpen(false); }}
      />

      <EditTaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        item={selected}
        onSubmit={(values) => { if (selected) updateItem(selected.id, values); setIsEditOpen(false); }}
      />

      <DeleteTaskDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={() => { if (selected) deleteItem(selected.id); setIsDeleteOpen(false); }}
      />
    </div>
  );
};
