-- Add missing metadata columns to public.documents used by frontend selects
alter table if exists public.documents
  add column if not exists comprehension_level text check (comprehension_level in ('leigo','tecnico','avancado')),
  add column if not exists delivery_channel text check (delivery_channel in ('email','whatsapp')),
  add column if not exists expires_at date;

-- Optional helpful indexes
create index if not exists documents_expires_at_idx on public.documents (expires_at);
create index if not exists documents_comprehension_level_idx on public.documents (comprehension_level);
create index if not exists documents_delivery_channel_idx on public.documents (delivery_channel);
