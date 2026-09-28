import categoriesData from '@/data/categories.json';
import nomineesData from '@/data/nominees.json';
import sponsorsData from '@/data/sponsors.json';
import programData from '@/data/program.json';
import editionsData from '@/data/editions.json';
import articlesData from '@/data/articles.json';
import ticketsData from '@/data/tickets.json';

import type { Category } from '@/types/category';
import type { Nominee } from '@/types/nominee';
import type { Sponsor, SponsorTier } from '@/types/sponsor';
import type { ProgramItem, Edition } from '@/types/program';
import type { Article } from '@/types/article';
import type { TicketType } from '@/types/ticket';

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function getNominees(): Nominee[] {
  return nomineesData as Nominee[];
}

export function getNomineeBySlug(slug: string): Nominee | undefined {
  return getNominees().find((n) => n.slug === slug);
}

export function getNomineesByCategory(categoryId: string): Nominee[] {
  return getNominees().filter((n) => n.categoryId === categoryId);
}

export function getSponsors(): Sponsor[] {
  return sponsorsData as Sponsor[];
}

export function getSponsorsByTier(tier: SponsorTier): Sponsor[] {
  return getSponsors().filter((s) => s.tier === tier);
}

export function getProgram(): ProgramItem[] {
  return programData as ProgramItem[];
}

export function getProgramByDay(day: 1 | 2): ProgramItem[] {
  return getProgram().filter((p) => p.day === day);
}

export function getEditions(): Edition[] {
  return editionsData as Edition[];
}

export function getArticles(): Article[] {
  return [...(articlesData as Article[])].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function getTickets(): TicketType[] {
  return ticketsData as TicketType[];
}
