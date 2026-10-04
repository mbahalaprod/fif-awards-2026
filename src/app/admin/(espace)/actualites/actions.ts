'use server';

import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { done, fail, optionalText, refreshPublicSite, text, uniqueSlug } from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

function readActualite(formData: FormData) {
  return {
    titre: text(formData, 'titre'),
    date_publication: text(formData, 'date_publication'),
    texte: text(formData, 'texte'),
    image_url: optionalText(formData, 'image_url'),
    statut: text(formData, 'statut') === 'publie' ? 'publie' : 'brouillon',
  };
}

function validate(values: ReturnType<typeof readActualite>): string | null {
  if (values.titre.length < 3) return 'Le titre est obligatoire.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date_publication)) return 'La date est obligatoire.';
  if (values.texte.length < 20) return 'Le texte est trop court.';
  return null;
}

export async function createActualite(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const values = readActualite(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  const supabase = createSessionClient();
  const slug = await uniqueSlug(supabase, 'actualites', values.titre);
  const { error } = await supabase.from('actualites').insert({ ...values, slug });
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  redirect('/admin/actualites');
}

export async function updateActualite(id: string, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const values = readActualite(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  // Le slug (adresse de la page) ne change pas après création, pour ne pas casser les liens partagés.
  const { error } = await createSessionClient().from('actualites').update(values).eq('id', id);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  return done(values.statut === 'publie' ? 'Actualité enregistrée et publiée.' : 'Brouillon enregistré.');
}

export async function deleteActualite(id: string): Promise<void> {
  await requireStaff();
  await createSessionClient().from('actualites').delete().eq('id', id);
  refreshPublicSite();
  redirect('/admin/actualites');
}
