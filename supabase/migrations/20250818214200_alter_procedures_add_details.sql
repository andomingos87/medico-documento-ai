-- Add details fields to procedures
alter table public.procedures
  add column if not exists description text not null default '',
  add column if not exists risks text not null default '',
  add column if not exists contraindications text not null default '';
