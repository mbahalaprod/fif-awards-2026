import { Award } from 'lucide-react';
import type { Category } from '@/types/category';

/** Les distinctions d'honneur de l'édition, numérotées. */
export function DistinctionsList({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category, idx) => (
        <div key={category.id} className="card-gold p-6 md:p-8 flex gap-5">
          <div className="shrink-0 w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center">
            <Award className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">
              Distinction n° {idx + 1}
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-text-primary leading-tight mb-3">
              {category.name}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
