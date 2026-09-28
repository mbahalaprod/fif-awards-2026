import type { Metadata } from 'next';
import { NomineesGrid } from '@/components/nominees/NomineesGrid';
import { getNominees, getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Les nominés de la 4ᵉ édition',
  description:
    'Découvrez les 20 nominés du FIF AWARDS 2026, répartis sur 10 catégories. Filtrez par catégorie pour explorer toute la sélection.',
};

export default function NomineesPage() {
  const nominees = getNominees();
  const categories = getCategories();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Sélection officielle 2026</p>
          <h1 className="section-title mb-6">Les nominés</h1>
          <p className="text-text-secondary text-lg">
            Vingt talents, dix catégories. Réalisatrices, comédiens, monteurs, ingénieurs du son et
            scénaristes — toute la chaîne de valeur du cinéma guinéen est mise à l&apos;honneur.
          </p>
        </div>

        <NomineesGrid nominees={nominees} categories={categories} />
      </div>
    </section>
  );
}
