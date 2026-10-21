-- Portal do cliente + painel administrativo da Destrava USA.
-- Rode este arquivo inteiro uma vez no SQL Editor do Supabase.

-- ---------------------------------------------------------------------------
-- Perfis (um por usuário do Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.current_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- ---------------------------------------------------------------------------
-- Empresas (uma LLC por linha; o cliente é ligado pelo e-mail)
-- ---------------------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text,
  company_name text not null,
  state text not null,
  status text not null default 'em_andamento'
    check (status in ('em_andamento', 'ativa', 'pendente', 'cancelada')),
  steps jsonb not null default '{}'::jsonb,
  ein text,
  filing_number text,
  formation_date date,
  registered_agent text,
  us_address text,
  bank_name text,
  annual_report_due date,
  renewal_due date,
  created_at timestamptz not null default now()
);

create index if not exists companies_client_email_idx on public.companies (lower(client_email));

create or replace function public.owns_company(company uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.companies c
    where c.id = company and lower(c.client_email) = public.current_email()
  );
$$;

-- ---------------------------------------------------------------------------
-- Documentos, pendências, atualizações, acessos e configurações
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  category text not null default 'outros'
    check (category in ('societario', 'fiscal', 'contabil', 'bancario', 'cliente', 'outros')),
  path text not null,
  size bigint,
  uploaded_by text not null default 'admin' check (uploaded_by in ('admin', 'client')),
  internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  responsible text not null default 'cliente' check (responsible in ('cliente', 'destrava')),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- Senhas ficam criptografadas no navegador (AES-GCM) com a senha mestra do admin.
-- O banco só guarda o texto cifrado.
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  service text not null,
  url text,
  username text,
  secret text,
  notes text,
  created_at timestamptz not null default now()
);

-- Notas internas ficam fora de "companies" para o cliente nunca conseguir lê-las.
create table if not exists public.company_notes (
  company_id uuid primary key references public.companies (id) on delete cascade,
  notes text not null default ''
);

create table if not exists public.settings (
  key text primary key,
  value text not null
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.documents enable row level security;
alter table public.tasks enable row level security;
alter table public.updates enable row level security;
alter table public.credentials enable row level security;
alter table public.settings enable row level security;
alter table public.company_notes enable row level security;

drop policy if exists "perfil próprio ou admin" on public.profiles;
create policy "perfil próprio ou admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "admin gerencia perfis" on public.profiles;
create policy "admin gerencia perfis" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin gerencia empresas" on public.companies;
create policy "admin gerencia empresas" on public.companies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cliente vê a própria empresa" on public.companies;
create policy "cliente vê a própria empresa" on public.companies
  for select using (lower(client_email) = public.current_email());

drop policy if exists "admin gerencia documentos" on public.documents;
create policy "admin gerencia documentos" on public.documents
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cliente vê documentos" on public.documents;
create policy "cliente vê documentos" on public.documents
  for select using (not internal and public.owns_company(company_id));

drop policy if exists "cliente envia documentos" on public.documents;
create policy "cliente envia documentos" on public.documents
  for insert with check (
    uploaded_by = 'client' and not internal and category = 'cliente'
    and public.owns_company(company_id)
  );

drop policy if exists "admin gerencia pendências" on public.tasks;
create policy "admin gerencia pendências" on public.tasks
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cliente vê pendências" on public.tasks;
create policy "cliente vê pendências" on public.tasks
  for select using (public.owns_company(company_id));

drop policy if exists "admin gerencia atualizações" on public.updates;
create policy "admin gerencia atualizações" on public.updates
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cliente vê atualizações" on public.updates;
create policy "cliente vê atualizações" on public.updates
  for select using (public.owns_company(company_id));

drop policy if exists "só admin acessa credenciais" on public.credentials;
create policy "só admin acessa credenciais" on public.credentials
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "só admin acessa notas" on public.company_notes;
create policy "só admin acessa notas" on public.company_notes
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "só admin acessa configurações" on public.settings;
create policy "só admin acessa configurações" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: bucket privado "documentos", arquivos em <company_id>/<arquivo>
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

drop policy if exists "admin gerencia arquivos" on storage.objects;
create policy "admin gerencia arquivos" on storage.objects
  for all using (bucket_id = 'documentos' and public.is_admin())
  with check (bucket_id = 'documentos' and public.is_admin());

drop policy if exists "cliente baixa arquivos" on storage.objects;
create policy "cliente baixa arquivos" on storage.objects
  for select using (
    bucket_id = 'documentos'
    and exists (
      select 1 from public.documents d
      where d.path = storage.objects.name and not d.internal
        and public.owns_company(d.company_id)
    )
  );

drop policy if exists "cliente envia arquivos" on storage.objects;
create policy "cliente envia arquivos" on storage.objects
  for insert with check (
    bucket_id = 'documentos'
    and public.owns_company(((storage.foldername(name))[1])::uuid)
  );

-- ---------------------------------------------------------------------------
-- Permissões da Data API (necessárias se "expor novas tabelas" estiver desligado).
-- O acesso real continua limitado pelas políticas de RLS acima.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.profiles, public.companies, public.company_notes, public.documents,
  public.tasks, public.updates, public.credentials, public.settings
  to authenticated;
grant execute on function public.is_admin(), public.current_email(), public.owns_company(uuid)
  to authenticated;
