import { requireStaff } from '@/lib/admin/auth';
import { adminCategories } from '@/lib/admin/queries';
import { PageHeader } from '@/components/admin/PageHeader';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { TextAreaField, TextField } from '@/components/admin/fields';
import { updateCategory } from './actions';

export const metadata = { title: 'Catégories' };

export default async function CategoriesAdminPage() {
  await requireStaff();
  const categories = await adminCategories();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Catégories"
        description="Les distinctions d'honneur de l'édition : textes et ordre d'affichage."
      />
      <div className="space-y-6">
        {categories.map((category) => (
          <ActionForm
            key={category.id}
            action={updateCategory.bind(null, category.id)}
            className="card-gold p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_8rem] gap-4">
              <TextField name="nom" label="Nom" required defaultValue={category.name} />
              <TextField name="ordre" label="Ordre" type="number" defaultValue={category.order} />
            </div>
            <TextAreaField
              name="description"
              label="Description"
              rows={3}
              defaultValue={category.description}
            />
            <SubmitButton size="sm">Enregistrer</SubmitButton>
          </ActionForm>
        ))}
      </div>
    </div>
  );
}
