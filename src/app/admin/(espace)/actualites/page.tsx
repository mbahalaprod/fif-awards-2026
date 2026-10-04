import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/PageHeader';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Actualités' };

export default async function ActualitesAdminPage() {
  await requireStaff();
  const { data } = await createSessionClient()
    .from('actualites')
    .select('id, titre, date_publication, statut')
    .order('date_publication', { ascending: false });
  const actualites = data ?? [];

  return (
    <div className="max-w-5xl">
      <PageHeader title="Actualités" action={{ href: '/admin/actualites/nouveau', label: 'Ajouter' }} />
      {actualites.length === 0 ? (
        <EmptyState>Aucune actualité.</EmptyState>
      ) : (
        <ul className="card-gold divide-y divide-border">
          {actualites.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="flex-1 min-w-[10rem]">
                <p className="text-text-primary">{a.titre}</p>
                <p className="text-xs text-text-secondary">{formatDate(a.date_publication)}</p>
              </div>
              <StatusBadge status={a.statut} />
              <Link
                href={`/admin/actualites/${a.id}`}
                className="inline-flex items-center gap-2 h-9 px-3 text-xs rounded-md border border-gold text-gold hover:bg-gold hover:text-background-primary"
              >
                <Pencil className="h-4 w-4" /> Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
