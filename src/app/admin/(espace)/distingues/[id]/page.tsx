import { notFound } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { requireStaff } from '@/lib/admin/auth';
import { adminCategories, adminDistingue } from '@/lib/admin/queries';
import { PageHeader } from '@/components/admin/PageHeader';
import { DistingueForm } from '@/components/admin/DistingueForm';
import { ConfirmSubmitButton } from '@/components/admin/ActionForm';
import { deleteDistingue, updateDistingue } from '../actions';

export const metadata = { title: 'Modifier un distingué' };

export default async function EditDistinguePage({ params }: { params: { id: string } }) {
  await requireStaff();
  const [distingue, categories] = await Promise.all([adminDistingue(params.id), adminCategories()]);
  if (!distingue) notFound();

  return (
    <div>
      <PageHeader title={distingue.name} description={`Adresse publique : /distingues/${distingue.slug}`} />
      <DistingueForm
        action={updateDistingue.bind(null, distingue.id)}
        categories={categories}
        distingue={distingue}
      />
      <form action={deleteDistingue.bind(null, distingue.id)} className="mt-8 max-w-3xl">
        <ConfirmSubmitButton
          size="sm"
          confirmMessage={`Supprimer définitivement la fiche de ${distingue.name} ?`}
        >
          <Trash2 className="h-4 w-4" /> Supprimer cette fiche
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
