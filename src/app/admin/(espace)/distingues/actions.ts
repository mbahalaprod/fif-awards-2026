'use server';

import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import {
  done,
  fail,
  integer,
  optionalText,
  refreshPublicSite,
  text,
  uniqueSlug,
} from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

function readDistingue(formData: FormData) {
  return {
    nom_complet: text(formData, 'nom_complet'),
    categorie_id: text(formData, 'categorie_id'),
    metier: optionalText(formData, 'metier'),
    citation: optionalText(formData, 'citation'),
    biographie: optionalText(formData, 'biographie'),
    photo_url: optionalText(formData, 'photo_url'),
    statut: text(formData, 'statut') === 'publie' ? 'publie' : 'brouillon',
    ordre: integer(formData, 'ordre'),
  };
}

function validate(values: ReturnType<typeof readDistingue>): string | null {
  if (values.nom_complet.length < 2) return 'Le nom complet est obligatoire.';
  if (!values.categorie_id) return 'Choisissez une catégorie.';
  return null;
}

export async function createDistingue(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const values = readDistingue(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  const supabase = createSessionClient();
  const slug = await uniqueSlug(supabase, 'distingues', values.nom_complet);
  const { error } = await supabase.from('distingues').insert({ ...values, slug });
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  redirect('/admin/distingues?ajout=1');
}

export async function updateDistingue(
  id: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();
  const values = readDistingue(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  const supabase = createSessionClient();
  const slug = await uniqueSlug(supabase, 'distingues', values.nom_complet, id);
  const { error } = await supabase.from('distingues').update({ ...values, slug }).eq('id', id);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  return done(values.statut === 'publie' ? 'Fiche enregistrée et publiée.' : 'Brouillon enregistré.');
}

export async function deleteDistingue(id: string): Promise<void> {
  await requireStaff();
  await createSessionClient().from('distingues').delete().eq('id', id);
  refreshPublicSite();
  redirect('/admin/distingues');
}

export async function setDistingueStatus(id: string, statut: 'publie' | 'brouillon'): Promise<void> {
  await requireStaff();
  await createSessionClient().from('distingues').update({ statut }).eq('id', id);
  refreshPublicSite();
}
