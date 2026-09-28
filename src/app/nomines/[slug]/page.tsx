import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Vote } from 'lucide-react';
import { getNominees, getNomineeBySlug, getCategoryById } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getNominees().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const nominee = getNomineeBySlug(params.slug);
  if (!nominee) return { title: 'Nominé introuvable' };
  return {
    title: `${nominee.name} — ${nominee.role}`,
    description: nominee.biography.slice(0, 160),
    openGraph: {
      images: [nominee.photoUrl],
    },
  };
}

export default function NomineeDetailPage({ params }: PageProps) {
  const nominee = getNomineeBySlug(params.slug);
  if (!nominee) notFound();

  const category = getCategoryById(nominee.categoryId);

  return (
    <article className="section">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/nomines"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux nominés
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Photo */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border">
            <Image
              src={nominee.photoUrl}
              alt={nominee.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div>
            {category && (
              <Badge variant="outline" className="mb-4">
                {category.name}
              </Badge>
            )}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight mb-3">
              {nominee.name}
            </h1>
            <p className="text-gold text-lg mb-8">{nominee.role}</p>

            <dl className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-border">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Œuvre</dt>
                <dd className="font-serif text-text-primary mt-1">{nominee.workTitle}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Année</dt>
                <dd className="font-serif text-text-primary mt-1">{nominee.workYear}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Pays</dt>
                <dd className="font-serif text-text-primary mt-1">{nominee.country}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Catégorie</dt>
                <dd className="font-serif text-text-primary mt-1">{category?.name}</dd>
              </div>
            </dl>

            <h2 className="font-serif text-2xl text-text-primary mb-3">Biographie</h2>
            <p className="text-text-secondary leading-relaxed mb-10">{nominee.biography}</p>

            <Link
              href={`/voter?categorie=${category?.slug ?? ''}&nomine=${nominee.id}`}
              className="btn-gold w-full sm:w-auto"
            >
              <Vote className="h-4 w-4" /> Voter pour {nominee.name.split(' ')[0]}
            </Link>
          </div>
        </div>

        {/* Trailer */}
        {nominee.trailerUrl && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-6">Bande-annonce</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-background-secondary">
              <iframe
                src={nominee.trailerUrl}
                title={`Bande-annonce — ${nominee.workTitle}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
