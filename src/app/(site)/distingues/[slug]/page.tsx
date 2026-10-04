import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Quote, Vote } from 'lucide-react';
import { getCategoryById, getDistingueBySlug, getDistingues, getSettings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { DistinguePhoto } from '@/components/distingues/DistinguePhoto';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return (await getDistingues()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const distingue = await getDistingueBySlug(params.slug);
  if (!distingue) return { title: 'Distingué introuvable' };
  const category = await getCategoryById(distingue.categoryId);
  return {
    title: distingue.metier ? `${distingue.name} — ${distingue.metier}` : distingue.name,
    description: (distingue.citation ?? distingue.biography ?? category?.name ?? '').slice(0, 160),
    openGraph: distingue.photoUrl ? { images: [distingue.photoUrl] } : undefined,
  };
}

export default async function DistingueDetailPage({ params }: PageProps) {
  const distingue = await getDistingueBySlug(params.slug);
  if (!distingue) notFound();

  const [category, settings] = await Promise.all([
    getCategoryById(distingue.categoryId),
    getSettings(),
  ]);

  return (
    <article className="section">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/distingues"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux distingués
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border">
            <DistinguePhoto
              name={distingue.name}
              photoUrl={distingue.photoUrl}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div>
            {category && (
              <Badge variant="outline" className="mb-4">
                {category.name}
              </Badge>
            )}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight mb-3">
              {distingue.name}
            </h1>
            {distingue.metier && <p className="text-gold text-lg mb-8">{distingue.metier}</p>}

            {distingue.citation && (
              <blockquote className="relative border-l-2 border-gold pl-6 py-2 mb-8">
                <Quote className="absolute -left-3 -top-2 h-5 w-5 text-gold bg-background-primary" />
                <p className="font-serif italic text-xl text-text-primary leading-relaxed">
                  {distingue.citation}
                </p>
              </blockquote>
            )}

            {distingue.biography && (
              <>
                <h2 className="font-serif text-2xl text-text-primary mb-3">Parcours</h2>
                <div className="text-text-secondary leading-relaxed mb-10 space-y-4">
                  {distingue.biography.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}

            {settings.voteActive && category && (
              <Link
                href={`/voter?categorie=${category.slug}&distingue=${distingue.id}`}
                className="btn-gold w-full sm:w-auto"
              >
                <Vote className="h-4 w-4" /> Voter pour {distingue.name.split(' ')[0]}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
