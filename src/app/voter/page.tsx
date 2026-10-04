import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VoteForm } from '@/components/vote/VoteForm';
import { notFound } from 'next/navigation';
import { getCategories, getDistingues, getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Voter pour vos favoris',
  description:
    'Votez en ligne pour vos favoris dans chacune des distinctions du FIF AWARDS 2026. Un vote par catégorie, validation par email.',
};

const showResults = process.env.NEXT_PUBLIC_SHOW_VOTE_RESULTS === 'true';

export default async function VoterPage() {
  // Vote désactivé pour l'édition 2026 : la page n'existe que si l'interrupteur est allumé.
  const settings = await getSettings();
  if (!settings.voteActive) notFound();
  const [categories, distingues] = await Promise.all([getCategories(), getDistingues()]);

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Vote du public</p>
          <h1 className="section-title mb-6">Faites compter votre voix</h1>
          <p className="text-text-secondary text-lg">
            Choisissez une catégorie, faites votre choix et validez votre vote par
            email. Un vote par email et par catégorie — pour que chaque voix compte.
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-text-secondary">Chargement…</p>}>
          <VoteForm categories={categories} distingues={distingues} showResults={showResults} />
        </Suspense>
      </div>
    </section>
  );
}
