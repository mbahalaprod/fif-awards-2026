'use server';

import { redirect } from 'next/navigation';
import { requireStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import {
  done,
  fail,
  integer,
  optionalText,
  optionalUrl,
  refreshPublicSite,
  text,
} from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

const TIERS = ['platine', 'or', 'argent', 'bronze'];

function readSponsor(formData: FormData) {
  return {
    nom: text(formData, 'nom'),
    palier: text(formData, 'palier'),
    description: optionalText(formData, 'description'),
    logo_url: optionalText(formData, 'logo_url'),
    site_url: optionalUrl(formData, 'site_url'),
    statut: text(formData, 'statut') === 'publie' ? 'publie' : 'brouillon',
    ordre: integer(formData, 'ordre'),
  };
}

function validate(values: ReturnType<typeof readSponsor>): string | null {
  if (values.nom.length < 2) return 'Le nom est obligatoire.';
  if (!TIERS.includes(values.palier)) return 'Choisissez un palier.';
  if (values.site_url === 'invalid') return 'Le lien du site doit commencer par https://';
  return null;
}

export async function createSponsor(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const values = readSponsor(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  const { error } = await createSessionClient().from('sponsors').insert(values);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  redirect('/admin/sponsors');
}

export async function updateSponsor(id: string, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireStaff();
  const values = readSponsor(formData);
  const invalid = validate(values);
  if (invalid) return fail(invalid);

  const { error } = await createSessionClient().from('sponsors').update(values).eq('id', id);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  return done('Sponsor enregistré.');
}

export async function deleteSponsor(id: string): Promise<void> {
  await requireStaff();
  await createSessionClient().from('sponsors').delete().eq('id', id);
  refreshPublicSite();
  redirect('/admin/sponsors');
}
