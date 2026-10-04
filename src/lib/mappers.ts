import type { Category } from '@/types/category';
import type { Distingue, PublicationStatus } from '@/types/distingue';
import type { Sponsor, SponsorTier } from '@/types/sponsor';
import type { Article } from '@/types/article';
import type { SiteSettings } from '@/types/settings';

// Lignes telles que renvoyées par Supabase (colonnes en français).

export interface CategoryRow {
  id: string;
  slug: string;
  nom: string;
  description: string;
  ordre: number;
}

export interface DistingueRow {
  id: string;
  slug: string;
  nom_complet: string;
  categorie_id: string;
  metier: string | null;
  citation: string | null;
  biographie: string | null;
  photo_url: string | null;
  statut: PublicationStatus;
  ordre: number;
}

export interface SponsorRow {
  id: string;
  nom: string;
  palier: SponsorTier;
  description: string | null;
  logo_url: string | null;
  site_url: string | null;
  ordre: number;
  statut: PublicationStatus;
}

export interface ActualiteRow {
  id: string;
  slug: string;
  titre: string;
  date_publication: string;
  texte: string;
  image_url: string | null;
  statut: PublicationStatus;
}

export interface ParametresRow {
  vote_actif: boolean;
  candidatures_ouvertes: boolean;
  distingues_visibles: boolean;
  candidatures_ouverture: string | null;
  candidatures_cloture: string | null;
  slogan: string;
  telephone: string | null;
  email: string | null;
  whatsapp: string | null;
  adresse: string;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
}

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.nom,
    description: row.description,
    order: row.ordre,
  };
}

export function toDistingue(row: DistingueRow): Distingue {
  return {
    id: row.id,
    slug: row.slug,
    name: row.nom_complet,
    categoryId: row.categorie_id,
    metier: row.metier,
    citation: row.citation,
    biography: row.biographie,
    photoUrl: row.photo_url,
    status: row.statut,
    order: row.ordre,
  };
}

export function toSponsor(row: SponsorRow): Sponsor {
  return {
    id: row.id,
    name: row.nom,
    tier: row.palier,
    description: row.description,
    logoUrl: row.logo_url,
    websiteUrl: row.site_url,
  };
}

export function toArticle(row: {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  content: string;
  imageUrl: string | null;
}): Article {
  const words = row.content.trim().split(/\s+/).filter(Boolean).length;
  const firstParagraph = row.content.split('\n\n')[0] ?? '';
  const excerpt =
    firstParagraph.length > 180 ? `${firstParagraph.slice(0, 177).trimEnd()}…` : firstParagraph;
  return { ...row, excerpt, readingTime: Math.max(1, Math.round(words / 200)) };
}

export function actualiteToArticle(row: ActualiteRow): Article {
  return toArticle({
    id: row.id,
    slug: row.slug,
    title: row.titre,
    publishedAt: row.date_publication,
    content: row.texte,
    imageUrl: row.image_url,
  });
}

export const DEFAULT_SETTINGS: SiteSettings = {
  voteActive: false,
  applicationsOpen: true,
  distinguesVisible: false,
  applicationsOpenDate: null,
  applicationsCloseDate: null,
  slogan: 'Célébrer toute la chaîne de valeur du cinéma guinéen',
  phone: null,
  email: null,
  whatsapp: null,
  address: 'Radisson Blu Hôtel, Conakry, Guinée',
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  linkedinUrl: null,
};

export function toSettings(row: ParametresRow): SiteSettings {
  return {
    voteActive: row.vote_actif,
    applicationsOpen: row.candidatures_ouvertes,
    distinguesVisible: row.distingues_visibles,
    applicationsOpenDate: row.candidatures_ouverture,
    applicationsCloseDate: row.candidatures_cloture,
    slogan: row.slogan,
    phone: row.telephone,
    email: row.email,
    whatsapp: row.whatsapp,
    address: row.adresse,
    facebookUrl: row.facebook_url,
    instagramUrl: row.instagram_url,
    youtubeUrl: row.youtube_url,
    tiktokUrl: row.tiktok_url,
    linkedinUrl: row.linkedin_url,
  };
}
