-- FLOWMATIC Execution Engine v1
-- Run this entire file in Supabase SQL Editor after the workflows table exists.
create table if not exists public.workflow_runs (
 id uuid primary key,
 workflow_id text not null references public.workflows(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','running','success','failed','cancelled')),
 trigger_data jsonb not null default '{}'::jsonb,
 summary text,
 started_at timestamptz,
 finished_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.workflow_run_steps (
 id uuid primary key,
 run_id uuid not null references public.workflow_runs(id) on delete cascade,
 workflow_id text not null references public.workflows(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 node_id text not null,
 node_name text not null,
 node_type text not null check(node_type in ('trigger','action','condition')),
 position integer not null,
 status text not null default 'pending' check(status in ('pending','running','success','failed','skipped')),
 input jsonb not null default '{}'::jsonb,
 output jsonb,
 error text,
 started_at timestamptz,
 finished_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists workflow_runs_user_created_idx on public.workflow_runs(user_id,created_at desc);
create index if not exists workflow_runs_workflow_idx on public.workflow_runs(workflow_id,created_at desc);
create index if not exists workflow_run_steps_run_position_idx on public.workflow_run_steps(run_id,position);
alter table public.workflow_runs enable row level security;
alter table public.workflow_run_steps enable row level security;
drop policy if exists "Users can view own workflow runs" on public.workflow_runs;
create policy "Users can view own workflow runs" on public.workflow_runs for select to authenticated using(auth.uid()=user_id);
drop policy if exists "Users can create own workflow runs" on public.workflow_runs;
create policy "Users can create own workflow runs" on public.workflow_runs for insert to authenticated with check(auth.uid()=user_id and exists(select 1 from public.workflows w where w.id=workflow_id and w.user_id=auth.uid()));
drop policy if exists "Users can update own workflow runs" on public.workflow_runs;
create policy "Users can update own workflow runs" on public.workflow_runs for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "Users can view own workflow run steps" on public.workflow_run_steps;
create policy "Users can view own workflow run steps" on public.workflow_run_steps for select to authenticated using(auth.uid()=user_id);
drop policy if exists "Users can create own workflow run steps" on public.workflow_run_steps;
create policy "Users can create own workflow run steps" on public.workflow_run_steps for insert to authenticated with check(auth.uid()=user_id and exists(select 1 from public.workflow_runs r where r.id=run_id and r.user_id=auth.uid()));
drop policy if exists "Users can update own workflow run steps" on public.workflow_run_steps;
create policy "Users can update own workflow run steps" on public.workflow_run_steps for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
grant select,insert,update on public.workflow_runs to authenticated;
grant select,insert,update on public.workflow_run_steps to authenticated;
