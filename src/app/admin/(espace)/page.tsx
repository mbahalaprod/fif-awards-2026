import Link from 'next/link';
import { Award, CalendarCheck, Inbox, Mail, ShieldAlert } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';

export const metadata = { title: 'Tableau de bord' };

async function count(
  table: string,
  filter?: { column: string; value: string | boolean },
): Promise<number> {
  let query = createSessionClient().from(table).select('id', { count: 'exact', head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count: total } = await query;
  return total ?? 0;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { refus?: string };
}) {
  const staff = await requireStaff();
  const [distingues, publies, candidatures, messages, reservations, settings] = await Promise.all([
    count('distingues'),
    count('distingues', { column: 'statut', value: 'publie' }),
    count('candidatures', { column: 'statut', value: 'nouvelle' }),
    count('messages', { column: 'lu', value: false }),
    count('reservations', { column: 'statut', value: 'en_attente' }),
    createSessionClient()
      .from('parametres')
      .select('vote_actif, candidatures_ouvertes, distingues_visibles')
      .eq('id', 1)
      .single(),
  ]);

  const cards = [
    {
      href: '/admin/distingues',
      icon: Award,
      label: 'Distingués',
      value: distingues,
      detail: `${publies} publié${publies > 1 ? 's' : ''}`,
    },
    { href: '/admin/candidatures', icon: Inbox, label: 'Candidatures à traiter', value: candidatures },
    { href: '/admin/messages', icon: Mail, label: 'Messages non lus', value: messages },
    { href: '/admin/reservations', icon: CalendarCheck, label: 'Réservations en attente', value: reservations },
  ];

  const switches = settings.data
    ? [
        ['Distingués visibles sur le site', settings.data.distingues_visibles],
        ['Candidatures ouvertes', settings.data.candidatures_ouvertes],
        ['Vote du public', settings.data.vote_actif],
      ]
    : [];

  return (
    <div className="max-w-5xl">
      <h1 className="font-serif text-3xl text-text-primary mb-1">Tableau de bord</h1>
      <p className="text-sm text-text-secondary mb-8">Bienvenue, {staff.email}.</p>

      {searchParams.refus && (
        <div className="flex items-center gap-3 card-gold border-bordeaux p-4 mb-6 text-sm">
          <ShieldAlert className="h-5 w-5 text-bordeaux shrink-0" />
          Cette page est réservée aux administrateurs.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ href, icon: Icon, label, value, detail }) => (
          <Link key={href} href={href} className="card-gold p-5 block">
            <Icon className="h-5 w-5 text-gold mb-3" />
            <p className="font-serif text-3xl text-text-primary">{value}</p>
            <p className="text-xs uppercase tracking-wider text-text-secondary mt-1">{label}</p>
            {detail && <p className="text-xs text-text-secondary mt-1">{detail}</p>}
          </Link>
        ))}
      </div>

      <h2 className="font-serif text-xl text-text-primary mb-4">État du site</h2>
      <ul className="card-gold divide-y divide-border">
        {switches.map(([label, on]) => (
          <li key={String(label)} className="flex items-center justify-between p-4 text-sm">
            <span className="text-text-primary">{label}</span>
            <span className={on ? 'text-green-400' : 'text-text-secondary'}>
              {on ? 'Activé' : 'Désactivé'}
            </span>
          </li>
        ))}
      </ul>
      {staff.role === 'admin' && (
        <p className="text-xs text-text-secondary mt-3">
          Ces interrupteurs se changent dans{' '}
          <Link href="/admin/reglages" className="text-gold hover:underline">
            Réglages
          </Link>
          .
        </p>
      )}
    </div>
  );
}
