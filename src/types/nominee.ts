export interface Nominee {
  id: string;
  slug: string;
  name: string;
  role: string;
  categoryId: string;
  workTitle: string;
  workYear: number;
  biography: string;
  photoUrl: string;
  trailerUrl: string | null;
  country: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}
