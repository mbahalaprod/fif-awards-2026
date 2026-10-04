import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/PageHeader';
import { TIER_OPTIONS } from '@/components/admin/fields';

export const metadata = { title: 'Sponsors' };

export default async function SponsorsAdminPage() {
  await requireStaff();
  const { data } = await createSessionClient()
    .from('sponsors')
    .select('id, nom, palier, logo_url, statut, ordre')
    .order('ordre')
    .order('nom');
  const sponsors = data ?? [];

  return (
    <div className="max-w-5xl">
      <PageHeader title="Sponsors" action={{ href: '/admin/sponsors/nouveau', label: 'Ajouter' }} />
      {TIER_OPTIONS.map((tier) => {
        const list = sponsors.filter((s) => s.palier === tier.value);
        return (
          <section key={tier.value} className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              {tier.label} · {list.length}
            </h2>
            {list.length === 0 ? (
              <EmptyState>Aucun sponsor dans ce palier.</EmptyState>
            ) : (
              <ul className="card-gold divide-y divide-border">
                {list.map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-4 p-4">
                    <div className="h-12 w-20 rounded bg-background-primary shrink-0 flex items-center justify-center overflow-hidden">
                      {s.logo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.logo_url} alt="" className="max-h-full max-w-full object-contain" />
                      )}
                    </div>
                    <p className="flex-1 min-w-[8rem] text-text-primary">{s.nom}</p>
                    <StatusBadge status={s.statut} />
                    <Link
                      href={`/admin/sponsors/${s.id}`}
                      className="inline-flex items-center gap-2 h-9 px-3 text-xs rounded-md border border-gold text-gold hover:bg-gold hover:text-background-primary"
                    >
                      <Pencil className="h-4 w-4" /> Modifier
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
