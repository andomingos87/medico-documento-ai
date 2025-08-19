-- Create tasks table with relation to professionals (assignee)
create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text not null check (priority in ('baixa','media','alta','critica')) default 'media',
  assignee_id uuid references public.professionals(id) on delete set null,
  due_date date,
  status text not null check (status in ('aberta','em_progresso','concluida','arquivada')) default 'aberta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_title_idx on public.tasks using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,'')));
create index if not exists tasks_priority_idx on public.tasks (priority);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_assignee_idx on public.tasks (assignee_id);
create index if not exists tasks_due_date_idx on public.tasks (due_date);

-- trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- RLS
alter table public.tasks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Allow read for authenticated'
  ) then
    create policy "Allow read for authenticated" on public.tasks for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Allow insert for authenticated'
  ) then
    create policy "Allow insert for authenticated" on public.tasks for insert to authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Allow update for authenticated'
  ) then
    create policy "Allow update for authenticated" on public.tasks for update to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='tasks' and policyname='Allow delete for authenticated'
  ) then
    create policy "Allow delete for authenticated" on public.tasks for delete to authenticated using (true);
  end if;
end $$;
