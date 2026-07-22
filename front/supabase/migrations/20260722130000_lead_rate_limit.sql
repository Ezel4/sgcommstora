-- =============================================================================
-- Stora AI — Anti-abus du formulaire de leads
-- Ajoute un rate-limit durable par IP (haché) et l'intègre à submit_lead_form.
-- Durable car stocké en base : fiable même sur un hébergement serverless où la
-- mémoire process n'est pas partagée entre instances.
-- =============================================================================

-- Compteur par fenêtre glissante d'une heure, clé = hash d'IP (jamais l'IP brute).
create table if not exists public.lead_rate_limits (
  ip_hash      text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

alter table public.lead_rate_limits enable row level security;
alter table public.lead_rate_limits force row level security;
-- Aucune policy : seule la fonction SECURITY DEFINER ci-dessous y accède.

-- Remplace submit_lead_form en ajoutant le paramètre p_ip_hash et le quota.
-- Signature précédente (sans p_ip_hash) supprimée pour éviter l'ambiguïté.
drop function if exists public.submit_lead_form(text, text, text, text, text);

create or replace function public.submit_lead_form(
  p_name    text,
  p_email   text,
  p_phone   text,
  p_company text,
  p_source  text,
  p_ip_hash text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_max_per_hour constant integer := 5;
  v_count        integer;
begin
  if coalesce(trim(p_name), '') = '' then
    raise exception 'Le nom est requis.' using errcode = '22023';
  end if;

  -- Rate-limit par IP (si fournie). Fenêtre glissante d'une heure.
  if p_ip_hash is not null and p_ip_hash <> '' then
    insert into public.lead_rate_limits (ip_hash, window_start, count)
    values (p_ip_hash, now(), 1)
    on conflict (ip_hash) do update
      set count        = case
                           when public.lead_rate_limits.window_start < now() - interval '1 hour'
                             then 1
                           else public.lead_rate_limits.count + 1
                         end,
          window_start = case
                           when public.lead_rate_limits.window_start < now() - interval '1 hour'
                             then now()
                           else public.lead_rate_limits.window_start
                         end
    returning count into v_count;

    if v_count > v_max_per_hour then
      raise exception 'Trop de demandes. Réessaie plus tard.' using errcode = 'P0001';
    end if;
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

revoke execute on function public.submit_lead_form(text, text, text, text, text, text) from public;
grant execute on function public.submit_lead_form(text, text, text, text, text, text) to anon, authenticated;
