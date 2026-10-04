import { requireStaff } from '@/lib/admin/auth';
import { PageHeader } from '@/components/admin/PageHeader';
import { SponsorForm } from '@/components/admin/SponsorForm';
import { createSponsor } from '../actions';

export const metadata = { title: 'Ajouter un sponsor' };

export default async function NewSponsorPage() {
  await requireStaff();
  return (
    <div>
      <PageHeader title="Ajouter un sponsor" />
      <SponsorForm action={createSponsor} />
    </div>
  );
}
