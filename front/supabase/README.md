# Supabase — schéma & sécurité (Stora AI)

Migrations versionnées qui reconstruisent le schéma attendu par le front
(`src/lib/supabase/database.types.ts`) **avec Row Level Security activée partout**.

## Fichiers

| Migration | Contenu |
|-----------|---------|
| `…_init_schema.sql`   | Tables, clés étrangères, index. |
| `…_functions.sql`     | Fonctions RPC (`is_admin`, `has_completed_onboarding`, `get_user_stats`, `submit_onboarding`, `submit_lead_form`) en `SECURITY DEFINER`. |
| `…_rls_policies.sql`  | Activation RLS + politiques d'accès. |

L'ordre d'application suit le nom des fichiers (horodatage). Le schéma doit être
appliqué avant les fonctions, elles-mêmes avant les politiques.

## Modèle d'accès (RLS)

- **`admin_users`, `crm_contacts`, `crm_notes`, `crm_appointments`** : administrateurs
  uniquement (via `is_admin()`). Les leads/onboarding publics passent par les fonctions
  `SECURITY DEFINER`, jamais par une écriture directe.
- **`stores`, `products`** : lecture publique si la boutique est `published`, sinon le
  propriétaire (`owner_id`) ; écriture réservée au propriétaire ou à un admin.
- **`customers`, `orders`, `ai_tasks`** : privés à la boutique (propriétaire ou admin).

Sans politique correspondante, l'accès est **refusé par défaut** (fail-closed).

## Appliquer les migrations

### Option A — Supabase CLI (recommandé)

```bash
# depuis le dossier front/
supabase link --project-ref <PROJECT_REF>
supabase db push
```

### Option B — SQL Editor du dashboard

Copier-coller le contenu des trois fichiers, dans l'ordre, dans le SQL Editor.

## Désigner un administrateur

Aucune interface ne crée d'admin (volontairement). Après avoir créé le compte via
l'authentification, exécuter :

```sql
insert into public.admin_users (user_id)
values ('<uuid-de-auth.users>')
on conflict do nothing;
```

L'UUID se trouve dans **Authentication → Users** du dashboard Supabase.

## Régénérer les types TypeScript

Après toute modification du schéma, resynchroniser
`src/lib/supabase/database.types.ts` :

```bash
supabase gen types typescript --project-id <PROJECT_REF> --schema public \
  > src/lib/supabase/database.types.ts
```

## Vérifier la sécurité

Après application, lancer les *advisors* Supabase (dashboard → Advisors) ou la
MCP `get_advisors` pour confirmer qu'aucune table n'est exposée sans RLS.
