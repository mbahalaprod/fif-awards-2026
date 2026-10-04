# FIF AWARDS 2026 — Site officiel

Site du **Festival International du Film AWARDS**, 4ᵉ édition, les **19 et 20 novembre
2026** au **Radisson Blu de Conakry** (Guinée).

Le site présente les **distingués 2026** dans quatre distinctions d'honneur, reçoit
les candidatures, les messages et les demandes de réservation. Il est piloté par un
**espace d'administration interne** (`/admin`) relié à **Supabase**.

| Document                                   | Pour qui                          |
| ------------------------------------------ | --------------------------------- |
| [docs/SUPABASE.md](docs/SUPABASE.md)       | mise en ligne : Supabase, Resend, Vercel |
| [docs/GUIDE-ADMIN.md](docs/GUIDE-ADMIN.md) | équipe du festival : utiliser l'admin |
| ce README                                  | développeurs                      |

---

## Stack

- **Next.js 14** (App Router), **TypeScript** strict, **Tailwind CSS**, composants shadcn/ui
- **Supabase** : PostgreSQL, authentification des administrateurs, stockage des images
- **Resend** : e-mails (appel HTTP direct, sans dépendance)
- **Vercel** : hébergement
- React Hook Form + Zod (formulaires), Framer Motion, Sonner, Lucide

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:3000
```

Sans variables Supabase, le site public s'affiche avec les contenus de départ de
`src/data/` (quatre distinctions, une actualité), les formulaires répondent
« service indisponible » et l'admin affiche un message de configuration.

Vérifications avant chaque push :

```bash
npx tsc --noEmit && npm run lint && npm run build
```

## Variables d'environnement

Toutes sont listées et commentées dans [`.env.example`](.env.example).

| Variable                                      | Rôle                                             |
| --------------------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                        | adresse publique (sitemap, partage, e-mails)     |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | lecture publique et connexion admin |
| `SUPABASE_SERVICE_ROLE_KEY`                   | serveur uniquement : formulaires publics, comptes |
| `HASH_SECRET`                                 | empreinte des e-mails et IP (anti-abus, vote)    |
| `RESEND_API_KEY`, `EMAIL_EXPEDITEUR`, `EMAIL_EQUIPE`, `EMAIL_CONFIRMATIONS_ACTIVES` | e-mails |
| `NEXT_PUBLIC_SHOW_VOTE_RESULTS`               | compteurs de votes visibles (vote désactivé en 2026) |

## Structure

```
supabase/
├── migrations/             # schéma de la base (tables, RLS, bucket « medias »)
└── seed.sql                # données de départ : 4 distinctions, 1 actualité
src/
├── middleware.ts           # protège /admin (session Supabase)
├── app/
│   ├── (site)/             # site public (header + footer)
│   │   ├── distingues/     # « Les distingués 2026 » (+ fiche [slug])
│   │   ├── candidatures/   # formulaire en 3 étapes
│   │   ├── billetterie/    # réservation, confirmation manuelle
│   │   ├── voter/          # vote du public, masqué si vote_actif = false
│   │   └── …               # accueil, à propos, programme, sponsors, presse, blog, contact
│   ├── admin/
│   │   ├── connexion/      # page de connexion
│   │   ├── (espace)/       # modules protégés (tableau de bord, distingués, réglages…)
│   │   └── export/[table]/ # export CSV
│   └── api/                # candidature, contact, billet, vote (+ vote/code)
├── components/
│   ├── admin/              # formulaires et champs de l'admin, envoi d'images
│   ├── distingues/         # cartes, grille, photo
│   └── …
├── lib/
│   ├── supabase/           # clients : public, session, service, navigateur
│   ├── admin/              # authentification et helpers des actions serveur
│   ├── data.ts             # lecture des contenus (Supabase, ou src/data/ en secours)
│   ├── email.ts            # Resend
│   ├── votes.ts            # vote : codes à usage unique, enregistrement
│   ├── documents.ts        # chemins des PDF officiels (null = « bientôt disponible »)
│   └── validations.ts      # schémas Zod
└── data/                   # contenus statiques : programme, billets, éditions précédentes
```

## Données

| Contenu                                   | Source                              | Modifié depuis   |
| ----------------------------------------- | ----------------------------------- | ---------------- |
| Distingués, catégories, sponsors, actualités | Supabase                         | `/admin`         |
| Réglages (interrupteurs, dates, coordonnées, réseaux) | Supabase (`parametres`)  | `/admin/reglages` |
| Candidatures, messages, réservations      | Supabase                            | `/admin` (lecture, statut, CSV) |
| Programme, billets, éditions précédentes  | `src/data/*.json`                   | code             |
| Documents PDF                             | `public/documents/` + `src/lib/documents.ts` | code     |

Les pages publiques sont régénérées toutes les 60 s, et immédiatement après chaque
modification dans l'admin (`revalidatePath`).

## Sécurité

- **RLS** activée sur toutes les tables : le public ne lit que les contenus publiés.
  Les distingués publiés restent cachés tant que `distingues_visibles` est faux.
- Candidatures, messages et réservations : **aucune lecture publique**. L'insertion
  passe par les routes API avec la clé de service, après validation Zod, **champ
  anti-robot** et **limitation par IP** (5 envois par fenêtre de 30 à 60 min).
- Admin : comptes créés par un administrateur uniquement, rôles `admin` et `editeur`
  vérifiés côté serveur **et** en base (`is_staff()`, `is_admin()`).
- La clé de service n'est importée que dans des modules `server-only`.
- `/admin` est exclu des moteurs de recherche (robots.txt, `noindex`).

## Vote du public

Désactivé pour 2026 mais complet : interrupteur **Vote du public** dans les réglages.
Parcours : choix → e-mail → code à 6 chiffres envoyé par Resend (valable 10 min,
3 demandes max par tranche de 10 min) → vote enregistré, un par e-mail et par
catégorie. Le vote nécessite donc que Resend soit configuré avec un domaine vérifié.

## Limites connues et tâches restantes

- [ ] **Contenus réels** à saisir : distingués et photos, sponsors, coordonnées,
      slogan 2026 (voir ci-dessous).
- [ ] **PDF officiels** (règlement, dossier de candidature, dossier de sponsoring,
      programme) : à déposer dans `public/documents/`.
- [ ] **Programme** des 19 et 20 novembre (`src/data/program.json`) et **éditions
      précédentes** (`src/data/editions.json`) : contenus de démonstration à remplacer.
- [ ] **Photos** de l'accueil et des éditions précédentes : encore des images Unsplash.
- [ ] **Nom de domaine** : bloque les e-mails de confirmation (Resend).
- [ ] **Mentions légales** et **politique de confidentialité** : pages à rédiger
      (les liens du pied de page pointent vers Contact).
- Les images remplacées dans l'admin restent dans le stockage (pas de suppression
  automatique).
- Hors périmètre pour l'instant : paiement en ligne, CMS d'articles avancé, envoi de
  fichiers lourds dans les candidatures, statistiques dans l'admin.

## Contenus à fournir par le festival

| Contenu        | Éléments attendus                                                    |
| -------------- | -------------------------------------------------------------------- |
| Distingués     | nom, catégorie, métier, photo (≥ 800 × 1000 px, JPG/PNG/WebP), citation courte |
| Sponsors       | nom, palier, logo (PNG transparent de préférence), lien              |
| Actualités     | titre, date, texte, image                                            |
| Identité       | logo haute qualité, slogan 2026, PDF officiels                       |
| Coordonnées    | téléphone, e-mail, WhatsApp, réseaux sociaux, dates des candidatures, programme |

## Licence

© FIF AWARDS — Comité d'Organisation, 2026. Tous droits réservés.
