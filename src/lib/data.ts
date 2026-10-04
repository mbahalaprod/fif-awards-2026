import 'server-only';
import { cache } from 'react';

import categoriesSeed from '@/data/categories.json';
import articlesSeed from '@/data/articles.json';
import programData from '@/data/program.json';
import editionsData from '@/data/editions.json';
import ticketsData from '@/data/tickets.json';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createPublicClient } from '@/lib/supabase/public';
import {
  DEFAULT_SETTINGS,
  actualiteToArticle,
  toArticle,
  toCategory,
  toDistingue,
  toSettings,
  toSponsor,
  type ActualiteRow,
  type CategoryRow,
  type DistingueRow,
  type ParametresRow,
  type SponsorRow,
} from '@/lib/mappers';

import type { Category } from '@/types/category';
import type { Distingue } from '@/types/distingue';
import type { Sponsor, SponsorTier } from '@/types/sponsor';
import type { ProgramItem, Edition } from '@/types/program';
import type { Article } from '@/types/article';
import type { TicketType } from '@/types/ticket';
import type { SiteSettings } from '@/types/settings';

// -----------------------------------------------------------------------------
// Contenus pilotés par Supabase.
// Sans configuration Supabase (développement local), on retombe sur les
// fichiers de src/data/ pour que le site reste consultable.
// En cas d'erreur réseau, on renvoie une valeur vide plutôt que de casser la page.
// -----------------------------------------------------------------------------

function logError(scope: string, error: unknown) {
  console.error(`[data] ${scope}:`, error);
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;
  const { data, error } = await createPublicClient()
    .from('parametres')
    .select('*')
    .eq('id', 1)
    .single<ParametresRow>();
  if (error || !data) {
    logError('parametres', error);
    return DEFAULT_SETTINGS;
  }
  return toSettings(data);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) return categoriesSeed as Category[];
  const { data, error } = await createPublicClient()
    .from('categories')
    .select('id, slug, nom, description, ordre')
    .order('ordre');
  if (error) {
    logError('categories', error);
    return [];
  }
  return (data as CategoryRow[]).map(toCategory);
});

export async function getCategoryById(id: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.id === id);
}

/** Distingués publiés. Vide tant que l'interrupteur « distingués visibles » est éteint. */
export const getDistingues = cache(async (): Promise<Distingue[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createPublicClient()
    .from('distingues')
    .select('id, slug, nom_complet, categorie_id, metier, citation, biographie, photo_url, statut, ordre')
    .order('ordre')
    .order('nom_complet');
  if (error) {
    logError('distingues', error);
    return [];
  }
  return (data as DistingueRow[]).map(toDistingue);
});

export async function getDistingueBySlug(slug: string): Promise<Distingue | undefined> {
  return (await getDistingues()).find((d) => d.slug === slug);
}

export const getSponsors = cache(async (): Promise<Sponsor[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await createPublicClient()
    .from('sponsors')
    .select('id, nom, palier, description, logo_url, site_url, ordre, statut')
    .order('ordre')
    .order('nom');
  if (error) {
    logError('sponsors', error);
    return [];
  }
  return (data as SponsorRow[]).map(toSponsor);
});

export async function getSponsorsByTier(tier: SponsorTier): Promise<Sponsor[]> {
  return (await getSponsors()).filter((s) => s.tier === tier);
}

export const getArticles = cache(async (): Promise<Article[]> => {
  if (!isSupabaseConfigured()) {
    return (articlesSeed as Parameters<typeof toArticle>[0][]).map(toArticle);
  }
  const { data, error } = await createPublicClient()
    .from('actualites')
    .select('id, slug, titre, date_publication, texte, image_url, statut')
    .order('date_publication', { ascending: false });
  if (error) {
    logError('actualites', error);
    return [];
  }
  return (data as ActualiteRow[]).map(actualiteToArticle);
});

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

// -----------------------------------------------------------------------------
// Contenus encore statiques (fichiers JSON).
// -----------------------------------------------------------------------------

export function getProgram(): ProgramItem[] {
  return programData as ProgramItem[];
}

export function getProgramByDay(day: 1 | 2): ProgramItem[] {
  return getProgram().filter((p) => p.day === day);
}

export function getEditions(): Edition[] {
  return editionsData as Edition[];
}

export function getTickets(): TicketType[] {
  return ticketsData as TicketType[];
}
