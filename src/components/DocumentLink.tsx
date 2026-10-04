import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentLinkProps {
  href: string | null;
  label: string;
  className?: string;
}

/** Bouton de téléchargement, ou mention « Bientôt disponible » si le document n'est pas encore publié. */
export function DocumentLink({ href, label, className = 'btn-outline-gold' }: DocumentLinkProps) {
  if (!href) {
    return (
      <span className={cn(className, 'opacity-50 cursor-not-allowed pointer-events-none')} aria-disabled="true">
        <Download className="h-4 w-4" /> {label} · bientôt disponible
      </span>
    );
  }
  return (
    <a href={href} className={className} download>
      <Download className="h-4 w-4" /> {label}
    </a>
  );
}
