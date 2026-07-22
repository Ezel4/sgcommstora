-- =============================================================================
-- Stora AI — Fonctions RPC
-- Toutes en SECURITY DEFINER avec search_path verrouillé : elles encapsulent les
-- accès sensibles (auth.users, écritures CRM publiques) et contournent la RLS de
-- façon contrôlée. Chaque fonction vérifie elle-même ses droits.
-- =============================================================================

-- --- is_admin() : le compte courant est-il administrateur ? ------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- --- has_completed_onboarding() ---------------------------------------------
-- Vrai si l'utilisateur a déjà renseigné son onboarding (contact CRM avec
-- company_size). Utilisé pour rediriger vers /onboarding si nécessaire.
create or replace function public.has_completed_onboarding()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.crm_contacts
    where user_id = auth.uid()
      and company_size is not null
  );
$$;

-- --- submit_onboarding() -----------------------------------------------------
-- Enregistre (ou met à jour) le contact CRM lié à l'utilisateur connecté.
-- Un seul contact « onboarding » par utilisateur.
create or replace function public.submit_onboarding(
  p_company_name    text,
  p_company_size    text,
  p_sector          text,
  p_referral_source text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
begin
  if v_uid is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select email into v_email from auth.users where id = v_uid;

  if exists (select 1 from public.crm_contacts where user_id = v_uid) then
    update public.crm_contacts
       set company         = p_company_name,
           company_size    = p_company_size,
           sector          = p_sector,
           referral_source = p_referral_source,
           email           = coalesce(email, v_email),
           updated_at      = now()
     where user_id = v_uid;
  else
    insert into public.crm_contacts
      (user_id, name, email, company, company_size, sector, referral_source, source, status)
    values
      (v_uid, coalesce(v_email, 'Utilisateur'), v_email, p_company_name,
       p_company_size, p_sector, p_referral_source, 'onboarding', 'lead');
  end if;
end;
$$;

-- --- submit_lead_form() ------------------------------------------------------
-- Insère un lead depuis un formulaire public (aucune session requise).
-- L'anti-abus (rate-limiting / captcha) reste à ajouter côté application.
create or replace function public.submit_lead_form(
  p_name    text,
  p_email   text,
  p_phone   text,
  p_company text,
  p_source  text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(trim(p_name), '') = '' then
    raise exception 'Le nom est requis.' using errcode = '22023';
  end if;

  insert into public.crm_contacts (name, email, phone, company, source, status)
  values (
    p_name,
    nullif(trim(p_email), ''),
    nullif(trim(p_phone), ''),
    nullif(trim(p_company), ''),
    coalesce(nullif(trim(p_source), ''), 'formulaire'),
    'lead'
  );
end;
$$;

-- --- get_user_stats() : statistiques d'inscription (admin) -------------------
create or replace function public.get_user_stats()
returns table (
  total_users       bigint,
  confirmed_users   bigint,
  unconfirmed_users bigint,
  new_this_week     bigint,
  new_this_month    bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;

  return query
  select
    count(*)::bigint,
    count(*) filter (where email_confirmed_at is not null)::bigint,
    count(*) filter (where email_confirmed_at is null)::bigint,
    count(*) filter (where created_at >= now() - interval '7 days')::bigint,
    count(*) filter (where created_at >= date_trunc('month', now()))::bigint
  from auth.users;
end;
$$;

-- --- Droits d'exécution ------------------------------------------------------
-- On révoque l'accès par défaut (public) puis on l'accorde explicitement.
revoke execute on function public.is_admin()                 from public;
revoke execute on function public.has_completed_onboarding() from public;
revoke execute on function public.submit_onboarding(text, text, text, text) from public;
revoke execute on function public.submit_lead_form(text, text, text, text, text) from public;
revoke execute on function public.get_user_stats()           from public;

grant execute on function public.is_admin()                 to authenticated;
grant execute on function public.has_completed_onboarding() to authenticated;
grant execute on function public.submit_onboarding(text, text, text, text) to authenticated;
grant execute on function public.get_user_stats()           to authenticated;
-- Le formulaire de leads est public : accessible aux visiteurs non connectés.
grant execute on function public.submit_lead_form(text, text, text, text, text) to anon, authenticated;
