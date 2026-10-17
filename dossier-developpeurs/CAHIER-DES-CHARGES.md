# FIF AWARDS 2026 — Cahier des charges du site

**Destinataires** : l'équipe de développement
**Commanditaire** : Comité d'Organisation du FIF AWARDS, Conakry (Guinée)
**Version** : octobre 2026

> L'hébergement, l'infrastructure et le déploiement sont laissés au choix de l'équipe
> de développement. Ce document décrit **ce que le site doit faire**, pas où il tourne.
> Le **nom de domaine est déjà acheté** par le festival.

---

## Sommaire

1. [Le festival et l'objectif du site](#1-le-festival-et-lobjectif-du-site)
2. [Point de départ : ce qui existe déjà](#2-point-de-départ--ce-qui-existe-déjà)
3. [Décisions arrêtées](#3-décisions-arrêtées)
4. [Site public : pages et ajustements](#4-site-public--pages-et-ajustements)
5. [Back-office : tout modifier sans toucher au code](#5-back-office--tout-modifier-sans-toucher-au-code)
6. [Modèle de données](#6-modèle-de-données)
7. [E-mails](#7-e-mails)
8. [Sécurité et données personnelles](#8-sécurité-et-données-personnelles)
9. [Identité visuelle](#9-identité-visuelle)
10. [Contenus fournis et à fournir](#10-contenus-fournis-et-à-fournir)
11. [Critères de recette](#11-critères-de-recette)
12. [Livrables attendus](#12-livrables-attendus)
13. [Points ouverts](#13-points-ouverts)

---

## 1. Le festival et l'objectif du site

**FIF AWARDS — Festival International du Film Awards**, 4ᵉ édition :
**19 et 20 novembre 2026**, **Centre Culturel Franco-Guinéen (CCFG), Conakry**.

Le festival distingue toute la chaîne de valeur du cinéma guinéen et africain. Le site
doit permettre de :

- présenter le festival et **les distingués 2026** ;
- recevoir les **candidatures**, les **messages** et les **demandes de réservation** ;
- présenter les **partenaires** et les **actualités** ;
- laisser l'équipe du festival **tout modifier elle-même** (textes, photos, réglages)
  depuis un back-office, sans développeur.

---

## 2. Point de départ : ce qui existe déjà

Un site fonctionnel existe dans ce dépôt (branche `claude/nifty-babbage-v4coe2`).
**Il sert de base** : l'équipe peut le reprendre et l'améliorer, ou s'en inspirer.

| Élément | État |
|---|---|
| Stack | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Base de données, connexion admin, stockage des images | Supabase (PostgreSQL + Auth + Storage) |
| Schéma de la base | `supabase/migrations/` (tables, règles RLS, bucket d'images) et `supabase/seed.sql` |
| E-mails | Resend (appel HTTP direct) |
| Site public | 12 pages en place, responsive, design noir et or |
| Back-office `/admin` | connexion, rôles, distingués, catégories, sponsors, actualités, candidatures, messages, réservations, réglages, comptes |
| Tests | parcours admin complet testé de bout en bout dans un navigateur (25 vérifications) |
| Documentation | `README.md`, `.env.example`, `docs/SUPABASE.md`, `docs/GUIDE-ADMIN.md` |

**Ce qui reste figé dans le code aujourd'hui** (à rendre modifiable, voir §5) :
image d'accueil, programme, éditions précédentes et leurs photos, formules de
billets, documents PDF, textes de la page « À propos ».

---

## 3. Décisions arrêtées

1. **Concept et design conservés** : thème sombre noir et or, cinématographique.
2. **Vocabulaire** : on parle des **« Distingués 2026 »**, jamais de « nominés ».
   Les distingués sont **choisis par le Comité**, il n'y a pas de compétition publique.
3. **Annonce** : les noms sont publiés sur le site avant la cérémonie, lors d'une
   annonce publique. Avant cela, la page affiche « Annonce prochainement ».
4. **Quatre distinctions d'honneur** (elles remplacent les anciennes catégories) :

   | N° | Distinction |
   |---|---|
   | 1 | Métiers et Talents Techniques du Cinéma |
   | 2 | Pionniers du Cinéma Guinéen et Africain |
   | 3 | Bravoure & Leadership Féminin dans le Cinéma Africain |
   | 4 | Institutions, Mécènes & Médias au Service du Cinéma |

   La distinction 1 regroupe plusieurs métiers (réalisateurs, scénaristes, producteurs,
   directeurs de la photographie, cadreurs, monteurs, ingénieurs du son, costumiers,
   maquilleurs, décorateurs). Chaque distingué a donc **une catégorie** et un champ
   libre **« métier »**.

5. **Vote du public** : **désactivé pour 2026**, mais le code est conservé et
   réactivable par un interrupteur dans le back-office.
6. **Billetterie** : **pas de paiement en ligne**. Simple demande de réservation,
   confirmée manuellement par l'équipe. Ce doit être écrit clairement sur la page.
7. **Candidatures** : pas d'envoi de fichiers lourds. Des **liens** YouTube, Vimeo ou
   Google Drive suffisent.

---

## 4. Site public : pages et ajustements

Toutes les pages doivent fonctionner **sur mobile en priorité** (une grande partie du
public consultera sur téléphone, parfois avec une connexion lente).

| Page | Adresse | Contenu | Ajustements demandés |
|---|---|---|---|
| Accueil | `/` | image d'ouverture, compte à rebours, distingués ou distinctions, partenaires, programme, éditions précédentes | **image d'ouverture modifiable** depuis le back-office (aujourd'hui photo d'exemple) |
| À propos | `/a-propos` | histoire, vision, valeurs | textes modifiables depuis le back-office |
| Les distingués 2026 | `/distingues` | grille filtrable par distinction ; « Annonce prochainement » tant que l'interrupteur est éteint | — |
| Fiche distingué | `/distingues/[slug]` | photo, distinction, métier, citation, parcours | — |
| Candidatures | `/candidatures` | formulaire en 3 étapes ; fermé hors période | lien vers le règlement et le dossier de candidature (PDF) |
| Programme | `/programme` | deux journées, 19 et 20 novembre | **programme modifiable** depuis le back-office (aujourd'hui exemple) ; PDF téléchargeable |
| Sponsors | `/sponsors` | partenaires par palier (Platine, Or, Argent, Bronze) ; « Devenir partenaire » | dossier de sponsoring (PDF) |
| Billetterie | `/billetterie` | formules et demande de réservation | **formules et prix modifiables** depuis le back-office |
| Éditions précédentes | `/editions-precedentes` | éditions 2023 à 2025, chiffres, lauréats, photos | **entièrement modifiable** depuis le back-office (aujourd'hui exemple) |
| Presse | `/presse` | logos téléchargeables, dossiers, contact presse | kit média modifiable |
| Actualités | `/blog` et `/blog/[slug]` | articles du festival | — |
| Contact | `/contact` | coordonnées, carte, formulaire | — |
| Vote | `/voter` | **masquée** tant que le vote est désactivé | — |
| Mentions légales | `/mentions-legales` | **à créer** | texte fourni par le festival |
| Confidentialité | `/confidentialite` | **à créer** : données collectées, durée de conservation, contact | texte fourni par le festival |

**Ajustements techniques du front-end**

- Charger les polices (Playfair Display, Inter) avec `next/font` au lieu d'un lien Google Fonts.
- Optimisation des images en production (module `sharp`).
- Remplacer toutes les images d'exemple (Unsplash) par des images gérées dans le back-office.
- Vérifier le contraste et la navigation au clavier (accessibilité de base).
- Balises de partage (Open Graph) à jour sur chaque page ; l'image de partage par défaut existe déjà.
- L'ancienne adresse `/nomines` redirige vers `/distingues` : à conserver.

---

## 5. Back-office : tout modifier sans toucher au code

Adresse : **`/admin`**, réservée aux comptes de l'équipe, **sans inscription publique**,
exclue des moteurs de recherche.

### Rôles

| Rôle | Droits |
|---|---|
| **Administrateur** | tout, y compris les réglages, les interrupteurs et la gestion des comptes |
| **Éditeur** | contenus et données reçues, sans accès aux réglages ni aux comptes |

### Modules

✅ = existe déjà dans le dépôt · 🆕 = à développer

| Module | Fonctions | État |
|---|---|---|
| Tableau de bord | chiffres clés : distingués, candidatures et messages non traités, réservations en attente ; état des interrupteurs | ✅ |
| Distingués | ajouter, modifier, supprimer ; catégorie et métier ; **photo** ; ordre ; brouillon ou publié | ✅ |
| Catégories | modifier le nom, la description et l'ordre des distinctions | ✅ |
| Sponsors | ajouter, modifier ; palier ; **logo** ; lien ; brouillon ou publié | ✅ |
| Actualités | ajouter, modifier, publier ; **image** | ✅ |
| Candidatures | lire, changer le statut (nouvelle, en cours, retenue, refusée), **export CSV** | ✅ |
| Messages | lire, marquer comme lu, export CSV | ✅ |
| Réservations | voir, confirmer, annuler, export CSV | ✅ |
| Réglages | interrupteurs (vote, candidatures, distingués visibles), dates des candidatures, slogan, coordonnées, réseaux sociaux | ✅ |
| Comptes | créer un compte, changer le rôle, réinitialiser le mot de passe, supprimer | ✅ |
| **Accueil et images du site** | image d'ouverture (ordinateur et mobile), textes d'accroche | 🆕 |
| **Programme** | ajouter, modifier, réordonner les moments des deux journées | 🆕 |
| **Éditions précédentes** | édition par année : thème, chiffres, lauréats, image de couverture, **galerie de photos** | 🆕 |
| **Billetterie** | formules : nom, prix, avantages, disponible ou non | 🆕 |
| **Documents** | envoyer les PDF officiels (règlement, dossier de candidature, dossier de sponsoring, programme, kit média) ; un document absent affiche « bientôt disponible » | 🆕 |
| **Pages de texte** | À propos, mentions légales, confidentialité | 🆕 |

### Règles communes

- **Brouillon puis publié** : rien n'apparaît sur le site avant d'être publié.
- **Distingués visibles** : même publiés, les distingués restent cachés tant que
  l'interrupteur n'est pas allumé (jour de l'annonce).
- **Images** : JPG, PNG ou WebP, 5 Mo maximum, **redimensionnement automatique** pour
  le mobile. Pour les galeries, envoi de plusieurs photos à la fois.
- **Suppressions** : confirmation obligatoire.
- **Mise à jour immédiate** du site public après chaque enregistrement.
- Interface **en français**, utilisable sur téléphone.

---

## 6. Modèle de données

### Tables existantes (`supabase/migrations/`)

| Table | Champs principaux |
|---|---|
| `categories` | slug, nom, description, ordre |
| `distingues` | slug, nom complet, catégorie, métier, citation, parcours, photo, statut, ordre |
| `sponsors` | nom, palier, description, logo, lien, statut, ordre |
| `actualites` | slug, titre, date, texte, image, statut |
| `candidatures` | nom, e-mail, téléphone, catégorie visée, œuvre ou parcours, lien, message, statut, date |
| `messages` | nom, e-mail, sujet, texte, lu, date |
| `reservations` | nom, téléphone, e-mail, nombre de places, formule, statut, date |
| `parametres` | interrupteurs, dates des candidatures, slogan, coordonnées, réseaux sociaux (une seule ligne) |
| `administrateurs` | utilisateur, e-mail, rôle |
| `votes`, `codes_otp` | conservées pour le vote, désactivé en 2026 |

### Tables à ajouter

| Table | Champs proposés |
|---|---|
| `programme` | jour (1 ou 2), heure de début, heure de fin, titre, description, intervenants, type, ordre |
| `editions` | année, thème, nombre de participants, de films, de prix, de sponsors, image de couverture, lauréats, statut |
| `editions_photos` | édition, image, légende, ordre |
| `billets` | nom, prix, devise, description, avantages (liste), disponible, ordre |
| `documents` | clé (règlement, dossier de candidature…), titre, fichier, date de mise à jour |
| `pages` | clé (à propos, mentions légales, confidentialité), titre, contenu |
| `parametres` | ajouter : image d'ouverture (ordinateur et mobile), textes d'accroche |

Stockage : un espace pour les **images** (existe : bucket `medias`) et un pour les
**PDF** (à créer, 10 Mo maximum, PDF seulement).

---

## 7. E-mails

Service prévu : **Resend**, avec le nom de domaine du festival vérifié.

| Envoi | Destinataire | Quand |
|---|---|---|
| Notification de candidature | équipe | à chaque candidature |
| Notification de message | équipe | à chaque message de contact |
| Notification de réservation | équipe | à chaque demande |
| Accusé de réception | candidat ou personne qui réserve | après l'envoi du formulaire |
| Code de vote | votant | si le vote est réactivé |

Un échec d'envoi ne doit **jamais** faire échouer le formulaire : la donnée reste
enregistrée et visible dans le back-office.

---

## 8. Sécurité et données personnelles

- Sécurité au niveau des lignes (**RLS**) sur toutes les tables : le public ne lit que
  ce qui est publié.
- Les clés secrètes ne sont **jamais** exposées dans le navigateur.
- Formulaires protégés : validation côté serveur, **champ anti-robot**, **limitation du
  nombre d'envois** par connexion.
- Données des candidats et des personnes qui réservent : **visibles seulement par
  l'équipe**, jamais publiées.
- **Accord des personnes distinguées** pour l'usage de leur photo, avant publication.
- Comptes **nominatifs**, mots de passe forts (12 caractères minimum), jamais partagés.
- Aucun secret (clé, mot de passe) dans le dépôt de code.

---

## 9. Identité visuelle

| Élément | Valeur |
|---|---|
| Logo | dossier `identite/` : original, version fond clair, version fond sombre |
| Noir profond | `#0A0A0A` |
| Noir charbon | `#1A1A1A` |
| Or | `#D4AF37` |
| Or clair | `#F5D76E` |
| Bordeaux | `#8B0000` |
| Texte principal / secondaire | `#FFFFFF` / `#B0B0B0` |
| Titres | Playfair Display |
| Texte courant | Inter |

Le nom officiel est **« Festival International du Film Awards »** (comme sur le logo).

---

## 10. Contenus fournis et à fournir

### Déjà dans ce dossier

| Dossier | Contenu |
|---|---|
| `identite/` | logo officiel en trois versions |
| `photos-distingues/` | **5 photos de distingués**, noms à compléter |
| `photos-distingues/distingues.csv` | tableau à remplir : nom, catégorie, métier, citation, parcours, accord photo, crédit |

**Contrôle des photos reçues** (exigence : portrait vertical, au moins 800 × 1000 px) :

| Fichier | Taille | Remarque |
|---|---|---|
| `distingue-01` | 310 × 412 px | **trop petite**, floue en grand format : demander une meilleure version |
| `distingue-02` | 1500 × 2000 px | ✅ conforme |
| `distingue-03` | 482 × 533 px | **trop petite** |
| `distingue-04` | 334 × 596 px | **trop petite** ; capture de vidéo avec un logo en incrustation et un micro dans le cadre : à remplacer si possible |
| `distingue-05` | 1280 × 960 px | format **paysage** : sera recadrée en portrait |

D'autres photos et les noms correspondants vont suivre.

### À fournir par le festival

| Contenu | Détail |
|---|---|
| Distingués | nom, catégorie, métier, photo (≥ 800 × 1000 px), citation courte, parcours, accord pour la photo |
| Sponsors | nom, palier, logo (PNG transparent de préférence), lien |
| Programme | déroulé des 19 et 20 novembre |
| Éditions précédentes | chiffres, lauréats, photos de 2023, 2024 et 2025 |
| Billetterie | formules et prix définitifs |
| Documents | règlement, dossier de candidature, dossier de sponsoring, kit média (PDF) |
| Coordonnées | téléphone, e-mail, WhatsApp, réseaux sociaux, dates des candidatures |
| Textes | slogan 2026, À propos, mentions légales, confidentialité |
| Nom de domaine | **acheté** ; adresse à communiquer à l'équipe |

Nommer les fichiers clairement, par exemple `metiers-techniques_prenom-nom.jpg`.

---

## 11. Critères de recette

Le site est accepté quand :

- [ ] un visiteur non connecté ne peut pas entrer dans `/admin` ;
- [ ] un distingué ajouté avec sa photo depuis le back-office apparaît sur le site une
      fois publié et l'interrupteur allumé ;
- [ ] un distingué en brouillon n'apparaît jamais sur le site ;
- [ ] une candidature, un message et une réservation envoyés depuis le site
      apparaissent dans le back-office, et l'équipe reçoit une notification ;
- [ ] l'image d'ouverture, le programme, les éditions précédentes, les formules de
      billets et les PDF se changent depuis le back-office ;
- [ ] un éditeur n'a pas accès aux réglages ni aux comptes ;
- [ ] avec le vote éteint, `/voter` est introuvable ; allumé, il s'affiche ;
- [ ] le site s'affiche correctement sur téléphone, sans défilement horizontal ;
- [ ] le README et le `.env.example` permettent à un nouveau développeur de lancer le site.

---

## 12. Livrables attendus

- Code source sur GitHub, dans une organisation du festival (ou transférable à celle-ci).
- Migrations de base de données et données de départ.
- `README` (installation, lancement, mise en ligne) et `.env.example` à jour.
- Guide du back-office pour l'équipe (base existante : `docs/GUIDE-ADMIN.md`).
- Liste des limites connues et des tâches restantes.
- Tous les comptes techniques créés avec une **adresse e-mail du festival**.

---

## 13. Points ouverts

| Sujet | Situation |
|---|---|
| Métiers de la distinction 1 | champ libre « métier » ; le comité dira s'il veut des sous-catégories |
| Retour du vote | à décider plus tard ; le code est prêt |
| Paiement en ligne | hors périmètre pour 2026 |
| Envoi de fichiers dans les candidatures | hors périmètre : liens seulement |
| Statistiques dans le back-office | après le festival |
