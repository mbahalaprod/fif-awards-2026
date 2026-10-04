import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/admin/PageHeader';
import { ExportLink } from '@/components/admin/ExportLink';
import { SubmitButton } from '@/components/admin/ActionForm';
import { setMessageRead } from '../inbox-actions';

export const metadata = { title: 'Messages' };

export default async function MessagesAdminPage() {
  await requireStaff();
  const { data } = await createSessionClient()
    .from('messages')
    .select('id, nom, email, sujet, texte, lu, created_at')
    .order('created_at', { ascending: false });
  const messages = data ?? [];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl text-text-primary">Messages</h1>
        <ExportLink table="messages" />
      </div>
      {messages.length === 0 ? (
        <EmptyState>Aucun message.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className={`card-gold p-5 ${m.lu ? 'opacity-70' : '!border-gold/50'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-text-primary">
                    {!m.lu && <span className="inline-block w-2 h-2 rounded-full bg-gold mr-2 align-middle" />}
                    {m.nom} · <span className="text-gold">{m.sujet}</span>
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(m.created_at).toLocaleString('fr-FR')} ·{' '}
                    <a href={`mailto:${m.email}`} className="hover:text-gold">
                      {m.email}
                    </a>
                  </p>
                </div>
                <form action={setMessageRead.bind(null, m.id, !m.lu)}>
                  <SubmitButton variant="ghost" size="sm">
                    {m.lu ? 'Marquer non lu' : 'Marquer comme lu'}
                  </SubmitButton>
                </form>
              </div>
              <p className="text-sm text-text-secondary whitespace-pre-line">{m.texte}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
