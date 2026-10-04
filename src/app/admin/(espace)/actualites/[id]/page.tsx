import { notFound } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActualiteForm, type ActualiteFormValues } from '@/components/admin/ActualiteForm';
import { ConfirmSubmitButton } from '@/components/admin/ActionForm';
import { deleteActualite, updateActualite } from '../actions';

export const metadata = { title: 'Modifier une actualité' };

export default async function EditActualitePage({ params }: { params: { id: string } }) {
  await requireStaff();
  const { data: actualite } = await createSessionClient()
    .from('actualites')
    .select('slug, titre, date_publication, texte, image_url, statut')
    .eq('id', params.id)
    .maybeSingle<ActualiteFormValues & { slug: string }>();
  if (!actualite) notFound();

  return (
    <div>
      <PageHeader title={actualite.titre} description={`Adresse publique : /blog/${actualite.slug}`} />
      <ActualiteForm action={updateActualite.bind(null, params.id)} actualite={actualite} />
      <form action={deleteActualite.bind(null, params.id)} className="mt-8">
        <ConfirmSubmitButton size="sm" confirmMessage="Supprimer définitivement cette actualité ?">
          <Trash2 className="h-4 w-4" /> Supprimer cette actualité
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
