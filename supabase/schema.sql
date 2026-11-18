-- FLOWMATIC cloud workflow storage
-- Run this file in Supabase SQL Editor.
create table if not exists public.workflows (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  status text not null default 'Draft' check (status in ('Active', 'Draft', 'Paused')),
  runs text not null default '0',
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workflows_user_updated_idx
  on public.workflows (user_id, updated_at desc);

alter table public.workflows enable row level security;

drop policy if exists "Users can view their own workflows" on public.workflows;
create policy "Users can view their own workflows"
  on public.workflows for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own workflows" on public.workflows;
create policy "Users can create their own workflows"
  on public.workflows for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own workflows" on public.workflows;
create policy "Users can update their own workflows"
  on public.workflows for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own workflows" on public.workflows;
create policy "Users can delete their own workflows"
  on public.workflows for delete to authenticated
  using (auth.uid() = user_id);
