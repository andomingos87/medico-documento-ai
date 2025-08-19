-- Create documents table for consent terms
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  document_type text not null,
  status text not null check (status in ('rascunho','pendente','assinado')),
  patient text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Indexes to speed up filters/search
create index if not exists documents_created_at_idx on public.documents (created_at desc);
create index if not exists documents_status_idx on public.documents (status);
create index if not exists documents_title_trgm_idx on public.documents using gin (title gin_trgm_ops);
create index if not exists documents_patient_trgm_idx on public.documents using gin (patient gin_trgm_ops);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

-- RLS (adjust as needed)
alter table public.documents enable row level security;
-- Allow authenticated users full access (customize policies as necessary)
create policy if not exists documents_select on public.documents
for select to authenticated using (true);
create policy if not exists documents_insert on public.documents
for insert to authenticated with check (true);
create policy if not exists documents_update on public.documents
for update to authenticated using (true);
create policy if not exists documents_delete on public.documents
for delete to authenticated using (true);
