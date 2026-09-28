import type { MetadataRoute } from 'next';
import { getNominees, getArticles } from '@/lib/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fifawards.gn';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    '',
    '/a-propos',
    '/nomines',
    '/voter',
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

  const nomineeRoutes = getNominees().map((n) => ({
    url: `${SITE_URL}/nomines/${n.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const articleRoutes = getArticles().map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...nomineeRoutes, ...articleRoutes];
}
