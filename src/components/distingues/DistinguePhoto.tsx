import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DistinguePhotoProps {
  name: string;
  photoUrl: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

/** Photo d'un distingué, ou ses initiales sur fond sombre si aucune photo n'est fournie. */
export function DistinguePhoto({ name, photoUrl, sizes, priority, className }: DistinguePhotoProps) {
  if (!photoUrl) {
    return (
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background-secondary to-background-primary',
          className,
        )}
        aria-hidden="true"
      >
        <span className="font-serif text-6xl text-gold/60">{initials(name)}</span>
      </div>
    );
  }
  return (
    <Image
      src={photoUrl}
      alt={name}
      fill
      priority={priority}
      sizes={sizes}
      className={cn('object-cover', className)}
    />
  );
}
