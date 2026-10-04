import { Trash2 } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, ConfirmSubmitButton, SubmitButton } from '@/components/admin/ActionForm';
import { AutoSubmitSelect } from '@/components/admin/AutoSubmitSelect';
import { SelectField, TextField } from '@/components/admin/fields';
import { createAccount, deleteAccount, resetAccountPassword, updateAccountRole } from './actions';

export const metadata = { title: 'Comptes' };

const ROLE_OPTIONS = [
  { value: 'editeur', label: 'Éditeur (contenus seulement)' },
  { value: 'admin', label: 'Administrateur (tous les droits)' },
];

export default async function AccountsPage() {
  const me = await requireAdmin();
  const { data } = await createSessionClient()
    .from('administrateurs')
    .select('user_id, email, role, created_at')
    .order('created_at');
  const accounts = data ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Comptes"
        description="Comptes nominatifs, jamais partagés. Aucune inscription publique n'est possible."
      />

      <ul className="space-y-4 mb-12">
        {accounts.map((a) => {
          const isMe = a.user_id === me.userId;
          return (
            <li key={a.user_id} className="card-gold p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-text-primary break-all">
                  {a.email} {isMe && <span className="text-xs text-gold">(vous)</span>}
                </p>
                {isMe ? (
                  <span className="text-xs text-text-secondary">Administrateur</span>
                ) : (
                  <form action={updateAccountRole.bind(null, a.user_id)}>
                    <AutoSubmitSelect name="role" label="Rôle" defaultValue={a.role} options={ROLE_OPTIONS} />
                  </form>
                )}
              </div>
              {!isMe && (
                <div className="flex flex-wrap items-end gap-3 pt-4 border-t border-border">
                  <ActionForm
                    action={resetAccountPassword.bind(null, a.user_id)}
                    resetOnSuccess
                    className="flex flex-wrap items-end gap-3 flex-1"
                  >
                    <TextField
                      name="password"
                      label="Nouveau mot de passe"
                      type="password"
                      autoComplete="new-password"
                      minLength={12}
                      className="flex-1 min-w-[12rem]"
                    />
                    <SubmitButton size="sm" variant="secondary">
                      Changer
                    </SubmitButton>
                  </ActionForm>
                  <form action={deleteAccount.bind(null, a.user_id)}>
                    <ConfirmSubmitButton size="sm" confirmMessage={`Supprimer le compte ${a.email} ?`}>
                      <Trash2 className="h-4 w-4" /> Supprimer
                    </ConfirmSubmitButton>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="font-serif text-xl text-text-primary mb-4">Créer un compte</h2>
      <ActionForm action={createAccount} resetOnSuccess className="card-gold p-6 space-y-4">
        <TextField name="email" label="Email (adresse du festival de préférence)" type="email" required />
        <TextField
          name="password"
          label="Mot de passe provisoire"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          hint="12 caractères minimum. À transmettre en main propre ; la personne le change ensuite dans « Mon compte »."
        />
        <SelectField name="role" label="Rôle" defaultValue="editeur" options={ROLE_OPTIONS} />
        <SubmitButton>Créer le compte</SubmitButton>
      </ActionForm>
    </div>
  );
}
