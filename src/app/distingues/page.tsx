import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { DistinguesGrid } from '@/components/distingues/DistinguesGrid';
import { DistinctionsList } from '@/components/distingues/DistinctionsList';
import { getCategories, getDistingues } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Les distingués 2026',
  description:
    "Les distingués de la 4ᵉ édition du FIF AWARDS, choisis par le Comité d'Organisation dans quatre distinctions d'honneur.",
};

export default async function DistinguesPage() {
  const [distingues, categories] = await Promise.all([getDistingues(), getCategories()]);

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">4ᵉ édition · 2026</p>
          <h1 className="section-title mb-6">Les distingués 2026</h1>
          <p className="text-text-secondary text-lg">
            Choisis par le Comité d&apos;Organisation, ils et elles sont mis à l&apos;honneur dans
            quatre distinctions qui couvrent toute la chaîne de valeur du cinéma.
          </p>
        </div>

        {distingues.length > 0 ? (
          <DistinguesGrid distingues={distingues} categories={categories} />
        ) : (
          <>
            <div className="card-gold p-8 md:p-10 text-center max-w-2xl mx-auto mb-16">
              <Sparkles className="h-10 w-10 text-gold mx-auto mb-4" />
              <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-3">
                Annonce prochainement
              </h2>
              <p className="text-text-secondary">
                Les noms des distingués 2026 seront dévoilés ici avant la cérémonie, lors d&apos;une
                annonce publique.
              </p>
            </div>
            <DistinctionsList categories={categories} />
          </>
        )}
      </div>
    </section>
  );
}
