-- Create professionals table
create extension if not exists pgcrypto;

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text not null,
  role text not null check (role in (
    'Médico', 'Dentista', 'Biomédico', 'enfermeiro', 'Esteticista', 'Farmaceutico', 'Outros'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- email unique (case-insensitive)
create unique index if not exists professionals_email_key on public.professionals (lower(email));

-- search indexes
create index if not exists professionals_name_idx on public.professionals (lower(name));
create index if not exists professionals_role_idx on public.professionals (role);

-- trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_professionals_updated_at
before update on public.professionals
for each row execute function public.set_updated_at();

-- RLS
alter table public.professionals enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'professionals' and policyname = 'Allow read for authenticated'
  ) then
    create policy "Allow read for authenticated" on public.professionals for select to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'professionals' and policyname = 'Allow insert for authenticated'
  ) then
    create policy "Allow insert for authenticated" on public.professionals for insert to authenticated with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'professionals' and policyname = 'Allow update for authenticated'
  ) then
    create policy "Allow update for authenticated" on public.professionals for update to authenticated using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'professionals' and policyname = 'Allow delete for authenticated'
  ) then
    create policy "Allow delete for authenticated" on public.professionals for delete to authenticated using (true);
  end if;
end $$;
