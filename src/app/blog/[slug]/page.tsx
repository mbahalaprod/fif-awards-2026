import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getArticles, getArticleBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article introuvable' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: article.imageUrl ? { images: [article.imageUrl] } : undefined,
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <article className="section">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux actualités
        </Link>

        <h1 className="font-serif text-3xl md:text-5xl text-text-primary leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary mb-8 pb-8 border-b border-border">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min de lecture
          </span>
        </div>

        {article.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border mb-10">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed space-y-5">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-base md:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
