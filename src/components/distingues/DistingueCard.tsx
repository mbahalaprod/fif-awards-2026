import Link from 'next/link';
import type { Distingue } from '@/types/distingue';
import { DistinguePhoto } from './DistinguePhoto';

interface DistingueCardProps {
  distingue: Distingue;
  categoryName?: string;
}

export function DistingueCard({ distingue, categoryName }: DistingueCardProps) {
  return (
    <Link href={`/distingues/${distingue.slug}`} className="card-gold group overflow-hidden block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <DistinguePhoto
          name={distingue.name}
          photoUrl={distingue.photoUrl}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {categoryName && (
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold mb-2">
              {categoryName}
            </span>
          )}
          <h3 className="font-serif text-lg md:text-xl text-text-primary leading-tight">
            {distingue.name}
          </h3>
          {distingue.metier && (
            <p className="text-xs text-text-secondary mt-1">{distingue.metier}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
