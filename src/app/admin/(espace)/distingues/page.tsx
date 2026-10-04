import Link from 'next/link';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { adminCategories, adminDistingues } from '@/lib/admin/queries';
import { EmptyState, PageHeader, StatusBadge } from '@/components/admin/PageHeader';
import { SubmitButton } from '@/components/admin/ActionForm';
import { setDistingueStatus } from './actions';
import { getSettings } from '@/lib/data';

export const metadata = { title: 'Distingués' };

export default async function DistinguesAdminPage({
  searchParams,
}: {
  searchParams: { ajout?: string };
}) {
  await requireStaff();
  const [distingues, categories, settings] = await Promise.all([
    adminDistingues(),
    adminCategories(),
    getSettings(),
  ]);

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Distingués"
        description="Les fiches en brouillon n'apparaissent jamais sur le site."
        action={{ href: '/admin/distingues/nouveau', label: 'Ajouter' }}
      />

      {searchParams.ajout && (
        <p className="card-gold border-green-700 p-4 mb-6 text-sm text-green-400">
          Distingué ajouté en brouillon. Publiez-le quand l&apos;annonce officielle est faite.
        </p>
      )}
      {!settings.distinguesVisible && (
        <p className="card-gold p-4 mb-6 text-sm text-text-secondary">
          L&apos;interrupteur « distingués visibles » est éteint : même publiées, les fiches restent
          cachées au public jusqu&apos;à l&apos;annonce.
        </p>
      )}

      {categories.map((category) => {
        const list = distingues.filter((d) => d.categoryId === category.id);
        return (
          <section key={category.id} className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              {category.name} · {list.length}
            </h2>
            {list.length === 0 ? (
              <EmptyState>Aucun distingué dans cette catégorie.</EmptyState>
            ) : (
              <ul className="card-gold divide-y divide-border">
                {list.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-4 p-4">
                    <div className="relative h-14 w-11 rounded overflow-hidden bg-background-primary shrink-0">
                      {d.photoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={d.photoUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-[10rem]">
                      <p className="text-text-primary">{d.name}</p>
                      <p className="text-xs text-text-secondary">
                        {d.metier ?? '—'} · ordre {d.order}
                      </p>
                    </div>
                    <StatusBadge status={d.status} />
                    <form
                      action={setDistingueStatus.bind(
                        null,
                        d.id,
                        d.status === 'publie' ? 'brouillon' : 'publie',
                      )}
                    >
                      <SubmitButton variant="ghost" size="sm">
                        {d.status === 'publie' ? (
                          <>
                            <EyeOff className="h-4 w-4" /> Dépublier
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" /> Publier
                          </>
                        )}
                      </SubmitButton>
                    </form>
                    <Link
                      href={`/admin/distingues/${d.id}`}
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
