'use client';

import { useState } from 'react';
import { NomineeCard } from './NomineeCard';
import { cn } from '@/lib/utils';
import type { Nominee } from '@/types/nominee';
import type { Category } from '@/types/category';

interface NomineesGridProps {
  nominees: Nominee[];
  categories: Category[];
}

export function NomineesGrid({ nominees, categories }: NomineesGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered =
    activeCategory === 'all' ? nominees : nominees.filter((n) => n.categoryId === activeCategory);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={cn(
            'px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-colors',
            activeCategory === 'all'
              ? 'bg-gold text-background-primary border-gold'
              : 'border-border text-text-secondary hover:text-text-primary hover:border-gold/50',
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-colors',
              activeCategory === cat.id
                ? 'bg-gold text-background-primary border-gold'
                : 'border-border text-text-secondary hover:text-text-primary hover:border-gold/50',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((nominee) => (
            <NomineeCard key={nominee.id} nominee={nominee} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-secondary py-12">
          Aucun nominé dans cette catégorie pour le moment.
        </p>
      )}
    </div>
  );
}
