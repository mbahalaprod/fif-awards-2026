import { ExternalLink } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { EmptyState, StatusBadge } from '@/components/admin/PageHeader';
import { AutoSubmitSelect } from '@/components/admin/AutoSubmitSelect';
import { ExportLink } from '@/components/admin/ExportLink';
import { setCandidatureStatus } from '../inbox-actions';

export const metadata = { title: 'Candidatures' };

const STATUS_OPTIONS = [
  { value: 'nouvelle', label: 'Nouvelle' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'retenue', label: 'Retenue' },
  { value: 'refusee', label: 'Refusée' },
];

interface CandidatureRow {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  oeuvre_parcours: string;
  lien: string | null;
  message: string | null;
  statut: string;
  created_at: string;
  categories: { nom: string } | null;
}

export default async function CandidaturesAdminPage({
  searchParams,
}: {
  searchParams: { statut?: string };
}) {
  await requireStaff();
  let query = createSessionClient()
    .from('candidatures')
    .select('id, nom, email, telephone, oeuvre_parcours, lien, message, statut, created_at, categories(nom)')
    .order('created_at', { ascending: false });
  if (searchParams.statut) query = query.eq('statut', searchParams.statut);
  const { data } = await query.returns<CandidatureRow[]>();
  const candidatures = data ?? [];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-text-primary">Candidatures</h1>
          <p className="text-sm text-text-secondary mt-1">
            Données personnelles : réservées à l&apos;équipe, ne pas diffuser.
          </p>
        </div>
        <ExportLink table="candidatures" />
      </div>

      <nav className="flex flex-wrap gap-2 mb-6 text-xs">
        {[{ value: '', label: 'Toutes' }, ...STATUS_OPTIONS].map((o) => (
          <a
            key={o.value}
            href={o.value ? `?statut=${o.value}` : '?'}
            className={`px-3 py-1.5 rounded-full border ${
              (searchParams.statut ?? '') === o.value
                ? 'border-gold bg-gold text-background-primary'
                : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {o.label}
          </a>
        ))}
      </nav>

      {candidatures.length === 0 ? (
        <EmptyState>Aucune candidature.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {candidatures.map((c) => (
            <li key={c.id} className="card-gold p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-serif text-lg text-text-primary">{c.nom}</p>
                  <p className="text-xs text-text-secondary">
                    {new Date(c.created_at).toLocaleString('fr-FR')} · {c.categories?.nom ?? 'Catégorie supprimée'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.statut} />
                  <form action={setCandidatureStatus.bind(null, c.id)}>
                    <AutoSubmitSelect
                      name="statut"
                      label="Changer le statut"
                      defaultValue={c.statut}
                      options={STATUS_OPTIONS}
                    />
                  </form>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                <a href={`mailto:${c.email}`} className="text-gold hover:underline">
                  {c.email}
                </a>{' '}
                ·{' '}
                <a href={`tel:${c.telephone.replace(/\s/g, '')}`} className="hover:text-text-primary">
                  {c.telephone}
                </a>
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer text-text-primary">Œuvre ou parcours</summary>
                <p className="mt-2 text-text-secondary whitespace-pre-line">{c.oeuvre_parcours}</p>
                {c.message && (
                  <>
                    <p className="mt-3 text-text-primary">Message</p>
                    <p className="text-text-secondary whitespace-pre-line">{c.message}</p>
                  </>
                )}
              </details>
              {c.lien && (
                <a
                  href={c.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gold hover:underline mt-3 break-all"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" /> {c.lien}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
