-- Add relational columns and FKs to public.documents for PostgREST embeds
alter table if exists public.documents
  add column if not exists procedure_id uuid,
  add column if not exists patient_id uuid;

-- Add foreign keys (nullable, set null on delete)
do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'documents' and c.conname = 'documents_procedure_id_fkey'
  ) then
    alter table public.documents
      add constraint documents_procedure_id_fkey
      foreign key (procedure_id) references public.procedures(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    where t.relname = 'documents' and c.conname = 'documents_patient_id_fkey'
  ) then
    alter table public.documents
      add constraint documents_patient_id_fkey
      foreign key (patient_id) references public.patients(id) on delete set null;
  end if;
end $$;

-- Helpful indexes for filtering/joins
create index if not exists documents_procedure_id_idx on public.documents (procedure_id);
create index if not exists documents_patient_id_idx on public.documents (patient_id);
