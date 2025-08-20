-- Create appointments table
create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid references public.professionals(id) on delete set null,
  procedure_id uuid references public.procedures(id) on delete set null,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60,
  status text not null check (status in ('agendado','confirmado','cancelado','concluido')) default 'agendado',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_patient_idx on public.appointments (patient_id);
create index if not exists appointments_professional_idx on public.appointments (professional_id);
create index if not exists appointments_procedure_idx on public.appointments (procedure_id);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists appointments_scheduled_at_idx on public.appointments (scheduled_at);

-- trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

-- RLS
alter table public.appointments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='appointments' and policyname='Allow read for authenticated'
  ) then
    create policy "Allow read for authenticated" on public.appointments for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='appointments' and policyname='Allow insert for authenticated'
  ) then
    create policy "Allow insert for authenticated" on public.appointments for insert to authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='appointments' and policyname='Allow update for authenticated'
  ) then
    create policy "Allow update for authenticated" on public.appointments for update to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='appointments' and policyname='Allow delete for authenticated'
  ) then
    create policy "Allow delete for authenticated" on public.appointments for delete to authenticated using (true);
  end if;
end $$;
