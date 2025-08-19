import { supabase } from './client';

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'critica';
export type TaskStatus = 'aberta' | 'em_progresso' | 'concluida' | 'arquivada';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignee_id?: string | null;
  due_date?: string | null; // ISO date-only (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
  assignee?: { id: string; name: string | null } | null;
};

export type ListTasksParams = {
  search?: string;
  priority?: TaskPriority | 'todas';
  status?: TaskStatus | 'todas';
  assigneeId?: string | 'todos';
};

export async function listTasks(params: ListTasksParams = {}): Promise<Task[]> {
  const { search, priority, status, assigneeId } = params;
  let query = (supabase as any)
    .from('tasks')
    .select('id,title,description,priority,status,assignee_id,due_date,created_at,updated_at, assignee:professionals!tasks_assignee_id_fkey(id,name)')
    .order('created_at', { ascending: false });

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(
      `title.ilike.${s},description.ilike.${s}`
    );
  }
  if (priority && priority !== 'todas') {
    query = query.eq('priority', priority);
  }
  if (status && status !== 'todas') {
    query = query.eq('status', status);
  }
  if (assigneeId && assigneeId !== 'todos') {
    query = query.eq('assignee_id', assigneeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as any) as Task[];
}

export type NewTask = {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null; // YYYY-MM-DD
};

export async function createTask(values: NewTask): Promise<Task> {
  const payload = { ...values };
  const { data, error } = await (supabase as any).from('tasks').insert(payload).select('*').single();
  if (error) throw error;
  return data as Task;
}

export type UpdateTask = Partial<NewTask> & { status?: TaskStatus };

export async function updateTask(id: string, values: UpdateTask): Promise<Task> {
  const { data, error } = await (supabase as any)
    .from('tasks')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await (supabase as any).from('tasks').delete().eq('id', id);
  if (error) throw error;
}
