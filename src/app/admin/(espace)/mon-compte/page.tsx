import { requireStaff } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { TextField } from '@/components/admin/fields';
import { changeOwnPassword } from './actions';

export const metadata = { title: 'Mon compte' };

export default async function MyAccountPage() {
  const staff = await requireStaff();
  return (
    <div className="max-w-xl">
      <PageHeader
        title="Mon compte"
        description={`${staff.email} · ${staff.role === 'admin' ? 'Administrateur' : 'Éditeur'}`}
      />
      <ActionForm action={changeOwnPassword} resetOnSuccess className="card-gold p-6 space-y-4">
        <h2 className="font-serif text-xl text-text-primary">Changer mon mot de passe</h2>
        <TextField
          name="password"
          label="Nouveau mot de passe"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          hint="12 caractères minimum, propre à ce site."
        />
        <TextField
          name="confirmation"
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
        <SubmitButton>Enregistrer</SubmitButton>
      </ActionForm>
    </div>
  );
}
