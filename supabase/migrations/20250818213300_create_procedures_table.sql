-- Required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create procedures table
create table if not exists public.procedures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Geral','Cirúrgico','Estético','Diagnóstico','Terapêutico')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_procedures_updated_at
before update on public.procedures
for each row execute function public.set_updated_at();

-- Indexes
create index if not exists procedures_name_idx on public.procedures using gin (to_tsvector('portuguese', name));
create index if not exists procedures_category_idx on public.procedures(category);

-- RLS
alter table public.procedures enable row level security;

-- Allow authenticated users full access
create policy if not exists procedures_select on public.procedures
  for select to authenticated using (true);

create policy if not exists procedures_insert on public.procedures
  for insert to authenticated with check (true);

create policy if not exists procedures_update on public.procedures
  for update to authenticated using (true);

create policy if not exists procedures_delete on public.procedures
  for delete to authenticated using (true);
