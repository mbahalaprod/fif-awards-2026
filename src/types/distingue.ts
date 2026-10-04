export type PublicationStatus = 'brouillon' | 'publie';

export interface Distingue {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  /** Champ libre, par exemple « Monteur » ou « Réalisatrice ». */
  metier: string | null;
  citation: string | null;
  biography: string | null;
  photoUrl: string | null;
  status: PublicationStatus;
  order: number;
}
