import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { getArticles } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Actualités du festival',
  description: 'Toutes les actualités, portraits et annonces du FIF AWARDS 2026.',
};

const categoryLabels: Record<string, string> = {
  annonces: 'Annonce',
  portraits: 'Portrait',
  programme: 'Programme',
  coulisses: 'Coulisses',
};

export default function BlogPage() {
  const articles = getArticles();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Le journal du festival</p>
          <h1 className="section-title mb-6">Actualités</h1>
          <p className="text-text-secondary text-lg">
            Annonces officielles, portraits de nominés, coulisses des préparatifs et programme : la
            vie du festival, racontée au fil des semaines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="card-gold group overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4">{categoryLabels[article.category]}</Badge>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="font-serif text-xl text-text-primary mb-3 leading-tight group-hover:text-gold transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-secondary border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readingTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
