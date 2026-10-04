import type { MetadataRoute } from 'next';
import { getArticles, getDistingues, getSettings } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fifawards.gn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [settings, distingues, articles] = await Promise.all([
    getSettings(),
    getDistingues(),
    getArticles(),
  ]);

  const staticRoutes = [
    '',
    '/a-propos',
    '/distingues',
    ...(settings.voteActive ? ['/voter'] : []),
    '/candidatures',
    '/programme',
    '/sponsors',
    '/billetterie',
    '/editions-precedentes',
    '/presse',
    '/blog',
    '/contact',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const distingueRoutes = distingues.map((d) => ({
    url: `${SITE_URL}/distingues/${d.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...distingueRoutes, ...articleRoutes];
}
