import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';
import { CandidatureMultiStepForm } from '@/components/candidature/CandidatureMultiStepForm';
import { getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Déposer une candidature',
  description:
    'Cinéastes, comédien·ne·s, technicien·ne·s : déposez votre candidature au FIF AWARDS 2026 jusqu\'au 30 septembre 2026.',
};

export default function CandidaturesPage() {
  const categories = getCategories();

  return (
    <section className="section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="section-subtitle">Appel à candidatures 2026</p>
          <h1 className="section-title mb-6">Déposer une candidature</h1>
          <p className="text-text-secondary text-lg mb-6">
            Toutes les œuvres produites ou diffusées entre le 1ᵉʳ octobre 2025 et le 30 septembre
            2026 sont éligibles, dans dix catégories distinctes.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bordeaux/20 border border-bordeaux text-bordeaux text-sm">
            <Calendar className="h-4 w-4" />
            Date limite : 30 septembre 2026
          </div>
        </div>

        {/* Categories overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-16">
          {categories.map((c) => (
            <div
              key={c.id}
              className="card-gold p-3 text-center text-xs uppercase tracking-wider text-text-secondary"
            >
              {c.name}
            </div>
          ))}
        </div>

        <CandidatureMultiStepForm categories={categories} />
      </div>
    </section>
  );
}
