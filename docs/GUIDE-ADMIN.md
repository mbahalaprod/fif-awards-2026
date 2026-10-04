# Guide rapide de l'administrateur

Adresse : **`/admin`** (par exemple `https://fifawards.gn/admin`). Chaque personne a
son propre compte : ne partagez jamais un mot de passe.

## Rôles

| Rôle               | Peut faire                                                            |
| ------------------ | --------------------------------------------------------------------- |
| **Administrateur** | tout, y compris les **Réglages** et la gestion des **Comptes**        |
| **Éditeur**        | distingués, catégories, sponsors, actualités, candidatures, messages, réservations |

## Ajouter un distingué

1. Menu **Distingués → Ajouter**.
2. Renseignez le nom, la catégorie, le métier (par exemple « Monteur ») et la citation.
3. Choisissez la photo : JPG, PNG ou WebP, portrait vertical d'au moins 800 × 1000 px.
   Elle est réduite automatiquement pour le mobile. **Vérifiez l'accord de la
   personne avant de publier sa photo.**
4. Laissez le statut sur **Brouillon** et cliquez sur **Enregistrer**.

Nommez vos fichiers clairement avant l'envoi, par exemple
`metiers-techniques_prenom-nom.jpg`, pour éviter les erreurs d'association.

## Publier les distingués (jour de l'annonce)

1. Dans **Distingués**, cliquez sur **Publier** pour chaque fiche prête.
2. Un administrateur ouvre **Réglages** et allume **Distingués visibles sur le site**.

Tant que cet interrupteur est éteint, **aucune** fiche n'est visible du public,
même publiée. Le site se met à jour immédiatement.

## Modifier une photo

Ouvrez la fiche → **Remplacer l'image** → **Enregistrer**.

## Candidatures, messages, réservations

- **Candidatures** : changez le statut (Nouvelle, En cours, Retenue, Refusée) avec la
  liste déroulante. **Exporter en CSV** produit un fichier qui s'ouvre dans Excel.
- **Messages** : **Marquer comme lu** une fois traité.
- **Réservations** : après avoir joint la personne et reçu le paiement, cliquez sur
  **Confirmer** (ou **Annuler**).

Ces données sont personnelles : ne les transférez pas en dehors de l'équipe.

## Réglages (administrateurs)

- **Distingués visibles sur le site** : à allumer le jour de l'annonce.
- **Candidatures ouvertes** et **dates d'ouverture et de clôture** : le formulaire
  n'est affiché que pendant la période et si l'interrupteur est allumé.
- **Vote du public** : éteint pour 2026.
- **Slogan, téléphone, WhatsApp, e-mail, adresse, réseaux sociaux** : affichés en
  pied de page et sur la page Contact. Un champ vide masque l'élément.

## Comptes (administrateurs)

**Comptes → Créer un compte** : e-mail du festival, mot de passe provisoire de
12 caractères minimum, rôle. Transmettez le mot de passe en main propre ; la personne
le change ensuite dans **Mon compte**.

## Documents PDF

Le règlement, le dossier de candidature, le dossier de sponsoring et le programme
s'affichent « bientôt disponible » tant qu'ils ne sont pas fournis. Pour les publier,
envoyez les PDF à la personne en charge du site : elle les ajoute dans
`public/documents/` et renseigne leur chemin dans `src/lib/documents.ts`.
