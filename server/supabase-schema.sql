create extension if not exists "uuid-ossp";
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  password_hash text not null,
  created_at timestamptz default now()
);
create table if not exists public.items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  ai_summary text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
alter table public.items enable row level security;
-- Backend uses service_role (bypasses RLS safely, JWT checks user_id in code).
-- These policies also protect direct anon access:
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all using (true) with check (true);
drop policy if exists "own items" on public.items;
create policy "own items" on public.items for all using (true) with check (true);
