import { requireStaff } from '@/lib/admin/auth';
import { adminCategories } from '@/lib/admin/queries';
import { PageHeader } from '@/components/admin/PageHeader';
import { DistingueForm } from '@/components/admin/DistingueForm';
import { createDistingue } from '../actions';

export const metadata = { title: 'Ajouter un distingué' };

export default async function NewDistinguePage() {
  await requireStaff();
  const categories = await adminCategories();
  return (
    <div>
      <PageHeader title="Ajouter un distingué" description="La fiche est créée en brouillon par défaut." />
      <DistingueForm action={createDistingue} categories={categories} />
    </div>
  );
}
