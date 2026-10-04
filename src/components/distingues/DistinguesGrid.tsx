'use client';

import { useState } from 'react';
import { DistingueCard } from './DistingueCard';
import { cn } from '@/lib/utils';
import type { Distingue } from '@/types/distingue';
import type { Category } from '@/types/category';

interface DistinguesGridProps {
  distingues: Distingue[];
  categories: Category[];
}

export function DistinguesGrid({ distingues, categories }: DistinguesGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered =
    activeCategory === 'all'
      ? distingues
      : distingues.filter((d) => d.categoryId === activeCategory);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        {[{ id: 'all', name: 'Toutes les distinctions' }, ...categories].map((cat) => (
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

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((distingue) => (
            <DistingueCard
              key={distingue.id}
              distingue={distingue}
              categoryName={categoryName(distingue.categoryId)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-secondary py-12">
          Aucun distingué dans cette catégorie pour le moment.
        </p>
      )}
    </div>
  );
}
