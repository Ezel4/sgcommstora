-- =============================================================================
-- Stora AI — Row Level Security
-- Modèle d'accès :
--   • admin_users / crm_*        → administrateurs uniquement (via is_admin()).
--   • stores / products          → lecture publique si « published », sinon le
--                                  propriétaire (owner_id) ; écriture = propriétaire
--                                  ou admin.
--   • customers / orders / ai_tasks → propriétaire de la boutique ou admin.
-- Les fonctions SECURITY DEFINER (onboarding, lead, stats) contournent la RLS de
-- façon contrôlée : les visiteurs n'écrivent jamais directement dans les tables.
-- =============================================================================

-- Activer RLS partout. Sans policy, l'accès est refusé par défaut (fail-closed).
alter table public.admin_users      enable row level security;
alter table public.stores           enable row level security;
alter table public.products         enable row level security;
alter table public.customers        enable row level security;
alter table public.orders           enable row level security;
alter table public.ai_tasks         enable row level security;
alter table public.crm_contacts     enable row level security;
alter table public.crm_notes        enable row level security;
alter table public.crm_appointments enable row level security;

-- Verrou supplémentaire : personne ne force une valeur via un rôle privilégié
-- par erreur. (facultatif mais sain)
alter table public.admin_users      force row level security;
alter table public.crm_contacts     force row level security;
alter table public.crm_notes        force row level security;
alter table public.crm_appointments force row level security;

-- =============================================================================
-- admin_users : lecture réservée aux admins. Aucune écriture cliente
-- (l'ajout d'un admin se fait via le service_role / SQL, pas depuis l'app).
-- =============================================================================
drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select on public.admin_users
  for select to authenticated
  using (public.is_admin());

-- =============================================================================
-- stores
-- =============================================================================
drop policy if exists stores_select on public.stores;
create policy stores_select on public.stores
  for select to anon, authenticated
  using (
    status = 'published'
    or owner_id = auth.uid()
    or public.is_admin()
  );

drop policy if exists stores_insert on public.stores;
create policy stores_insert on public.stores
  for insert to authenticated
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists stores_update on public.stores;
create policy stores_update on public.stores
  for update to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists stores_delete on public.stores;
create policy stores_delete on public.stores
  for delete to authenticated
  using (owner_id = auth.uid() or public.is_admin());

-- =============================================================================
-- products : lecture publique si la boutique est publiée
-- =============================================================================
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id
        and (s.status = 'published' or s.owner_id = auth.uid())
    )
    or public.is_admin()
  );

drop policy if exists products_write on public.products;
create policy products_write on public.products
  for all to authenticated
  using (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id and s.owner_id = auth.uid()
    )
    or public.is_admin()
  )
  with check (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id and s.owner_id = auth.uid()
    )
    or public.is_admin()
  );

-- =============================================================================
-- customers / orders / ai_tasks : privés à la boutique (propriétaire ou admin)
-- =============================================================================
drop policy if exists customers_all on public.customers;
create policy customers_all on public.customers
  for all to authenticated
  using (
    exists (select 1 from public.stores s where s.id = customers.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.stores s where s.id = customers.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists orders_all on public.orders;
create policy orders_all on public.orders
  for all to authenticated
  using (
    exists (select 1 from public.stores s where s.id = orders.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.stores s where s.id = orders.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists ai_tasks_all on public.ai_tasks;
create policy ai_tasks_all on public.ai_tasks
  for all to authenticated
  using (
    exists (select 1 from public.stores s where s.id = ai_tasks.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.stores s where s.id = ai_tasks.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

-- =============================================================================
-- CRM : réservé aux administrateurs pour tout accès direct.
-- (Les insertions publiques passent par submit_onboarding / submit_lead_form.)
-- =============================================================================
drop policy if exists crm_contacts_admin on public.crm_contacts;
create policy crm_contacts_admin on public.crm_contacts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists crm_notes_admin on public.crm_notes;
create policy crm_notes_admin on public.crm_notes
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists crm_appointments_admin on public.crm_appointments;
create policy crm_appointments_admin on public.crm_appointments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
