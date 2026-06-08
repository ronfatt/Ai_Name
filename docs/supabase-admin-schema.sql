-- 紫微易名 Admin 第一版数据表
-- 在 Supabase SQL Editor 执行。前端不会公开 service role key，所有写入都走 Next.js API。

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id text unique not null,
  session_id text,
  name text,
  phone text,
  zodiac text,
  gender text,
  focus text,
  report_tier text,
  score integer,
  primary_pain text,
  latest_event text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  lead_id text,
  session_id text,
  name text,
  phone text,
  zodiac text,
  gender text,
  focus text,
  report_tier text,
  score integer,
  primary_pain text,
  source text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id text,
  session_id text,
  name text,
  zodiac text,
  gender text,
  focus text,
  report_tier text,
  score integer,
  pattern_name text,
  primary_pain text,
  source text,
  status text,
  error_message text,
  analysis_snapshot jsonb not null default '{}'::jsonb
);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id text,
  session_id text,
  model text,
  source text,
  status text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer not null default 0,
  estimated_cost_usd numeric(12, 6) not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id text,
  provider text,
  provider_payment_id text,
  status text not null default 'pending',
  amount_myr numeric(12, 2) not null default 0,
  report_tier text not null default 'paid',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_lead_id_idx on public.events (lead_id);
create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_lead_id_idx on public.reports (lead_id);
create index if not exists ai_usage_created_at_idx on public.ai_usage (created_at desc);
create index if not exists leads_updated_at_idx on public.leads (updated_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();
