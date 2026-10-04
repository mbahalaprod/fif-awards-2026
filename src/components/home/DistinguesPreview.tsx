import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategories, getDistingues } from '@/lib/data';
import { DistingueCard } from '@/components/distingues/DistingueCard';
import { DistinctionsList } from '@/components/distingues/DistinctionsList';

export async function DistinguesPreview() {
  const [distingues, categories] = await Promise.all([getDistingues(), getCategories()]);
  const featured = distingues.slice(0, 6);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="section-subtitle">Édition 2026</p>
          <h2 className="section-title mb-4">
            {featured.length > 0 ? 'Les distingués 2026' : "Les distinctions d'honneur"}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {featured.length > 0
              ? "Celles et ceux que le Comité d'Organisation met à l'honneur cette année."
              : "Quatre distinctions pour célébrer toute la chaîne de valeur du cinéma. Les distingués seront annoncés avant la cérémonie."}
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((distingue) => (
              <DistingueCard
                key={distingue.id}
                distingue={distingue}
                categoryName={categoryName(distingue.categoryId)}
              />
            ))}
          </div>
        ) : (
          <DistinctionsList categories={categories} />
        )}

        <div className="text-center mt-12">
          <Link href="/distingues" className="btn-outline-gold">
            {featured.length > 0 ? 'Découvrir tous les distingués' : 'En savoir plus'}{' '}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
