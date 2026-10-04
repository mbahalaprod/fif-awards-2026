'use server';

import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { done, fail, text } from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

export async function changeOwnPassword(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const password = text(formData, 'password');
  if (password.length < 12) return fail('Le mot de passe doit comporter au moins 12 caractères.');
  if (password !== text(formData, 'confirmation')) return fail('Les deux mots de passe ne correspondent pas.');

  const { error } = await createSessionClient().auth.updateUser({ password });
  if (error) return fail(`Modification impossible : ${error.message}`);
  return done('Mot de passe modifié.');
}
