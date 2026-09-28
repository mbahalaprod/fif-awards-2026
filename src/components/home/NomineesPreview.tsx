import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getNominees, getCategoryById } from '@/lib/data';

export function NomineesPreview() {
  const featured = getNominees().slice(0, 6);

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="section-subtitle">Sélection 2026</p>
          <h2 className="section-title mb-4">Les nominés à l&apos;honneur</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Vingt talents répartis dans dix catégories. Découvrez celles et ceux qui font rayonner la
            création audiovisuelle guinéenne cette année.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((nominee) => {
            const category = getCategoryById(nominee.categoryId);
            return (
              <Link
                key={nominee.id}
                href={`/nomines/${nominee.slug}`}
                className="card-gold group overflow-hidden block"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={nominee.photoUrl}
                    alt={nominee.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold mb-2">
                      {category?.name}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl text-text-primary leading-tight">
                      {nominee.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{nominee.role}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/nomines" className="btn-outline-gold">
            Découvrir tous les nominés <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
