import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NewTaskValues } from '@/hooks/useTasks';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/hooks/useTasks';
import { useProfessionals } from '@/hooks/useProfessionals';

interface Props {
  defaultValues?: Partial<NewTaskValues> & { status?: string };
  onSubmit: (values: NewTaskValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const PRIORITY_LABEL: Record<string,string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
};

export const TaskForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const { items: professionals } = useProfessionals();

  const [values, setValues] = useState<NewTaskValues>({
    title: defaultValues?.title ?? '',
    description: defaultValues?.description ?? '',
    priority: (defaultValues?.priority as any) ?? 'media',
    assignee_id: defaultValues?.assignee_id ?? null,
    due_date: defaultValues?.due_date ?? '',
  });
  const [titleError, setTitleError] = useState<string | null>(null);

  const assigneeOptions = useMemo(() => (
    professionals.map(p => ({ id: p.id, name: p.name }))
  ), [professionals]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!values.title.trim()) {
          setTitleError('Informe um título.');
          return;
        }
        setTitleError(null);
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" value={values.title} onChange={(e) => { setValues(v => ({ ...v, title: e.target.value })); if (titleError) setTitleError(null); }} placeholder="Ex.: Ligar para paciente" required />
          {titleError && <p className="mt-1 text-xs text-red-600">{titleError}</p>}
        </div>
        <div>
          <Label>Prioridade</Label>
          <Select value={values.priority} onValueChange={(val) => setValues(v => ({ ...v, priority: val as any }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map(p => (
                <SelectItem key={p} value={p}>{PRIORITY_LABEL[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Responsável</Label>
          <Select value={values.assignee_id ?? 'none'} onValueChange={(val) => setValues(v => ({ ...v, assignee_id: val === 'none' ? null : val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem responsável</SelectItem>
              {assigneeOptions.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="due">Vencimento</Label>
          <Input id="due" type="date" value={values.due_date ?? ''} onChange={(e) => setValues(v => ({ ...v, due_date: e.target.value }))} />
        </div>
      </div>

      <div>
        <Label htmlFor="desc">Descrição</Label>
        <Textarea id="desc" value={values.description ?? ''} onChange={(e) => setValues(v => ({ ...v, description: e.target.value }))} placeholder="Detalhes da tarefa" rows={4} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
