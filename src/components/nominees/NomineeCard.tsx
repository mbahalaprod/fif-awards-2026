import Link from 'next/link';
import Image from 'next/image';
import type { Nominee } from '@/types/nominee';
import { getCategoryById } from '@/lib/data';

interface NomineeCardProps {
  nominee: Nominee;
  showCategory?: boolean;
}

export function NomineeCard({ nominee, showCategory = true }: NomineeCardProps) {
  const category = getCategoryById(nominee.categoryId);
  return (
    <Link href={`/nomines/${nominee.slug}`} className="card-gold group overflow-hidden block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={nominee.photoUrl}
          alt={nominee.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {showCategory && category && (
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold mb-2">
              {category.name}
            </span>
          )}
          <h3 className="font-serif text-lg md:text-xl text-text-primary leading-tight">
            {nominee.name}
          </h3>
          <p className="text-xs text-text-secondary mt-1">{nominee.role}</p>
        </div>
      </div>
    </Link>
  );
}
