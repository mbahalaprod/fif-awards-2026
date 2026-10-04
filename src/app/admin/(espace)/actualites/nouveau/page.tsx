import { requireStaff } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActualiteForm } from '@/components/admin/ActualiteForm';
import { createActualite } from '../actions';

export const metadata = { title: 'Ajouter une actualité' };

export default async function NewActualitePage() {
  await requireStaff();
  return (
    <div>
      <PageHeader title="Ajouter une actualité" />
      <ActualiteForm action={createActualite} />
    </div>
  );
}
