# Mise en place de Supabase, Resend et Vercel

Procédure pas à pas pour mettre le site en ligne. Comptez environ une heure.

> **Propriété des comptes** : créez chaque compte (Supabase, Resend, Vercel, nom de
> domaine, organisation GitHub) avec une **adresse e-mail du festival**, jamais une
> adresse personnelle ou celle d'une agence. Gardez les identifiants dans un
> gestionnaire de mots de passe partagé avec les seules personnes autorisées.

---

## 1. Créer le projet Supabase

1. Sur <https://supabase.com>, créez une organisation « FIF AWARDS » puis un projet
   `fif-awards-2026`. Région conseillée : **West EU (Paris)**, la plus proche de Conakry.
2. Notez le mot de passe de la base dans le gestionnaire de mots de passe.

## 2. Créer les tables

Dans **SQL Editor → New query** :

1. Collez le contenu de `supabase/migrations/20261004000000_schema_initial.sql`, puis **Run**.
2. Nouvelle requête : collez `supabase/seed.sql` (les quatre distinctions et la
   première actualité), puis **Run**.

Ce script crée les tables, les règles de sécurité (RLS), la ligne de réglages et le
bucket d'images `medias` (5 Mo maximum, JPG, PNG ou WebP).

> Avec la CLI Supabase, `supabase link` puis `supabase db push` font la même chose.

## 3. Fermer les inscriptions

**Authentication → Sign In / Providers** :

- laissez **Email** activé ;
- **désactivez « Allow new users to sign up »**. Les comptes sont créés
  uniquement depuis l'admin (menu « Comptes ») ou par le tableau de bord Supabase.

**Authentication → URL Configuration** : mettez l'adresse du site dans **Site URL**
(par exemple `https://fifawards.gn`).

## 4. Créer le premier administrateur

1. **Authentication → Users → Add user → Create new user** : e-mail du festival,
   mot de passe fort (12 caractères minimum), cochez **Auto Confirm User**.
2. Dans **SQL Editor**, donnez-lui le rôle administrateur :

   ```sql
   insert into public.administrateurs (user_id, email, role)
   select id, email, 'admin' from auth.users where email = 'admin@exemple.gn';
   ```

Les comptes suivants se créent directement depuis `/admin/comptes`.

## 5. Récupérer les clés

**Project Settings → API** (ou **API Keys**) :

| Variable                        | Où la trouver                            |
| ------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé `anon` / publishable                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | clé `service_role` / secret (à garder secrète) |

Générez aussi `HASH_SECRET` : une longue valeur aléatoire (`openssl rand -hex 32`).

## 6. E-mails avec Resend

1. Créez un compte sur <https://resend.com> avec l'e-mail du festival, puis une clé
   API → `RESEND_API_KEY`.
2. **Avant l'achat du domaine** : gardez `EMAIL_EXPEDITEUR=FIF AWARDS <onboarding@resend.dev>`.
   Resend n'envoie alors qu'à l'adresse du compte Resend : mettez cette adresse dans
   `EMAIL_EQUIPE`. Laissez `EMAIL_CONFIRMATIONS_ACTIVES=false`.
3. **Après l'achat du domaine** : **Domains → Add domain**, ajoutez les enregistrements
   DNS demandés (SPF, DKIM) chez le registraire, attendez la vérification, puis :
   - `EMAIL_EXPEDITEUR=FIF AWARDS <contact@votre-domaine>` ;
   - `EMAIL_EQUIPE=` les adresses de l'équipe, séparées par des virgules ;
   - `EMAIL_CONFIRMATIONS_ACTIVES=true` (accusés de réception aux candidats).
4. Vérifiez les limites d'envoi du plan gratuit (quota quotidien et mensuel) avant
   l'ouverture des candidatures.

## 7. Déployer sur Vercel

1. Sur <https://vercel.com>, **Add New → Project**, importez le dépôt GitHub.
2. **Environment Variables** : copiez toutes les variables de `.env.example` avec
   leurs vraies valeurs.
3. **Deploy**. Puis **Settings → Domains** pour brancher le nom de domaine, et mettez
   à jour `NEXT_PUBLIC_SITE_URL` et la **Site URL** de Supabase.

## 8. Vérifications avant l'ouverture

- [ ] `/admin` sans être connecté renvoie vers la page de connexion.
- [ ] Un distingué ajouté en brouillon n'apparaît pas sur `/distingues`.
- [ ] Une candidature et un message de test apparaissent dans l'admin, et l'équipe
      reçoit la notification.
- [ ] `/voter` affiche une page introuvable tant que le vote est éteint.
- [ ] Le site s'affiche correctement sur un téléphone.

## Points d'attention

- **Plan gratuit Supabase** : un projet inactif pendant une semaine est mis en
  pause. Passez au plan Pro avant le festival, ou au minimum vérifiez son état la
  veille de chaque annonce.
- **Sauvegardes** : le plan gratuit n'a pas de sauvegarde automatique téléchargeable.
  Exportez régulièrement les candidatures en CSV depuis l'admin.
- **Clé service_role** : elle contourne toutes les règles de sécurité. Elle ne doit
  exister que dans Vercel et dans le gestionnaire de mots de passe.
