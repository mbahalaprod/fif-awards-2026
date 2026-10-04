import Link from 'next/link';
import { Plus } from 'lucide-react';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl text-text-primary">{title}</h1>
        {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-md text-sm font-medium bg-gold text-background-primary hover:bg-gold-light"
        >
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    publie: 'border-green-700 text-green-400',
    brouillon: 'border-border text-text-secondary',
    nouvelle: 'border-gold text-gold',
    en_cours: 'border-blue-700 text-blue-400',
    retenue: 'border-green-700 text-green-400',
    refusee: 'border-bordeaux text-red-400',
    en_attente: 'border-gold text-gold',
    confirmee: 'border-green-700 text-green-400',
    annulee: 'border-bordeaux text-red-400',
  };
  const labels: Record<string, string> = {
    publie: 'Publié',
    brouillon: 'Brouillon',
    nouvelle: 'Nouvelle',
    en_cours: 'En cours',
    retenue: 'Retenue',
    refusee: 'Refusée',
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    annulee: 'Annulée',
  };
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 whitespace-nowrap ${styles[status] ?? 'border-border text-text-secondary'}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="card-gold p-10 text-center text-text-secondary">{children}</div>;
}
