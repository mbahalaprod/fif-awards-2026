import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { EmptyState, StatusBadge } from '@/components/admin/PageHeader';
import { ExportLink } from '@/components/admin/ExportLink';
import { SubmitButton } from '@/components/admin/ActionForm';
import { setReservationStatus } from '../inbox-actions';

export const metadata = { title: 'Réservations' };

export default async function ReservationsAdminPage() {
  await requireStaff();
  const { data } = await createSessionClient()
    .from('reservations')
    .select('id, nom, telephone, email, nombre_places, type_billet, statut, created_at')
    .order('created_at', { ascending: false });
  const reservations = data ?? [];
  const confirmedSeats = reservations
    .filter((r) => r.statut === 'confirmee')
    .reduce((sum, r) => sum + r.nombre_places, 0);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-text-primary">Réservations</h1>
          <p className="text-sm text-text-secondary mt-1">
            Confirmation manuelle, après contact et paiement. Places confirmées : {confirmedSeats}.
          </p>
        </div>
        <ExportLink table="reservations" />
      </div>
      {reservations.length === 0 ? (
        <EmptyState>Aucune réservation.</EmptyState>
      ) : (
        <div className="card-gold overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-text-secondary">
              <tr className="border-b border-border">
                <th className="p-3">Date</th>
                <th className="p-3">Nom</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Formule</th>
                <th className="p-3">Places</th>
                <th className="p-3">Statut</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 whitespace-nowrap text-text-secondary">
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-3 text-text-primary">{r.nom}</td>
                  <td className="p-3 text-text-secondary">
                    {r.telephone && (
                      <a href={`tel:${r.telephone.replace(/\s/g, '')}`} className="block hover:text-gold">
                        {r.telephone}
                      </a>
                    )}
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="block hover:text-gold break-all">
                        {r.email}
                      </a>
                    )}
                  </td>
                  <td className="p-3 text-text-secondary">{r.type_billet ?? '—'}</td>
                  <td className="p-3 text-text-primary">{r.nombre_places}</td>
                  <td className="p-3">
                    <StatusBadge status={r.statut} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      {r.statut !== 'confirmee' && (
                        <form action={setReservationStatus.bind(null, r.id, 'confirmee')}>
                          <SubmitButton size="sm" variant="secondary">
                            Confirmer
                          </SubmitButton>
                        </form>
                      )}
                      {r.statut !== 'annulee' && (
                        <form action={setReservationStatus.bind(null, r.id, 'annulee')}>
                          <SubmitButton size="sm" variant="ghost">
                            Annuler
                          </SubmitButton>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
