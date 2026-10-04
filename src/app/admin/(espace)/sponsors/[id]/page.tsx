import { notFound } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/PageHeader';
import { SponsorForm, type SponsorFormValues } from '@/components/admin/SponsorForm';
import { ConfirmSubmitButton } from '@/components/admin/ActionForm';
import { deleteSponsor, updateSponsor } from '../actions';

export const metadata = { title: 'Modifier un sponsor' };

export default async function EditSponsorPage({ params }: { params: { id: string } }) {
  await requireStaff();
  const { data: sponsor } = await createSessionClient()
    .from('sponsors')
    .select('nom, palier, description, logo_url, site_url, statut, ordre')
    .eq('id', params.id)
    .maybeSingle<SponsorFormValues>();
  if (!sponsor) notFound();

  return (
    <div>
      <PageHeader title={sponsor.nom} />
      <SponsorForm action={updateSponsor.bind(null, params.id)} sponsor={sponsor} />
      <form action={deleteSponsor.bind(null, params.id)} className="mt-8">
        <ConfirmSubmitButton size="sm" confirmMessage={`Supprimer définitivement ${sponsor.nom} ?`}>
          <Trash2 className="h-4 w-4" /> Supprimer ce sponsor
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
