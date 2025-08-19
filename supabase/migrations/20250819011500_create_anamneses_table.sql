-- Create anamneses table
-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

-- Create anamneses table
create table if not exists public.anamneses (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  patient_name text not null,
  procedure_id text not null,
  procedure_name text not null,
  created_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft','link_sent','completed')),
  medical_history jsonb not null default '{}'::jsonb,
  aesthetics_history jsonb not null default '{}'::jsonb,
  expectations text not null default '',
  awareness text not null default ''
);

-- Enable RLS and add permissive policies for authenticated users
alter table public.anamneses enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'anamneses' and policyname = 'Allow read for authenticated'
  ) then
    create policy "Allow read for authenticated" on public.anamneses for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'anamneses' and policyname = 'Allow insert for authenticated'
  ) then
    create policy "Allow insert for authenticated" on public.anamneses for insert to authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'anamneses' and policyname = 'Allow update for authenticated'
  ) then
    create policy "Allow update for authenticated" on public.anamneses for update to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'anamneses' and policyname = 'Allow delete for authenticated'
  ) then
    create policy "Allow delete for authenticated" on public.anamneses for delete to authenticated using (true);
  end if;
end $$;
