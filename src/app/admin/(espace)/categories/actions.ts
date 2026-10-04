'use server';

import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { done, fail, integer, refreshPublicSite, text } from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

export async function updateCategory(id: string, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const nom = text(formData, 'nom');
  if (nom.length < 2) return fail('Le nom est obligatoire.');

  const { error } = await createSessionClient()
    .from('categories')
    .update({ nom, description: text(formData, 'description'), ordre: integer(formData, 'ordre') })
    .eq('id', id);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  return done('Catégorie enregistrée.');
}
