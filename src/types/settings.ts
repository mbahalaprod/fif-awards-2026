export interface SiteSettings {
  voteActive: boolean;
  applicationsOpen: boolean;
  distinguesVisible: boolean;
  /** AAAA-MM-JJ ou null. */
  applicationsOpenDate: string | null;
  applicationsCloseDate: string | null;
  slogan: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  linkedinUrl: string | null;
}
