/**
 * Documents officiels téléchargeables.
 * Pour publier un document : déposer le fichier dans public/documents/ puis
 * renseigner son chemin ici (par exemple '/documents/reglement-2026.pdf').
 * Tant qu'un chemin vaut null, le site affiche « Bientôt disponible » à la place du lien.
 */
export const DOCUMENTS: Record<
  'reglement' | 'dossierCandidature' | 'dossierSponsoring' | 'programme',
  string | null
> = {
  reglement: null,
  dossierCandidature: null,
  dossierSponsoring: null,
  programme: null,
};
