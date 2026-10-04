# FIF AWARDS 2026 — Site officiel

> Site web officiel du **Festival International du Film AWARDS** — 4ᵉ édition.
> Les **19 et 20 novembre 2026** à l'hôtel **Radisson Blu de Conakry**, en Guinée.

---

## 🎬 À propos

Le FIF AWARDS récompense **toute la chaîne de valeur du cinéma guinéen** : acteurs et actrices, réalisateurs, monteurs, directeurs de la photographie, ingénieurs du son, scénaristes et tous les métiers techniques du septième art.

Ce site sert de plateforme officielle pour :

- Voter en ligne pour les nominés (1 vote par email par catégorie, validation OTP)
- Recevoir les candidatures (formulaire 5 étapes avec validation Zod)
- Vendre les billets de la cérémonie (3 paliers : Standard, VIP, Premium)
- Présenter les sponsors (4 paliers : Platine, Or, Argent, Bronze)
- Diffuser les actualités du festival

---

## 🛠️ Stack technique

- **Next.js 14** (App Router)
- **TypeScript** strict
- **Tailwind CSS** avec design system custom (palette or/noir)
- **shadcn/ui** pour les composants UI
- **Framer Motion** pour les animations
- **React Hook Form + Zod** pour les formulaires
- **Sonner** pour les toasts
- **Lucide React** pour les icônes
- Polices Google : **Playfair Display** (serif, titres) + **Inter** (sans-serif, corps)
- Stockage V1 : fichiers JSON dans `src/data/`

---

## 🚀 Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le fichier d'environnement

```bash
cp .env.local.example .env.local
```

Le fichier contient :

```
NEXT_PUBLIC_SHOW_VOTE_RESULTS=true   # afficher les compteurs de vote en temps réel
OTP_DEMO_CODE=123456                  # code OTP statique pour la V1
NEXT_PUBLIC_SITE_URL=https://fifawards.gn
```

### 3. Lancer le serveur de dev

```bash
npm run dev
```

Le site est accessible sur **http://localhost:3000**

### 4. Build de production

```bash
npm run build
npm run start
```

---

## 📂 Structure

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx          # Layout racine : fonts, header, footer, toaster
│   ├── page.tsx            # Accueil
│   ├── globals.css         # Variables CSS + Tailwind
│   ├── sitemap.ts          # Sitemap auto-généré
│   ├── robots.ts           # Robots.txt auto-généré
│   ├── a-propos/           # Page À propos
│   ├── nomines/            # Liste nominés + détail [slug]
│   ├── voter/              # Système de vote (3 étapes : choix → email → OTP)
│   ├── candidatures/       # Formulaire 5 étapes
│   ├── programme/          # Programme 2 jours avec tabs
│   ├── sponsors/           # 4 paliers de partenariat
│   ├── billetterie/        # 3 types de billets + formulaire
│   ├── editions-precedentes/
│   ├── presse/
│   ├── blog/               # Liste + [slug]
│   ├── contact/
│   └── api/
│       ├── vote/route.ts          # POST : enregistrer un vote (anti-fraude)
│       ├── candidature/route.ts   # POST : enregistrer une candidature
│       ├── billet/route.ts        # POST : réservation de billets
│       └── contact/route.ts       # POST : message de contact
├── components/
│   ├── layout/             # Header (responsive), Footer, nav-links
│   ├── home/               # Hero, Countdown, SponsorsCarousel, etc.
│   ├── nominees/           # NomineeCard, NomineesGrid (filtre client)
│   ├── vote/               # VoteForm (multi-étapes)
│   ├── candidature/        # CandidatureMultiStepForm
│   ├── billetterie/        # TicketForm
│   └── ui/                 # Primitives shadcn customisées dark theme
├── data/                   # JSON files (categories, nominees, sponsors...)
├── lib/                    # utils, countdown, validations Zod, data, votes
└── types/                  # Types TS (Nominee, Sponsor, Vote, etc.)
```

---

## 🎨 Design system

### Palette

```css
--background-primary: #0A0A0A   /* Noir profond */
--background-secondary: #1A1A1A /* Noir charbon */
--accent-gold: #D4AF37          /* Or, accents et CTA */
--accent-gold-light: #F5D76E    /* Or clair, hover */
--accent-red: #8B0000           /* Rouge bordeaux */
--text-primary: #FFFFFF
--text-secondary: #B0B0B0
--border-color: #2A2A2A
```

### Classes utilitaires

- `.btn-gold` — CTA principal (dégradé or)
- `.btn-outline-gold` — CTA secondaire (contour or)
- `.card-gold` — Carte sombre avec border or au hover
- `.section` — Padding vertical standard
- `.section-title` / `.section-subtitle` — Titres de section

---

## 🗳️ Système de vote

Le vote suit un parcours en 3 étapes :

1. **Sélection** — catégorie + nominé
2. **Email** — saisie pour validation
3. **OTP** — code à 6 chiffres (en V1 : `123456`)

### Règles côté API (`/api/vote`)

- Validation Zod stricte
- Vérification que le nominé appartient bien à la catégorie
- 1 vote max par email × catégorie
- Cooldown de 60s entre tentatives (sur email OU IP)
- Hash de l'email et de l'IP (DJB2 non-cryptographique pour la V1)
- Stockage dans `src/data/votes.json`

### Afficher/masquer les résultats partiels

```env
NEXT_PUBLIC_SHOW_VOTE_RESULTS=true   # ou false
```

---

## 📅 Prochaines étapes (V2)

Ce qui reste à brancher pour la V2 (post-démo) :

- [ ] Vrai envoi d'email OTP (Resend / SendGrid / SMTP)
- [ ] Base de données (Vercel Postgres, Supabase) pour les votes et candidatures
- [ ] Upload de fichiers réels pour les candidatures (S3 / Cloudinary)
- [ ] Paiement réel pour la billetterie (Orange Money API, Paystack)
- [ ] CMS pour les nominés et les articles (Sanity, Strapi)
- [ ] Vraies images Unsplash → photos officielles
- [ ] Documents PDF (programme, dossier partenariat, kit médias)
- [ ] Authentification admin pour modération vote

---

## 🚢 Déploiement

Recommandation : **Vercel** (zéro config, optimisé pour Next.js).

```bash
# 1. Push sur GitHub
git init && git add . && git commit -m "feat: initial commit"

# 2. Importer sur https://vercel.com/new
# 3. Variables d'environnement (.env.local) → à configurer dans le dashboard Vercel
# 4. Deploy automatique
```

---

## 📄 Licence

© FIF AWARDS — Comité d'Organisation, 2026. Tous droits réservés.
