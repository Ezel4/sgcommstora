-- =============================================================================
-- Stora AI — Documents de boutique (éditeur visuel)
--
-- Deux tables séparées pour ne jamais exposer un brouillon au public :
--   • store_drafts       : brouillon de l'éditeur (propriétaire uniquement) ;
--   • store_publications : version publiée, rendue par /boutique/[slug]
--     (lisible par les visiteurs anonymes quand la boutique est publiée).
--
-- Le document est un JSON structuré (pages → sections → blocs → champs) validé
-- côté serveur avant chaque écriture (voir src/lib/editor/validate-document.ts).
-- `version` sert de verrou optimiste contre l'écrasement entre onglets.
-- Idempotent : peut être rejouée sans casser un projet existant.
-- =============================================================================

-- --- Brouillons --------------------------------------------------------------
create table if not exists public.store_drafts (
  store_id   uuid primary key references public.stores (id) on delete cascade,
  document   jsonb not null,
  version    integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

-- --- Publications ------------------------------------------------------------
create table if not exists public.store_publications (
  store_id     uuid primary key references public.stores (id) on delete cascade,
  document     jsonb not null,
  version      integer not null default 1,
  published_at timestamptz not null default now(),
  published_by uuid references auth.users (id) on delete set null
);

-- --- RLS ---------------------------------------------------------------------
alter table public.store_drafts       enable row level security;
alter table public.store_publications enable row level security;
alter table public.store_drafts       force row level security;

-- Brouillons : propriétaire de la boutique (ou admin) uniquement, en lecture
-- comme en écriture. Jamais accessibles aux visiteurs.
drop policy if exists store_drafts_select on public.store_drafts;
create policy store_drafts_select on public.store_drafts
  for select to authenticated
  using (
    exists (select 1 from public.stores s where s.id = store_drafts.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists store_drafts_insert on public.store_drafts;
create policy store_drafts_insert on public.store_drafts
  for insert to authenticated
  with check (
    exists (select 1 from public.stores s where s.id = store_drafts.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists store_drafts_update on public.store_drafts;
create policy store_drafts_update on public.store_drafts
  for update to authenticated
  using (
    exists (select 1 from public.stores s where s.id = store_drafts.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.stores s where s.id = store_drafts.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists store_drafts_delete on public.store_drafts;
create policy store_drafts_delete on public.store_drafts
  for delete to authenticated
  using (
    exists (select 1 from public.stores s where s.id = store_drafts.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

-- Publications : lecture publique quand la boutique est publiée (même règle
-- que les produits), écriture réservée au propriétaire ou à un admin.
drop policy if exists store_publications_select on public.store_publications;
create policy store_publications_select on public.store_publications
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.stores s
      where s.id = store_publications.store_id
        and (s.status = 'published' or s.owner_id = auth.uid())
    )
    or public.is_admin()
  );

drop policy if exists store_publications_insert on public.store_publications;
create policy store_publications_insert on public.store_publications
  for insert to authenticated
  with check (
    exists (select 1 from public.stores s where s.id = store_publications.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists store_publications_update on public.store_publications;
create policy store_publications_update on public.store_publications
  for update to authenticated
  using (
    exists (select 1 from public.stores s where s.id = store_publications.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.stores s where s.id = store_publications.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists store_publications_delete on public.store_publications;
create policy store_publications_delete on public.store_publications
  for delete to authenticated
  using (
    exists (select 1 from public.stores s where s.id = store_publications.store_id and s.owner_id = auth.uid())
    or public.is_admin()
  );
