import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VoteForm } from '@/components/vote/VoteForm';
import { getCategories, getNominees } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Voter pour vos favoris',
  description:
    'Votez en ligne pour vos nominés favoris dans chacune des 10 catégories du FIF AWARDS 2026. Un vote par catégorie, validation par email.',
};

const showResults = process.env.NEXT_PUBLIC_SHOW_VOTE_RESULTS === 'true';

export default function VoterPage() {
  const categories = getCategories();
  const nominees = getNominees();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Vote du public</p>
          <h1 className="section-title mb-6">Faites compter votre voix</h1>
          <p className="text-text-secondary text-lg">
            Choisissez une catégorie, sélectionnez votre nominé favori et validez votre vote par
            email. Un vote par email et par catégorie — pour que chaque voix compte.
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-text-secondary">Chargement…</p>}>
          <VoteForm categories={categories} nominees={nominees} showResults={showResults} />
        </Suspense>
      </div>
    </section>
  );
}
