-- =============================================================================
-- Stora AI — Schéma initial
-- Reconstruit les tables attendues par le front (voir src/lib/supabase/database.types.ts).
-- Idempotent : peut être rejoué sans casser un projet déjà partiellement créé.
-- Les politiques RLS sont dans une migration séparée (…_rls_policies.sql).
-- =============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- --- Administrateurs ---------------------------------------------------------
-- Liste blanche des comptes admin. Alimentée à la main (voir supabase/README.md).
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- --- Boutiques ---------------------------------------------------------------
create table if not exists public.stores (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid references auth.users (id) on delete set null,
  name            text not null,
  slug            text not null unique,
  subdomain       text unique,
  status          text not null default 'draft',
  niche           text,
  audience        text,
  visual_style    text,
  conversion_rate numeric not null default 0,
  generated_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists stores_owner_id_idx on public.stores (owner_id);

-- --- Produits ----------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  store_id     uuid not null references public.stores (id) on delete cascade,
  name         text not null,
  category     text,
  price        numeric not null default 0,
  stock        integer not null default 0,
  status       text not null default 'draft',
  margin_rate  numeric,
  image_prompt text,
  created_at   timestamptz not null default now()
);
create index if not exists products_store_id_idx on public.products (store_id);

-- --- Clients (de la boutique) ------------------------------------------------
create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  store_id     uuid not null references public.stores (id) on delete cascade,
  name         text not null,
  email        text not null,
  segment      text not null default 'nouveau',
  orders_count integer not null default 0,
  total_spent  numeric not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists customers_store_id_idx on public.customers (store_id);

-- --- Commandes ---------------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  store_id      uuid not null references public.stores (id) on delete cascade,
  customer_id   uuid references public.customers (id) on delete set null,
  customer_name text not null,
  order_number  text not null,
  status        text not null default 'pending',
  items_count   integer not null default 0,
  total         numeric not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists orders_store_id_idx on public.orders (store_id);
create index if not exists orders_customer_id_idx on public.orders (customer_id);

-- --- Tâches IA (suggestions par boutique) ------------------------------------
create table if not exists public.ai_tasks (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores (id) on delete cascade,
  title       text not null,
  description text,
  impact      text,
  status      text not null default 'todo',
  created_at  timestamptz not null default now()
);
create index if not exists ai_tasks_store_id_idx on public.ai_tasks (store_id);

-- --- CRM : contacts ----------------------------------------------------------
-- Alimenté par l'onboarding (user_id renseigné) et par le formulaire de leads
-- (user_id null). Consulté uniquement par les admins.
create table if not exists public.crm_contacts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users (id) on delete set null,
  name            text not null,
  company         text,
  email           text,
  phone           text,
  status          text not null default 'lead',
  mrr             numeric not null default 0,
  source          text,
  company_size    text,
  sector          text,
  referral_source text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists crm_contacts_user_id_idx on public.crm_contacts (user_id);

-- --- CRM : notes -------------------------------------------------------------
create table if not exists public.crm_notes (
  id         uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts (id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists crm_notes_contact_id_idx on public.crm_notes (contact_id);

-- --- CRM : rendez-vous -------------------------------------------------------
create table if not exists public.crm_appointments (
  id           uuid primary key default gen_random_uuid(),
  contact_id   uuid not null references public.crm_contacts (id) on delete cascade,
  title        text not null,
  note         text,
  scheduled_at timestamptz not null,
  created_at   timestamptz not null default now()
);
create index if not exists crm_appointments_contact_id_idx on public.crm_appointments (contact_id);
