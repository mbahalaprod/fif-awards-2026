import { requireAdmin } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { SwitchField, TextField } from '@/components/admin/fields';
import type { ParametresRow } from '@/lib/mappers';
import { updateSettings } from './actions';

export const metadata = { title: 'Réglages' };

export default async function SettingsPage() {
  await requireAdmin();
  const { data: p } = await createSessionClient()
    .from('parametres')
    .select('*')
    .eq('id', 1)
    .single<ParametresRow>();
  if (!p) return <p className="text-bordeaux">Réglages introuvables : la migration a-t-elle été exécutée ?</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Réglages" description="Réservé aux administrateurs. Les changements sont immédiats." />
      <ActionForm action={updateSettings} className="space-y-10">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-text-primary">Interrupteurs</h2>
          <SwitchField
            name="distingues_visibles"
            label="Distingués visibles sur le site"
            hint="À allumer le jour de l'annonce officielle. Seules les fiches « Publié » apparaissent."
            defaultChecked={p.distingues_visibles}
          />
          <SwitchField
            name="candidatures_ouvertes"
            label="Candidatures ouvertes"
            hint="Le formulaire n'est affiché que si cet interrupteur est allumé et la date du jour dans la période ci-dessous."
            defaultChecked={p.candidatures_ouvertes}
          />
          <SwitchField
            name="vote_actif"
            label="Vote du public"
            hint="Désactivé pour l'édition 2026. Nécessite l'envoi d'e-mails (Resend) pour fonctionner."
            defaultChecked={p.vote_actif}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-text-primary">Dates des candidatures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              name="candidatures_ouverture"
              label="Ouverture"
              type="date"
              defaultValue={p.candidatures_ouverture ?? ''}
            />
            <TextField
              name="candidatures_cloture"
              label="Clôture (incluse)"
              type="date"
              defaultValue={p.candidatures_cloture ?? ''}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-text-primary">Identité et coordonnées</h2>
          <TextField name="slogan" label="Slogan 2026" defaultValue={p.slogan} />
          <TextField name="adresse" label="Adresse" defaultValue={p.adresse} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField name="telephone" label="Téléphone" type="tel" placeholder="+224 …" defaultValue={p.telephone ?? ''} />
            <TextField name="whatsapp" label="WhatsApp" type="tel" placeholder="+224 …" defaultValue={p.whatsapp ?? ''} />
          </div>
          <TextField name="email" label="Email de contact" type="email" defaultValue={p.email ?? ''} />
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-text-primary">Réseaux sociaux</h2>
          <p className="text-xs text-text-secondary -mt-2">Laissez vide pour masquer l&apos;icône.</p>
          {(
            [
              ['facebook_url', 'Facebook', p.facebook_url],
              ['instagram_url', 'Instagram', p.instagram_url],
              ['youtube_url', 'YouTube', p.youtube_url],
              ['tiktok_url', 'TikTok', p.tiktok_url],
              ['linkedin_url', 'LinkedIn', p.linkedin_url],
            ] as const
          ).map(([name, label, value]) => (
            <TextField key={name} name={name} label={label} type="url" placeholder="https://" defaultValue={value ?? ''} />
          ))}
        </section>

        <div className="pt-4 border-t border-border">
          <SubmitButton>Enregistrer les réglages</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
